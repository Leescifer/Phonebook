import React, { useEffect, useState } from "react";
import { listContacts, createContact } from "../../services/api.routes";
import { useAuth } from "../../hooks/hooks";

type Contact = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
};

const Homepage: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await listContacts();
      // service now returns server payload directly
      setContacts(res.data ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    try {
      await createContact({
        firstName: "New",
        lastName: "Contact",
        contactNumber: "+000",
      });
      await fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Welcome {user ? user.first_name : "Guest"}</h1>
      <button
        type="button"
        onClick={handleAdd}
        className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
      >
        Add demo contact
      </button>
      <ul>
        {contacts.map((c) => (
          <li key={c._id || c.id}>
            {c.firstName} {c.lastName} - {c.contactNumber}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Homepage;
