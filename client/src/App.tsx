import { useEffect, useMemo, useState } from "react";
import "./App.css";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "approved" | "pending";
};

type Contact = {
  id: string;
  ownerId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  photo: string;
  sharedWith: string[];
  createdAt: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
};

type AuthForm = {
  name: string;
  email: string;
  password: string;
};

type ContactForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  photo: string;
};

const emptyAuthForm: AuthForm = { name: "", email: "", password: "" };
const emptyContactForm: ContactForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  photo: "",
};

const fallbackPhoto =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

function App() {
  const [auth, setAuth] = useState<AuthState>({ token: null, user: null });
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState<AuthForm>(emptyAuthForm);
  const [contactForm, setContactForm] = useState<ContactForm>(emptyContactForm);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [shareTargets, setShareTargets] = useState<Record<string, string>>({});

  const isAdmin = auth.user?.role === "admin";

  const loadData = async (token: string) => {
    try {
      const [meResponse, contactsResponse, usersResponse] = await Promise.all([
        apiRequest("/api/auth/me", token),
        apiRequest("/api/contacts", token),
        apiRequest("/api/users", token),
      ]);
      setAuth((current) => ({ ...current, user: meResponse.user }));
      setContacts(contactsResponse.contacts ?? []);
      setUsers(usersResponse.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("phonebook-token");
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuth((current) => ({ ...current, token }));
      void loadData(token);
    }
  }, []);

  const filteredContacts = useMemo(() => {
    if (!search.trim()) {
      return contacts;
    }

    const query = search.toLowerCase();
    return contacts.filter((contact) => {
      return [contact.firstName, contact.lastName, contact.phone, contact.email]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [contacts, search]);

  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const endpoint =
        authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;

      const response = await apiRequest(
        endpoint,
        null,
        payload,
        authMode === "register" ? "POST" : "POST",
      );
      localStorage.setItem("phonebook-token", response.token);
      setAuth({ token: response.token, user: response.user });
      setAuthForm(emptyAuthForm);
      void loadData(response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  const handleContactSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!auth.token) {
      return;
    }

    try {
      const payload = { ...contactForm };
      if (editingId) {
        const updated = await apiRequest(
          `/api/contacts/${editingId}`,
          auth.token,
          payload,
          "PUT",
        );
        setContacts((current) =>
          current.map((contact) =>
            contact.id === editingId ? updated.contact : contact,
          ),
        );
        setEditingId(null);
      } else {
        const created = await apiRequest(
          "/api/contacts",
          auth.token,
          payload,
          "POST",
        );
        setContacts((current) => [created.contact, ...current]);
      }
      setContactForm(emptyContactForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save contact");
    }
  };

  const startEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setContactForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
      email: contact.email,
      photo: contact.photo,
    });
  };

  const handleDelete = async (contactId: string) => {
    if (!auth.token) {
      return;
    }

    try {
      await apiRequest(
        `/api/contacts/${contactId}`,
        auth.token,
        null,
        "DELETE",
      );
      setContacts((current) =>
        current.filter((contact) => contact.id !== contactId),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete contact");
    }
  };

  const handleShare = async (contactId: string) => {
    if (!auth.token) {
      return;
    }

    const targetUserId = shareTargets[contactId];
    if (!targetUserId) {
      setError("Choose a user to share with");
      return;
    }

    try {
      const updated = await apiRequest(
        `/api/contacts/${contactId}/share`,
        auth.token,
        { userId: targetUserId },
        "POST",
      );
      setContacts((current) =>
        current.map((contact) =>
          contact.id === contactId ? updated.contact : contact,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to share contact");
    }
  };

  const handleRemoveShare = async (contactId: string, userId: string) => {
    if (!auth.token) {
      return;
    }

    try {
      const updated = await apiRequest(
        `/api/contacts/${contactId}/share`,
        auth.token,
        { userId },
        "DELETE",
      );
      setContacts((current) =>
        current.map((contact) =>
          contact.id === contactId ? updated.contact : contact,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update share access",
      );
    }
  };

  const handleStatusChange = async (userId: string, status: User["status"]) => {
    if (!auth.token) {
      return;
    }

    try {
      const response = await apiRequest(
        `/api/users/${userId}/status`,
        auth.token,
        { status },
        "POST",
      );
      setUsers((current) =>
        current.map((user) => (user.id === userId ? response.user : user)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update user");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("phonebook-token");
    setAuth({ token: null, user: null });
    setContacts([]);
    setUsers([]);
    setError("");
  };

  if (!auth.user) {
    return (
      <div className="app-shell">
        <section className="hero-card">
          <div>
            <p className="eyebrow">Phonebook management system</p>
            <h1>Secure contact sharing for modern teams</h1>
            <p className="hero-copy">
              Build a connected address book with authentication, role-based
              controls, and instant contact sharing.
            </p>
          </div>
          <form className="card auth-card" onSubmit={handleAuthSubmit}>
            <div className="tabs">
              <button
                type="button"
                className={authMode === "login" ? "active" : ""}
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={authMode === "register" ? "active" : ""}
                onClick={() => setAuthMode("register")}
              >
                Register
              </button>
            </div>
            {authMode === "register" ? (
              <input
                value={authForm.name}
                onChange={(event) =>
                  setAuthForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Full name"
              />
            ) : null}
            <input
              value={authForm.email}
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              placeholder="Email address"
            />
            <input
              type="password"
              value={authForm.password}
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder="Password"
            />
            <button type="submit" className="primary-btn">
              {authMode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
        </section>
        {error ? <p className="error-banner">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="app-shell dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">Phonebook dashboard</p>
          <h2>Welcome back, {auth.user.name}</h2>
        </div>
        <button className="secondary-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {error ? <p className="error-banner">{error}</p> : null}

      <section className="stats-grid">
        <article className="card stat-card">
          <p>Total contacts</p>
          <strong>{contacts.length}</strong>
        </article>
        <article className="card stat-card">
          <p>Shared with</p>
          <strong>
            {contacts.reduce(
              (total, contact) => total + contact.sharedWith.length,
              0,
            )}
          </strong>
        </article>
        <article className="card stat-card">
          <p>Account role</p>
          <strong>{auth.user.role}</strong>
        </article>
      </section>

      <section className="content-grid">
        <div className="card">
          <div className="section-heading">
            <h3>{editingId ? "Edit contact" : "Add a contact"}</h3>
            {editingId ? (
              <button
                className="link-btn"
                onClick={() => {
                  setEditingId(null);
                  setContactForm(emptyContactForm);
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
          <form onSubmit={handleContactSubmit} className="form-grid">
            <input
              value={contactForm.firstName}
              onChange={(event) =>
                setContactForm((current) => ({
                  ...current,
                  firstName: event.target.value,
                }))
              }
              placeholder="First name"
            />
            <input
              value={contactForm.lastName}
              onChange={(event) =>
                setContactForm((current) => ({
                  ...current,
                  lastName: event.target.value,
                }))
              }
              placeholder="Last name"
            />
            <input
              value={contactForm.phone}
              onChange={(event) =>
                setContactForm((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              placeholder="Phone"
            />
            <input
              value={contactForm.email}
              onChange={(event) =>
                setContactForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              placeholder="Email"
            />
            <input
              value={contactForm.photo}
              onChange={(event) =>
                setContactForm((current) => ({
                  ...current,
                  photo: event.target.value,
                }))
              }
              placeholder="Photo URL"
            />
            <button type="submit" className="primary-btn">
              {editingId ? "Save changes" : "Create contact"}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="section-heading">
            <h3>Contacts</h3>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contacts"
            />
          </div>
          <div className="contact-list">
            {filteredContacts.map((contact) => (
              <article key={contact.id} className="contact-card">
                <img
                  src={contact.photo || fallbackPhoto}
                  alt={`${contact.firstName} ${contact.lastName}`}
                />
                <div className="contact-meta">
                  <h4>
                    {contact.firstName} {contact.lastName}
                  </h4>
                  <p>{contact.phone}</p>
                  <p>{contact.email}</p>
                  <div className="chip-row">
                    {contact.sharedWith.length > 0 ? (
                      contact.sharedWith.map((userId) => (
                        <span className="chip" key={userId}>
                          {userId}
                          <button
                            className="chip-remove"
                            onClick={() =>
                              handleRemoveShare(contact.id, userId)
                            }
                            type="button"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="chip muted">Private</span>
                    )}
                  </div>
                </div>
                <div className="contact-actions">
                  <button
                    className="secondary-btn"
                    onClick={() => startEdit(contact)}
                  >
                    Edit
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => handleDelete(contact.id)}
                  >
                    Delete
                  </button>
                  <select
                    value={shareTargets[contact.id] ?? ""}
                    onChange={(event) =>
                      setShareTargets((current) => ({
                        ...current,
                        [contact.id]: event.target.value,
                      }))
                    }
                  >
                    <option value="">Share with</option>
                    {users
                      .filter((user) => user.id !== auth.user?.id)
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                  <button
                    className="primary-btn"
                    onClick={() => handleShare(contact.id)}
                  >
                    Share
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {isAdmin ? (
        <section className="card admin-panel">
          <div className="section-heading">
            <h3>Admin user approvals</h3>
          </div>
          <div className="user-list">
            {users.map((user) => (
              <div key={user.id} className="user-row">
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
                <div className="user-actions">
                  <span className={`status-pill ${user.status}`}>
                    {user.status}
                  </span>
                  <button
                    className="secondary-btn"
                    onClick={() =>
                      handleStatusChange(
                        user.id,
                        user.status === "approved" ? "pending" : "approved",
                      )
                    }
                  >
                    {user.status === "approved" ? "Pending" : "Approve"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

async function apiRequest(
  path: string,
  token: string | null,
  body?: unknown,
  method = "GET",
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload;
}

export default App;
