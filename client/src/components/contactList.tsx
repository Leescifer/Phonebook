import type { Contact, User } from "../types/types.tsx";
import { ContactCard } from "@/components/contactCard.tsx";

type ContactListProps = {
  contacts: Contact[];
  users: User[];
  currentUserId: string | undefined;
  search: string;
  onSearchChange: (value: string) => void;
  shareTargets: Record<string, string>;
  onShareTargetChange: (contactId: string, userId: string) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  onShare: (contactId: string) => void;
  onRemoveShare: (contactId: string, userId: string) => void;
};

export function ContactList({
  contacts,
  users,
  currentUserId,
  search,
  onSearchChange,
  shareTargets,
  onShareTargetChange,
  onEdit,
  onDelete,
  onShare,
  onRemoveShare,
}: ContactListProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-black">Contacts</h3>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search contacts"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-64"
        />
      </div>

      <div className="flex flex-col gap-3">
        {contacts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500">
            No contacts found.
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              users={users}
              currentUserId={currentUserId}
              shareTarget={shareTargets[contact.id] ?? ""}
              onShareTargetChange={(userId) =>
                onShareTargetChange(contact.id, userId)
              }
              onEdit={onEdit}
              onDelete={onDelete}
              onShare={onShare}
              onRemoveShare={onRemoveShare}
            />
          ))
        )}
      </div>
    </div>
  );
}
