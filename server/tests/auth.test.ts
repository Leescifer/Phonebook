import test from "node:test";
import assert from "node:assert/strict";
import { comparePassword, hashPassword } from "../src/utils/bcrypt.ts";

test("supports legacy plain-text passwords for login", async () => {
  const isMatch = await comparePassword("Abc123!@", "Abc123!@");
  assert.equal(isMatch, true);
});

test("supports bcrypt-hashed passwords", async () => {
  const hashedPassword = await hashPassword("Abc123!@");
  const isMatch = await comparePassword("Abc123!@", hashedPassword);
  assert.equal(isMatch, true);
});
