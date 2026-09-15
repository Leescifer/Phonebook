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
  const inputClass =
    "w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-black">
          {editingId ? "Edit contact" : "Add a contact"}
        </h3>
        {editingId ? (
          <button
            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
            onClick={onCancel}
          >
            Cancel
          </button>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          value={contactForm.firstName}
          onChange={(event) => updateField("firstName", event.target.value)}
          placeholder="First name"
          className={inputClass}
        />
        <input
          value={contactForm.lastName}
          onChange={(event) => updateField("lastName", event.target.value)}
          placeholder="Last name"
          className={inputClass}
        />
        <input
          value={contactForm.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="Phone"
          className={inputClass}
        />
        <input
          value={contactForm.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="Email"
          className={inputClass}
        />
        <input
          value={contactForm.photo}
          onChange={(event) => updateField("photo", event.target.value)}
          placeholder="Photo URL"
          className={inputClass}
        />
        <button
          type="submit"
          className="mt-1 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
          {editingId ? "Save changes" : "Create contact"}
        </button>
      </form>
    </div>
  );
}
