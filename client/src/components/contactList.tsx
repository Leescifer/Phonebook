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
    <div className="card">
      <div className="section-heading">
        <h3>Contacts</h3>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search contacts"
        />
      </div>
      <div className="contact-list">
        {contacts.map((contact) => (
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
        ))}
      </div>
    </div>
  );
}
