export type Role = "customer" | "admin";

export type ReqUser = {
  userId: string;
  role: Role;
};