export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "approved" | "pending";
};

export type Contact = {
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

export type AuthForm = {
  name: string;
  email: string;
  password: string;
};

export type ContactForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  photo: string;
};

export const emptyAuthForm: AuthForm = { name: "", email: "", password: "" };

export const emptyContactForm: ContactForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  photo: "",
};

export const fallbackPhoto =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";
