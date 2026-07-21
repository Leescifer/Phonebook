import React, { useEffect, useState } from "react";
import { listContacts, createContact } from "../../services/api.routes";
import { useAuth } from "../../hooks/hooks";
import { Button } from "../../../@/components/ui/button.tsx";

const Homepage: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<unknown[]>([]);

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
      <Button onClick={handleAdd}>Add demo contact</Button>
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
