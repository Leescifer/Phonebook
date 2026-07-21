import type { Contact, User } from "../types/types.tsx";
import { fallbackPhoto } from "../types/types.tsx";

type ContactCardProps = {
  contact: Contact;
  users: User[];
  currentUserId: string | undefined;
  shareTarget: string;
  onShareTargetChange: (userId: string) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  onShare: (contactId: string) => void;
  onRemoveShare: (contactId: string, userId: string) => void;
};

export function ContactCard({
  contact,
  users,
  currentUserId,
  shareTarget,
  onShareTargetChange,
  onEdit,
  onDelete,
  onShare,
  onRemoveShare,
}: ContactCardProps) {
  return (
    <article className="contact-card">
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
                  onClick={() => onRemoveShare(contact.id, userId)}
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
        <button className="secondary-btn" onClick={() => onEdit(contact)}>
          Edit
        </button>
        <button className="secondary-btn" onClick={() => onDelete(contact.id)}>
          Delete
        </button>
        <select
          value={shareTarget}
          onChange={(event) => onShareTargetChange(event.target.value)}
        >
          <option value="">Share with</option>
          {users
            .filter((u) => u.id !== currentUserId)
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
        </select>
        <button className="primary-btn" onClick={() => onShare(contact.id)}>
          Share
        </button>
      </div>
    </article>
  );
}
