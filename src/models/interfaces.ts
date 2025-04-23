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
  walletAddress?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface IListing {
  id: string;
  title: string;
  description: string;
  price?: number;
  priceRange?: IPriceRange;
  images: string[];
  curatorId: string;
  categoryId: string;
  subcategoryId?: string;
  locationId: string;
  isActive: boolean;
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
  listingId?: string;
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
  listingId?: string;
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
}
