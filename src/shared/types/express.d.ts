import { UserDocument } from "../../modules/auth/User.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};
