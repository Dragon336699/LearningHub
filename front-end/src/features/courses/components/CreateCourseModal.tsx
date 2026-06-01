import { DialogShell } from "../../../shared/ui/components/DialogShell"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCourseForm, CreateCourseSchema } from "../schemas/CreateCourseSchema";

type CreateCourseModalProps = {
    onClose: () => void;
    onCreate: (data: CreateCourseForm) => void;
}

export const CreateCourseModal = ({ onClose, onCreate }: CreateCourseModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateCourseForm>({
        resolver: zodResolver(CreateCourseSchema)
    });

    return (
        <DialogShell
            open={true}
            title="Create New Course"
            onClose={onClose}
        >
            <form onSubmit={handleSubmit(onCreate)}>
                <div className="flex flex-col space-y-4">
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
                    <button type="submit" className="btn btn-primary">Create Course</button>
                </div>
            </form>
        </DialogShell>
    )
}