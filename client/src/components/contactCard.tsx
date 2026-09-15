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
    <article className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-start">
      <img
        src={contact.photo || fallbackPhoto}
        alt={`${contact.firstName} ${contact.lastName}`}
        className="h-16 w-16 flex-shrink-0 rounded-full border border-gray-200 object-cover sm:h-14 sm:w-14"
      />

      <div className="flex-1">
        <h4 className="font-semibold text-black">
          {contact.firstName} {contact.lastName}
        </h4>
        <p className="text-sm text-gray-500">{contact.phone}</p>
        <p className="text-sm text-gray-500">{contact.email}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {contact.sharedWith.length > 0 ? (
            contact.sharedWith.map((userId) => (
              <span
                key={userId}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
              >
                {userId}
                <button
                  className="text-gray-400 hover:text-red-600"
                  onClick={() => onRemoveShare(contact.id, userId)}
                  type="button"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-500">
              Private
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:w-44 sm:flex-shrink-0">
        <div className="flex gap-2">
          <button
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-100"
            onClick={() => onEdit(contact)}
          >
            Edit
          </button>
          <button
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-100"
            onClick={() => onDelete(contact.id)}
          >
            Delete
          </button>
        </div>
        <select
          value={shareTarget}
          onChange={(event) => onShareTargetChange(event.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-black focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
        <button
          className="w-full rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
          onClick={() => onShare(contact.id)}
        >
          Share
        </button>
      </div>
    </article>
  );
}
