import { Certificate } from "./certificate";
import { Experience } from "./experience";
import { Expertise } from "./expertise";

export interface User {
  id: string;

  email: string;
  userName?: string;
  phoneNumber?: string;

  firstName: string;
  lastName?: string;

  coachCost: number;

  avatarUrl?: string;
  description?: string;
  skills?: string;

  experiences: Experience[];
  certificates: Certificate[];

  expertises: Expertise[];
}