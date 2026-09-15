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
    <div className="min-h-screen w-full bg-gray-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Topbar */}
        <header className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Phonebook dashboard
            </p>
            <h2 className="mt-1 text-xl font-semibold text-black sm:text-2xl">
              Welcome back, {user.name}
            </h2>
          </div>
          <button
            onClick={onLogout}
            className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
          >
            Logout
          </button>
        </header>

        {/* Error banner */}
        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {/* Stats */}
        <StatsGrid contacts={contacts} role={user.role} />

        {/* Form + list */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
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

        {/* Admin panel */}
        {isAdmin ? (
          <AdminPanel users={users} onStatusChange={onStatusChange} />
        ) : null}
      </div>
    </div>
  );
}
