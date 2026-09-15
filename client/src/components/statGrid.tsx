import type { Contact, User } from "../types/types.tsx";

type StatsGridProps = {
  contacts: Contact[];
  role: User["role"];
};

export function StatsGrid({ contacts, role }: StatsGridProps) {
  const totalShared = contacts.reduce(
    (total, contact) => total + contact.sharedWith.length,
    0,
  );

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total contacts</p>
        <strong className="mt-1 block text-2xl font-bold text-black">
          {contacts.length}
        </strong>
      </article>
      <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Shared with</p>
        <strong className="mt-1 block text-2xl font-bold text-black">
          {totalShared}
        </strong>
      </article>
      <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Account role</p>
        <strong className="mt-1 block text-2xl font-bold capitalize text-black">
          {role}
        </strong>
      </article>
    </section>
  );
}
