import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  if (!hashedPassword) {
    return false;
  }

  if (hashedPassword.startsWith("$2")) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  return plainPassword === hashedPassword;
};
