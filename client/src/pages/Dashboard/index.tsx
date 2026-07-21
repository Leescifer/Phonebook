import type { Contact, ContactForm, User } from "@/types/types.tsx";
import { StatsGrid } from "@/components/statGrid.tsx";
import { ContactFormCard } from "@/components/contactForm.tsx";
import { ContactList } from "@/components/contactList.tsx";
import { AdminPanel } from "@/components/adminPannel.tsx";

type DashboardPageProps = {
  user: User;
  isAdmin: boolean;
  error: string;
  contacts: Contact[];
  filteredContacts: Contact[];
  users: User[];
  search: string;
  onSearchChange: (value: string) => void;
  editingId: string | null;
  contactForm: ContactForm;
  updateContactField: (field: keyof ContactForm, value: string) => void;
  onContactSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  shareTargets: Record<string, string>;
  onShareTargetChange: (contactId: string, userId: string) => void;
  onShare: (contactId: string) => void;
  onRemoveShare: (contactId: string, userId: string) => void;
  onStatusChange: (userId: string, status: User["status"]) => void;
  onLogout: () => void;
};

export function DashboardPage({
  user,
  isAdmin,
  error,
  contacts,
  filteredContacts,
  users,
  search,
  onSearchChange,
  editingId,
  contactForm,
  updateContactField,
  onContactSubmit,
  onCancelEdit,
  onEditContact,
  onDeleteContact,
  shareTargets,
  onShareTargetChange,
  onShare,
  onRemoveShare,
  onStatusChange,
  onLogout,
}: DashboardPageProps) {
  return (
    <div className="app-shell dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">Phonebook dashboard</p>
          <h2>Welcome back, {user.name}</h2>
        </div>
        <button className="secondary-btn" onClick={onLogout}>
          Logout
        </button>
      </header>

      {error ? <p className="error-banner">{error}</p> : null}

      <StatsGrid contacts={contacts} role={user.role} />

      <section className="content-grid">
        <ContactFormCard
          editingId={editingId}
          contactForm={contactForm}
          updateField={updateContactField}
          onSubmit={onContactSubmit}
          onCancel={onCancelEdit}
        />
        <ContactList
          contacts={filteredContacts}
          users={users}
          currentUserId={user.id}
          search={search}
          onSearchChange={onSearchChange}
          shareTargets={shareTargets}
          onShareTargetChange={onShareTargetChange}
          onEdit={onEditContact}
          onDelete={onDeleteContact}
          onShare={onShare}
          onRemoveShare={onRemoveShare}
        />
      </section>

      {isAdmin ? (
        <AdminPanel users={users} onStatusChange={onStatusChange} />
      ) : null}
    </div>
  );
}
