import { Controller, useForm } from "react-hook-form";
import { CreateResourceForm, CreateResourceSchema } from "../schemas/CreateResourceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogShell } from "../../../shared/ui/components/DialogShell";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GroupBase } from "react-select";
import { useLoadCourseOptions } from "../../courses/hooks/Course.hook";
import type { ControlProps, OptionProps } from "react-select";

export interface CourseOption {
    label: string;
    value: string;
}

type CreateResourceModalProps = {
    isLoading: boolean;
    onSubmit: (data: CreateResourceForm) => void;
    onClose: () => void;
};

export const CreateResourceModal = ({ isLoading, onSubmit, onClose }: CreateResourceModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { loadCourseOptions } = useLoadCourseOptions();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<CourseOption | null>(null);
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isValid },
    } = useForm<CreateResourceForm>({
        resolver: zodResolver(CreateResourceSchema),
        mode: "onChange",
    });

    const file = watch("file");

    return (
        <DialogShell isLoading={isLoading} open={true} title="Create New Resource" onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-4">

                    {/* Title */}
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="title" className="text-white w-fit">
                            Title <span className="text-danger ml-1">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="input"
                            placeholder="Enter resource title"
                            maxLength={100}
                            {...register("title")}
                        />
                        {errors.title && (
                            <span className="text-sm text-danger">{errors.title.message}</span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="description" className="text-white w-fit">
                            Description <span className="text-danger ml-1">*</span>
                        </label>
                        <textarea
                            id="description"
                            className="textarea"
                            placeholder="Enter resource description"
                            maxLength={500}
                            {...register("description")}
                        />
                        {errors.description && (
                            <span className="text-sm text-danger">{errors.description.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="course" className="text-white w-fit">
                            Course <span className="text-danger ml-1">*</span>
                        </label>
                        <Controller
                            name="courseId"
                            control={control}
                            render={({ field }) => (
                                <AsyncPaginate<CourseOption, GroupBase<CourseOption>, { page: number }>
                                    classNamePrefix="course-select"
                                    inputId="course"
                                    value={selectedCourse}
                                    inputValue={searchKeyword}
                                    onInputChange={(value) => setSearchKeyword(value)}
                                    loadOptions={loadCourseOptions}
                                    debounceTimeout={500}
                                    additional={{ page: 1 }}
                                    onChange={(option) => {
                                        setSelectedCourse(option);
                                        field.onChange(option?.value ?? "");
                                    }}
                                    defaultOptions
                                    styles={{
                                        control: (base, state: ControlProps<CourseOption>) => ({
                                            ...base,
                                            backgroundColor: "#0f172a",
                                            borderColor: state.isFocused ? "#3b82f6" : "#1e293b",
                                            boxShadow: "none",
                                            minHeight: "44px",
                                            borderRadius: "12px",
                                            "&:hover": {
                                                borderColor: "#3b82f6"
                                            }
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: "#0f172a",
                                            border: "1px solid #1e293b",
                                            borderRadius: "12px",
                                            overflow: "hidden"
                                        }),
                                        option: (base, state: OptionProps<CourseOption>) => ({
                                            ...base,
                                            backgroundColor: state.isSelected
                                                ? "#f97316"
                                                : state.isFocused
                                                    ? "#1e293b"
                                                    : "#0f172a",
                                            color: state.isSelected ? "#ffffff" : "#e5e7eb",
                                            cursor: "pointer"
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: "#e5e7eb"
                                        }),
                                        input: (base) => ({
                                            ...base,
                                            color: "#e5e7eb"
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: "#9ca3af"
                                        }),
                                        menuList: (base) => ({
                                            ...base,
                                            maxHeight: 250
                                        })
                                    }}
                                    placeholder="Search course..."
                                />
                            )}
                        />
                        {errors.courseId && (
                            <span className="text-sm text-danger">{errors.courseId.message}</span>
                        )}
                    </div>
                    {/* File upload */}
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="resource-file" className="text-white w-fit">
                            Resource file <span className="text-danger ml-1">*</span>
                        </label>
                        <div className="flex gap-2 items-center">
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-gray-200 transition select-none"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FontAwesomeIcon icon={faUpload} className="h-4 w-4" />
                                Browse File
                                <Controller
                                    name="file"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            id="resource-file"
                                            ref={fileInputRef}
                                            type="file"
                                            hidden
                                            accept=".pdf,.doc,.docx,.txt,.mp4,.mov"
                                            onChange={(e) => {
                                                const selected = e.target.files?.[0];
                                                if (selected) field.onChange(selected);
                                                e.target.value = "";
                                            }}
                                        />
                                    )}
                                />
                            </button>
                            {file && !errors.file && (
                                <p className="text-sm text-gray-400">{file.name}</p>
                            )}
                        </div>
                        {errors.file && (
                            <span className="text-sm text-danger">{errors.file.message}</span>
                        )}
                    </div>

                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-end mt-6">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" disabled={!isValid || isLoading} className="btn btn-primary">
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </DialogShell>
    );
};