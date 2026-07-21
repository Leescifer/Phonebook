import type { ContactForm } from "../types/types.tsx";

type ContactFormCardProps = {
  editingId: string | null;
  contactForm: ContactForm;
  updateField: (field: keyof ContactForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function ContactFormCard({
  editingId,
  contactForm,
  updateField,
  onSubmit,
  onCancel,
}: ContactFormCardProps) {
  return (
    <div className="card">
      <div className="section-heading">
        <h3>{editingId ? "Edit contact" : "Add a contact"}</h3>
        {editingId ? (
          <button className="link-btn" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
      <form onSubmit={onSubmit} className="form-grid">
        <input
          value={contactForm.firstName}
          onChange={(event) => updateField("firstName", event.target.value)}
          placeholder="First name"
        />
        <input
          value={contactForm.lastName}
          onChange={(event) => updateField("lastName", event.target.value)}
          placeholder="Last name"
        />
        <input
          value={contactForm.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="Phone"
        />
        <input
          value={contactForm.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="Email"
        />
        <input
          value={contactForm.photo}
          onChange={(event) => updateField("photo", event.target.value)}
          placeholder="Photo URL"
        />
        <button type="submit" className="primary-btn">
          {editingId ? "Save changes" : "Create contact"}
        </button>
      </form>
    </div>
  );
}
