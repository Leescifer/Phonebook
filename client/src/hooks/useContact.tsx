import { useCallback, useState } from "react";
import { apiRequest } from "../utils/index.ts";
import type { Contact, ContactForm } from "../types/types.tsx";

export function useContacts(
  token: string | null,
  onError: (message: string) => void,
) {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const loadContacts = useCallback(
    async (authToken: string) => {
      try {
        const response = await apiRequest("/api/contacts", authToken);
        setContacts(response.contacts ?? []);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Unable to load contacts");
      }
    },
    [onError],
  );

  const createContact = useCallback(
    async (payload: ContactForm) => {
      if (!token) return;
      try {
        const created = await apiRequest(
          "/api/contacts",
          token,
          payload,
          "POST",
        );
        setContacts((current) => [created.contact, ...current]);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Unable to save contact");
      }
    },
    [token, onError],
  );

  const updateContact = useCallback(
    async (contactId: string, payload: ContactForm) => {
      if (!token) return;
      try {
        const updated = await apiRequest(
          `/api/contacts/${contactId}`,
          token,
          payload,
          "PUT",
        );
        setContacts((current) =>
          current.map((contact) =>
            contact.id === contactId ? updated.contact : contact,
          ),
        );
      } catch (err) {
        onError(err instanceof Error ? err.message : "Unable to save contact");
      }
    },
    [token, onError],
  );

  const deleteContact = useCallback(
    async (contactId: string) => {
      if (!token) return;
      try {
        await apiRequest(`/api/contacts/${contactId}`, token, null, "DELETE");
        setContacts((current) =>
          current.filter((contact) => contact.id !== contactId),
        );
      } catch (err) {
        onError(
          err instanceof Error ? err.message : "Unable to delete contact",
        );
      }
    },
    [token, onError],
  );

  const shareContact = useCallback(
    async (contactId: string, userId: string) => {
      if (!token) return;
      try {
        const updated = await apiRequest(
          `/api/contacts/${contactId}/share`,
          token,
          { userId },
          "POST",
        );
        setContacts((current) =>
          current.map((contact) =>
            contact.id === contactId ? updated.contact : contact,
          ),
        );
      } catch (err) {
        onError(err instanceof Error ? err.message : "Unable to share contact");
      }
    },
    [token, onError],
  );

  const unshareContact = useCallback(
    async (contactId: string, userId: string) => {
      if (!token) return;
      try {
        const updated = await apiRequest(
          `/api/contacts/${contactId}/unshare`,
          token,
          { userId },
          "POST",
        );
        setContacts((current) =>
          current.map((contact) =>
            contact.id === contactId ? updated.contact : contact,
          ),
        );
      } catch (err) {
        onError(
          err instanceof Error ? err.message : "Unable to update share access",
        );
      }
    },
    [token, onError],
  );

  const clearContacts = useCallback(() => setContacts([]), []);

  return {
    contacts,
    loadContacts,
    createContact,
    updateContact,
    deleteContact,
    shareContact,
    unshareContact,
    clearContacts,
  };
}
