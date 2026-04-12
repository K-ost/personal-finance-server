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
  userId: Types.ObjectId;
  _id?: Types.ObjectId;
};

export type PotType = {
  name: string;
  target: number;
  total: number;
  theme: string;
  userId: Types.ObjectId;
  _id?: Types.ObjectId;
};

export type SessionType = {
  token: string;
  userId: Types.ObjectId;
};

export type ServerResponse<T> = {
  data?: T;
  count?: number;
  page?: number;
  msg?: string;
};

export type RoleType = "admin" | "user";

export type UserType = {
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
};

export type UserServer = UserType & {
  _id: Types.ObjectId;
};
