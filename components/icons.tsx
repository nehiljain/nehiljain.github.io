import {
  Twitter,
  Github,
  Linkedin,
  Mail,
  User,
  Briefcase,
  Code,
  Home,
  Pen,
  type LucideIcon
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  logo: Home,
  twitter: Twitter,
  gitHub: Github,
  linkedIn: Linkedin,
  mail: Mail,
  user: User,
  briefcase: Briefcase,
  code: Code,
  pen: Pen
} as const;
