import { useState } from "react";
import { emptyContactForm } from "@/types/types.tsx";
import type { Contact, ContactForm } from "@/types/types.tsx";

type ContactActions = {
  createContact: (payload: ContactForm) => Promise<void>;
  updateContact: (id: string, payload: ContactForm) => Promise<void>;
};

export function useContactForm({
  createContact,
  updateContact,
}: ContactActions) {
  const [contactForm, setContactForm] = useState<ContactForm>(emptyContactForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateField = (field: keyof ContactForm, value: string) => {
    setContactForm((current) => ({ ...current, [field]: value }));
  };

  const startEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setContactForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
      email: contact.email,
      photo: contact.photo,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setContactForm(emptyContactForm);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingId) {
      await updateContact(editingId, contactForm);
    } else {
      await createContact(contactForm);
    }
    setEditingId(null);
    setContactForm(emptyContactForm);
  };

  return { contactForm, updateField, editingId, startEdit, cancelEdit, submit };
}
