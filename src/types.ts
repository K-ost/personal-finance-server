import { Types } from "mongoose";

export type BalanceType = {
  current: number;
  income: number;
  expenses: number;
};

export type TransactionType = {
  avatar: string;
  name: string;
  category: string;
  date: Date;
  amount: number;
  recurring: boolean;
  _id?: string;
};

export type BudgetType = {
  category: string;
  maximum: number;
  theme: string;
  isDefault?: boolean;
  _id?: string;
};

export type PotType = {
  name: string;
  target: number;
  total: number;
  theme: string;
  isDefault?: boolean;
  _id?: string;
};

export type RoleType = "admin" | "user";

export type ServerResponse<T> = {
  data?: T;
  count?: number;
  page?: number;
  msg?: string;
};

export type UserType = {
  email: string;
  password: string;
  name: string;
};

export type UserServer = UserType & {
  _id: Types.ObjectId;
};

export type UserDTO = { id: Types.ObjectId } & Pick<UserType, "email" | "name">;
