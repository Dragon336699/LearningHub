import { Certificate } from "../../../types/certificate";
import { Experience } from "../../../types/experience";

export interface FormState {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  coachCost: number;
  roleName: string;
  bio: string;
  skills: string;
  selectedExpertiseIds: string[];
  experiences: Experience[];
  certificates: Certificate[];
}