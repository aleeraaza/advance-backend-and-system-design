import { IJWTPayload } from "./auth.types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IJWTPayload;
    }
  }
}
