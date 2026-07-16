export const isFirstNameValid = (firstName: string) => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(firstName);
};

export const isLastNameValid = (lastName: string) => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(lastName);
};

export const isEmailValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isRoleValid = (role_id: number) => {
  return role_id === 1 || role_id === 2;
};

export const isPasswordValid = (password: string): boolean => {
  const has8Chars = password.length === 8;
  const hasOneNumber = /\d/.test(password);
  const hasOneSpecial = /[^A-Za-z0-9]/.test(password);

  return has8Chars && hasOneNumber && hasOneSpecial;
};
