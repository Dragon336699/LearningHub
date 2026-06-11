import { Course } from "../../courses/types/Course.types";

export interface Resource {
    id: string;
    title: string;
    description: string;
    url: string;
    course: Course
}