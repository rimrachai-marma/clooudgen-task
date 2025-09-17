import bcrypt from "bcryptjs";

export const users = [
  {
    name: "Super Admin",
    email: "superadmin@example.com",
    password: bcrypt.hashSync("12345678", 10),
    role: "superadmin",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("12345678", 10),
    role: "admin",
  },
  {
    name: "Natasha",
    email: "natasha@example.com",
    password: bcrypt.hashSync("12345678", 10),
  },
];
