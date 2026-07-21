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
    <section className="stats-grid">
      <article className="card stat-card">
        <p>Total contacts</p>
        <strong>{contacts.length}</strong>
      </article>
      <article className="card stat-card">
        <p>Shared with</p>
        <strong>{totalShared}</strong>
      </article>
      <article className="card stat-card">
        <p>Account role</p>
        <strong>{role}</strong>
      </article>
    </section>
  );
}
