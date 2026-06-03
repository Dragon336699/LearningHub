import { Certificate } from "./certificate";
import { Experience } from "./experience";
import { Expertise } from "./expertise";

export interface User {
  id: string;

  firstName: string;
  lastName?: string;

  coachCost: number;
  status: string;

  avatarUrl?: string;
  roleName: string;
  bio?: string;
  skills?: string;

  experiences: Experience[];
  certificates: Certificate[];

  expertises: Expertise[];
}