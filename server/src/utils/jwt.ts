import jwt, {
  type Secret,
  type SignOptions,
  type JwtPayload,
} from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey: Secret = (() => {
  const secret = process.env.SECRET_KEY;

  if (!secret) {
    throw new Error("SECRET_KEY is not defined in the environment variables.");
  }

  return secret;
})();

export interface TokenPayload extends JwtPayload {
  id: string;
  jti: string;
  email?: string;
  role?: string;
}

export const generateToken = (
  payload: TokenPayload,
  expiresIn: SignOptions["expiresIn"] = "1h",
): string => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, secretKey) as TokenPayload;
};

export const decodeToken = (token: string): JwtPayload | string | null => {
  return jwt.decode(token);
};
