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
  _id?: string;
};

export type PotType = {
  name: string;
  target: number;
  total: number;
  theme: string;
  _id?: string;
};

export type RoleType = "admin" | "user";

export type UserType = {
  email: string;
  password: string;
  name: string;
  role: RoleType;
  avatar: string;
  _id?: string;
};

export type LoginOutput = {
  accessToken: string;
  user: Omit<UserType, "password">;
};
