import type { Role, UserStatus } from "./enums";

export interface IAppUser {
  id: string;
  authUserId: string;
  profilePhoto: string | null;
  contactNumber: string | null;
  address: string | null;
  country: string | null;
  canEarn: boolean;
  balance: number;
  totalEarned: number;
  referralIncomeEligible: boolean;
  referredBy: string | null;
  lastLogin: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string | null;
  phoneVerified: boolean;
  role: Role;
  status: UserStatus;
  needPasswordChange: boolean;
  image: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  appUser?: IAppUser | null;
}

export interface IUserDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: Role;
  status: UserStatus;
  needPasswordChange: boolean;
  image: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  appUser: Pick<
    IAppUser,
    | "id"
    | "profilePhoto"
    | "contactNumber"
    | "address"
    | "country"
    | "canEarn"
    | "balance"
    | "totalEarned"
    | "referredBy"
    | "isDeleted"
    | "deletedAt"
    | "createdAt"
    | "updatedAt"
  >;
}

export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  profilePhoto?: string;
  contactNumber?: string;
}

export interface IUpdateUserProfilePayload {
  name?: string;
  phone?: string;
  image?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  country?: string;
}

export interface IUpdateUserStatusPayload {
  status: Exclude<UserStatus, "DELETED">;
}

export interface IUpdateUserRolePayload {
  role: Role;
}

export interface IDeleteUserResult {
  id: string;
  deletedAt: string;
}