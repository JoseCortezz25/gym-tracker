/**
 * Types for marketing domain
 */

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Benefit {
  title: string;
  description: string;
  solution: string;
}

export interface Testimonial {
  quote: string;
  content: string;
  author: string;
  role: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  items: FooterLink[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FeatureDetail {
  title: string;
  description: string;
}
