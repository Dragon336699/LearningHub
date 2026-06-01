import { DialogShell } from "../../../shared/ui/components/DialogShell"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCourseForm } from "../schemas/UpdateCourseSchema";
import { Course } from "../types/Course.types";

type UpdateCourseModalProps = {
    data: Course,
    isLoading: boolean;
    onClose: () => void;
    onUpdate: (data: UpdateCourseForm) => void;
}

export const UpdateCourseModal = ({ data, isLoading, onClose, onUpdate }: UpdateCourseModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UpdateCourseForm>({
        resolver: zodResolver(UpdateCourseForm),
        defaultValues: {
            id: data.id,
            title: data.title,
            description: data.description,
            learningObjectives: data.learningObjectives
        }
    });

    return (
        <DialogShell
            isLoading={isLoading}
            open={true}
            title="Update Course"
            onClose={onClose}
        >
            <form onSubmit={handleSubmit(onUpdate)}>
                <div className="flex flex-col space-y-4">
                    <input type="hidden" {...register("id")} />
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="title" className="text-white w-fit">
                            Title
                            <span className="text-danger ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="input"
                            placeholder="Enter course title"
                            maxLength={100}
                            {...register("title")}
                        />
                        {errors.title && (
                            <span className="text-sm text-danger">{errors.title.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="description" className="text-white w-fit">
                            Description
                            <span className="text-danger ml-1">*</span>
                        </label>
                        <textarea
                            id="description"
                            className="textarea"
                            placeholder="Enter course description"
                            maxLength={500}
                            {...register("description")}
                        />
                        {errors.description && (
                            <span className="text-sm text-danger">{errors.description.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="learningObjectives" className="text-white w-fit">
                            Learning Objectives
                        </label>
                        <textarea
                            id="learningObjectives"
                            className="textarea"
                            placeholder="Enter learning objectives"
                            maxLength={200}
                            {...register("learningObjectives")}
                        />
                        {errors.learningObjectives && (
                            <span className="text-sm text-danger">{errors.learningObjectives.message}</span>
                        )}
                    </div>
                </div>
                <div className="flex gap-4 justify-end mt-6">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save</button>
                </div>
            </form>
        </DialogShell>
    )
}