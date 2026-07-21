import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./hooks/hooks.tsx";
import { useContacts } from "./hooks/useContact.tsx";
import { useUsers } from "./hooks/useUsers.tsx";
import { useAuthForm } from "./hooks/useAuthForm.tsx";
import { useContactForm } from "./hooks/useContactForm.tsx";
import { LoginPage } from "./pages/Login/index.tsx";
import { DashboardPage } from "./pages/Dashboard/index.tsx";

function App() {
  const { token, user, login, register, logout } = useAuth();
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [shareTargets, setShareTargets] = useState<Record<string, string>>({});

  const isAdmin = user?.role === "admin";

  const {
    contacts,
    loadContacts,
    createContact,
    updateContact,
    deleteContact,
    shareContact,
    unshareContact,
    clearContacts,
  } = useContacts(token, setError);

  const { users, loadUsers, updateUserStatus, clearUsers } = useUsers(
    token,
    setError,
  );

  useEffect(() => {
    if (token) {
      void loadContacts(token);
      void loadUsers(token);
    } else {
      clearContacts();
      clearUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredContacts = useMemo(() => {
    if (!search.trim()) {
      return contacts;
    }
    const query = search.toLowerCase();
    return contacts.filter((contact) =>
      [contact.firstName, contact.lastName, contact.phone, contact.email]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [contacts, search]);

  const authFormState = useAuthForm({ login, register }, setError);
  const contactFormState = useContactForm({ createContact, updateContact });

  const handleShare = (contactId: string) => {
    const targetUserId = shareTargets[contactId];
    if (!targetUserId) {
      setError("Choose a user to share with");
      return;
    }
    void shareContact(contactId, targetUserId);
  };

  const handleShareTargetChange = (contactId: string, userId: string) => {
    setShareTargets((current) => ({ ...current, [contactId]: userId }));
  };

  const handleLogout = () => {
    logout();
    clearContacts();
    clearUsers();
    setError("");
  };

  if (!user) {
    return (
      <LoginPage
        authMode={authFormState.authMode}
        setAuthMode={authFormState.setAuthMode}
        authForm={authFormState.authForm}
        updateField={authFormState.updateField}
        onSubmit={authFormState.submit}
        error={error}
      />
    );
  }

  return (
    <DashboardPage
      user={user}
      isAdmin={isAdmin}
      error={error}
      contacts={contacts}
      filteredContacts={filteredContacts}
      users={users}
      search={search}
      onSearchChange={setSearch}
      editingId={contactFormState.editingId}
      contactForm={contactFormState.contactForm}
      updateContactField={contactFormState.updateField}
      onContactSubmit={contactFormState.submit}
      onCancelEdit={contactFormState.cancelEdit}
      onEditContact={contactFormState.startEdit}
      onDeleteContact={deleteContact}
      shareTargets={shareTargets}
      onShareTargetChange={handleShareTargetChange}
      onShare={handleShare}
      onRemoveShare={unshareContact}
      onStatusChange={updateUserStatus}
      onLogout={handleLogout}
    />
  );
}

export default App;
