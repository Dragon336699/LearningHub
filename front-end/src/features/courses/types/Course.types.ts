export interface Course {
    id: string;
    courseCode: string;
    title: string;
    description: string;
    learningObjectives?: string;
    createdAt: Date;
    updatedAt: Date;
    status: CourseStatus;
}

export enum CourseStatus {
    Published = "Published",
    Draft = "Draft",
    Archived = "Archived"
}

export interface ChangeCourseStatusRequest {
    id: string;
    status: CourseStatus;
}

export interface AssignTraineesPayload {
  courseId: string;
  traineeIds: string[];
}