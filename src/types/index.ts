import { ColorValue } from "mui-color";

export type Status = "pending" | "approved" | "declined";

export type LoginCreds = {
  email: string;
  password: string;
};

export type RegistrationDetails = {
  avatar: File | null | string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  status?: Status;
};

export type UserInformation = Omit<RegistrationDetails, "password">;

export type ProductInformation = {
  id?: string;
  sadFoodRating: number;
  happyFoodRating: number;
  surpriseFoodRating: number;
  angryFoodRating: number;
  image: File | null | string;
  name: string;
  price: number;
};

export type WebPageInformation = {
  id?: string;
  logo: File | null | string;
  themeColor: string;
  themeColorObj: ColorValue;
  storeName: string;
  slogan: string;
  landingImage: File | null | string;
  facebookPage: string;
  contactNumber: string;
};

export type WebPage = {
  id?: string;
  logo: File | null | string;
  themeColor: string;
  storeName: string;
  slogan: string;
  landingImage: File | null | string;
  facebookPage: string;
  contactNumber: string;
  ownerEmail?: string;
};

export type Product = {
  id?: string;
  sadFoodRating: number;
  happyFoodRating: number;
  surpriseFoodRating: number;
  angryFoodRating: number;
  imageUrl: string;
  name: string;
  ownerEmail: string;
  price: number;
  categories: string[];
};

export type CurrentUser = {
  id: string;
  address: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  preferences: string[];
};

export type Customer = {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  password: string;
};

export type CustomerInformation = Omit<Customer, "password">;

export type RestoOwner = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  address: string;
  status?: string;
};

export type LandingResto = {
  id: string;
  address: string;
  contact: string;
  description: string;
  featured: string;
  name: string;
  ownerEmail?: string;
};

export type Emotion = "sad" | "angry" | "surprised" | "happy";
