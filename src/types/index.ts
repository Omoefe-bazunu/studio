import type { LucideIcon } from "lucide-react";
import type { User } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";

export interface NavLink {
  href: string;
  label: string;
}

export interface Service {
  id: string;
  title: string;
  imageSrc: string;
  imageHint: string;
  features: string[];
  icon: LucideIcon;
}

export interface Testimonial {
  id: string;
  name: string;
  statement: string;
  rating: number;
  serviceCategory: string;
  userId?: string;
  userEmail?: string;
  createdAt?: string;
}

export interface TestimonialFormData {
  name: string;
  statement: string;
  rating: number;
  serviceCategory: string;
}

export type BlogCategoryType = "Tech" | "Business" | "Career";

export interface BlogCategory {
  id: BlogCategoryType;
  name: string;
  href: string;
  description?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorImageSrc?: string;
  userId?: string;
  date: string;
  text: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  category: BlogCategoryType;
  title: string;
  imageSrc: string;
  imageHint: string;
  imageCreditText?: string; // New field
  imageCreditLink?: string; // New field
  excerpt: string;
  content: string;
  authorName: string;
  authorImageSrc?: string;
  date: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPostFormValues {
  title: string;
  slug: string;
  category: BlogCategoryType;
  imageFile?: File | null;
  imageSrc?: string;
  imageHint: string;
  imageCreditText?: string; // New field
  imageCreditLink?: string; // New field
  excerpt: string;
  content: string;
  authorName: string;
  authorImageFile?: File | null;
  authorImageSrc?: string;
  date: Date;
}

export interface BlogPostStorageData
  extends Omit<BlogPostFormValues, "imageFile" | "authorImageFile" | "date"> {
  imageSrc: string;
  authorImageSrc: string;
  date: Date;
}

export interface WebProject {
  id: string;
  title: string;
  description: string;
  deliveryDate: string;
  liveUrl?: string;
  screenshots: string[];
  imageHints: string[];
  category: "Web Development";
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectScreenshotData {
  id?: string;
  url?: string;
  file?: File | null;
  hint: string;
  name?: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  deliveryDate: Date;
  liveUrl?: string;
  screenshots: ProjectScreenshotData[];
}

export interface Achievement {
  metric: string;
  value: string;
  unit: string;
  iconName?: string;
}

export interface MarketingCaseStudy {
  id: string;
  clientName: string;
  description: string;
  imageSrc: string;
  imageHint: string;
  achievements: Achievement[];
  category: "Digital Marketing";
  campaignDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarketingAdProject {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageHint?: string; // optional
  deliveryDate: Date; // Firestore timestamp → Date
  category: string; // allow flexibility
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CvSuccessStory {
  id: string;
  clientInfo: string;
  description: string;
  category: "CV/RESUME Writing";
  serviceDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceNavItem {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  serviceOfInterest?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface AffiliateResourceText {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AffiliateResourceImage {
  id: string;
  altText: string;
  imageUrl: string;
  imageHint: string;
  downloadName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirebaseUser extends User {}

export interface AdsBannerData {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdsBannerFormData {
  title: string;
  description: string;
  imageFile?: File | null;
  imageUrl?: string;
  imageHint: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

export interface TopHeaderBannerData {
  id?: string;
  text: string; // Simplified for a top banner
  ctaText: string;
  ctaLink: string;
  imageUrl?: string; // Optional small image/logo
  imageHint?: string;
  isActive: boolean;
  backgroundColor?: string; // Optional custom background
  textColor?: string; // Optional custom text color
  createdAt?: string;
  updatedAt?: string;
}

export interface TopHeaderBannerFormData {
  text: string;
  ctaText: string;
  ctaLink: string;
  imageFile?: File | null;
  imageUrl?: string;
  imageHint?: string;
  isActive: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export interface BlogPostFirestoreData {
  slug: string;
  category: BlogCategoryType;
  title: string;
  imageSrc: string;
  imageHint: string;
  imageCreditText?: string; // New field
  imageCreditLink?: string; // New field
  excerpt: string;
  content: string;
  authorName: string;
  authorImageSrc: string;
  date: Timestamp;
  likes: number;
  dislikes: number;
  commentsCount: number;
  comments: CommentFirestoreData[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CommentFirestoreData {
  authorName: string;
  userId?: string;
  date: Timestamp;
  text: string;
}

export interface TestimonialFirestoreData {
  name: string;
  statement: string;
  rating: number;
  serviceCategory: string;
  userId?: string;
  userEmail?: string;
  status?: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
