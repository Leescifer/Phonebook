import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pathToFileURL } from "node:url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.SERVER_PORT ?? 3000);

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  status: "approved" | "pending";
  createdAt: string;
};

type Contact = {
  id: string;
  ownerId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  photo: string;
  sharedWith: string[];
  createdAt: string;
};

type AuthenticatedRequest = Request & {
  user?: User;
};

const users: User[] = [
  {
    id: "user-admin",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    status: "approved",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
];

const contacts: Contact[] = [
  {
    id: "contact-1",
    ownerId: "user-admin",
    firstName: "Nina",
    lastName: "Patel",
    phone: "+1 555-0142",
    email: "nina@example.com",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    sharedWith: [],
    createdAt: "2026-01-02T10:00:00.000Z",
  },
];

const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: () => void,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const user = users.find((candidate) => candidate.id === token);
  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  req.user = user;
  next();
};

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { name, email, password } = req.body as Partial<User>;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }

  const exists = users.some((user) => user.email === email);
  if (exists) {
    res.status(409).json({ error: "A user with that email already exists" });
    return;
  }

  const user: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
    role: "user",
    status: "approved",
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  res.status(201).json({ token: user.id, user });
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body as Partial<User>;

  const user = users.find(
    (candidate) => candidate.email === email && candidate.password === password,
  );
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.json({ token: user.id, user });
});

app.get(
  "/api/auth/me",
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req.user });
  },
);

app.get(
  "/api/users",
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      res.json({ users: users.filter((user) => user.status === "approved") });
      return;
    }

    res.json({ users });
  },
);

app.post(
  "/api/users/:id/status",
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    const user = users.find((candidate) => candidate.id === req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const status = (req.body as { status?: User["status"] }).status;
    if (status === "approved" || status === "pending") {
      user.status = status;
      res.json({ user });
      return;
    }

    res.status(400).json({ error: "Status must be approved or pending" });
  },
);

app.get(
  "/api/contacts",
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    const visible = contacts.filter(
      (contact) =>
        contact.ownerId === req.user?.id ||
        contact.sharedWith.includes(req.user?.id ?? ""),
    );
    res.json({ contacts: visible });
  },
);

app.get(
  "/api/contacts/search",
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    const query = (req.query.q as string | undefined)?.toLowerCase() ?? "";
    const visible = contacts.filter((contact) => {
      const matches =
        contact.firstName.toLowerCase().includes(query) ||
        contact.lastName.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query);

      return (
        matches &&
        (contact.ownerId === req.user?.id ||
          contact.sharedWith.includes(req.user?.id ?? ""))
      );
    });

    res.json({ contacts: visible });
  },
);

app.post(
  "/api/contacts",
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    const { firstName, lastName, phone, email, photo } =
      req.body as Partial<Contact>;
    if (!firstName || !lastName || !phone || !email) {
      res.status(400).json({
        error: "First name, last name, phone, and email are required",
      });
      return;
    }

    const contact: Contact = {
      id: `contact-${Date.now()}`,
      ownerId: req.user?.id ?? "",
      firstName,
      lastName,
      phone,
      email,
      photo:
        photo ??
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      sharedWith: [],
      createdAt: new Date().toISOString(),
    };

    contacts.push(contact);
    res.status(201).json({ contact });
  },
);

app.put(
  "/api/contacts/:id",
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    const contact = contacts.find((entry) => entry.id === req.params.id);
    if (!contact) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }

    if (contact.ownerId !== req.user?.id) {
      res.status(403).json({ error: "Only the owner can edit a contact" });
      return;
    }

    const updates = req.body as Partial<Contact>;
    Object.assign(contact, updates);
    res.json({ contact });
  },
);

app.delete(
  "/api/contacts/:id",
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    const index = contacts.findIndex((entry) => entry.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }

    const contact = contacts[index];
    if (contact.ownerId !== req.user?.id) {
      res.status(403).json({ error: "Only the owner can delete a contact" });
      return;
    }

    contacts.splice(index, 1);
    res.json({ success: true });
  },
);

app.post(
  "/api/contacts/:id/share",
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    const contact = contacts.find((entry) => entry.id === req.params.id);
    if (!contact) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }

    if (contact.ownerId !== req.user?.id) {
      res.status(403).json({ error: "Only the owner can share a contact" });
      return;
    }

    const targetUserId = (req.body as { userId?: string }).userId;
    if (!targetUserId) {
      res.status(400).json({ error: "A target user id is required" });
      return;
    }

    if (!contact.sharedWith.includes(targetUserId)) {
      contact.sharedWith.push(targetUserId);
    }

    res.json({ contact });
  },
);

app.delete(
  "/api/contacts/:id/share",
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    const contact = contacts.find((entry) => entry.id === req.params.id);
    if (!contact) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }

    if (contact.ownerId !== req.user?.id) {
      res
        .status(403)
        .json({ error: "Only the owner can manage shared access" });
      return;
    }

    const targetUserId = (req.body as { userId?: string }).userId;
    contact.sharedWith = contact.sharedWith.filter(
      (userId) => userId !== targetUserId,
    );
    res.json({ contact });
  },
);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  startServer();
}

export { app, startServer };
