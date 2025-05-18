import { $Enums } from "@prisma/client";

// Enums
export enum UserRole {
  USER = 'USER',
  CURATOR = 'CURATOR',
  ADMIN = 'ADMIN'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum ArtisanType {
  PERSON = 'PERSON',
  BUSINESS = 'BUSINESS'
}

export enum TipStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// Interfaces
export interface IUser {
  id: string;
  email: string;
  password: string;
  walletAddress: string | null;
  firstName: string;
  lastName: string;
  role: $Enums.UserRole;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  locationId: string | null;
  emailVerifiedAt: Date | string | null;
  emailVerificationCode: string | null;

  // Relations
  // curator: ICurator;
  // artisans: IArtisan[]
  // reviews: IReview[]
  // receivedReviews: IReview[]
  // sentTips: ITip[]
  // receivedTips: ITip[]
  // location: ILocation
  // personalAccessTokens: PersonalAccessToken[];
}

export interface ICurator {
  id: string;
  userId: string;
  verificationStatus: VerificationStatus;
  specialties: string[];
  experience: number;
  portfolio?: string;
  certificates: string[];
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubcategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPriceRange {
  min: number;
  max: number;
}

export interface IArtisan {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string | null;
  type: ArtisanType;
  description: string;
  price?: number;
  priceRange?: IPriceRange;
  images: string[];
  curatorId: string;
  categoryId: string;
  subcategoryId?: string;
  locationId: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILocation {
  id: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  id: string;
  rating: number;
  comment?: string;
  authorId: string;
  targetId: string;
  artisanId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITip {
  id: string;
  amount: number;
  currency: string;
  message?: string;
  status: TipStatus;
  senderId: string;
  receiverId: string;
  artisanId?: string;
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
}
