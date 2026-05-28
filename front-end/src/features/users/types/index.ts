import { Experience } from "../../../types/experience";

export interface FormState {
  firstName: string;
  lastName: string;
  bio: string;
  skills: string;
  selectedExpertiseIds: string[];
  experiences: Experience[];
}