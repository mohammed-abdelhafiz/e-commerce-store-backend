export type Role = "customer" | "admin";

export type ReqUser = {
  id: string;
  role: Role;
};