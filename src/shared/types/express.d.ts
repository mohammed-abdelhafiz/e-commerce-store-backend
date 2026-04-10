import { ReqUser } from "./index";

declare global {
  namespace Express {
    interface Request {
      user?: ReqUser;
    }
  }
}

export {};