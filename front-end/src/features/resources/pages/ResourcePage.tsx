import { useEffect, useState } from "react"
import { useCreateResource, useDeleteResource, useResource, useUpdateResource } from "../hooks/Resource.hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faDownload, faEdit, faFileLines, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ConfirmModal } from "../../../shared/ui/components/ConfirmModal";
import { CreateResourceModal } from "../modals/CreateResourceModal";
import { CreateResourceForm } from "../schemas/CreateResourceSchema";
import { Result } from "../../../types/result";
import { Resource } from "../types/Resource.type";
import { toast } from "sonner";
import { Pagination } from "../../../shared/ui/components/Pagination";
import { UpdateResourceModal } from "../modals/UpdateResourceModal";
import { UpdateResourceForm } from "../schemas/UpdateResourceSchema";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { UserRole } from "../../auth/types/auth.types";
import { ThreeColumnsPageSizeOptions } from "../../../shared/types/pageSizeOptions";

export const ResourcePage = () => {
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const createResourceMutation = useCreateResource();
    const deleteResourceMutation = useDeleteResource();
    const updateResourceMutation = useUpdateResource();
    const role = currentUser?.roleName;
    const [isMentor, setIsMentor] = useState(false);
    const { data: resources, isLoading } = useResource(role as UserRole, page, pageSize);

    const totalPages = Math.ceil(
        (resources?.totalCount ?? 0) / pageSize
    );

    const handleCreateResource = async (data: CreateResourceForm) => {
        try {
            const response = await createResourceMutation.mutateAsync(data);
            toast.success(`Create resource ${response.title} successfully`)
            setIsCreateModalOpen(false);
        } catch (errors: Result<any> | any) {
            if (errors) {
                errors.forEach((err: string) => {
                    toast.error(err);
                })
            } else {
                toast.error("Failed to create new resource");
            }
        }
    }

    const handleUpdateResource = async (data: UpdateResourceForm) => {
        try {
            const response = await updateResourceMutation.mutateAsync(data);
            toast.success(`Update resource ${response.title} successfully`);
            setIsUpdateModalOpen(false);
        } catch (errors: Result<any> | any) {
            if (errors) {
                errors.forEach((err: string) => {
                    toast.error(err);
                })
            } else {
                toast.error("Failed to update resource");
            }
        }
    }

    const handleDeleteResource = async () => {
        try {
            await deleteResourceMutation.mutateAsync(selectedResource?.id ?? '');
            toast.success(`Delete resource ${selectedResource?.title ?? ''} successfully`);
            setIsDeleteModalOpen(false);
        } catch (errors: Result<any> | any) {
            if (errors) {
                errors.forEach((err: string) => toast.error(err))
            } else {
                toast.error("Failed to delete resource");
            }
        }
    }

    const handleDownload = async (url: string, title: string) => {
        const res = await fetch(url);

        const blob = await res.blob();

        const tempUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = tempUrl;
        a.download = title || "file";
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(tempUrl);
    }

    const handleChangePageSize = (newPageSize: number) => {
        const firstItemIndex = (page - 1) * pageSize + 1;
        const newPage = Math.ceil(firstItemIndex / newPageSize);
        setPage(newPage);
        setPageSize(newPageSize);
    }

    useEffect(() => {
        setIsMentor(role === 'Mentor');
    }, [currentUser])

    return (
        <div className="p-12 rounded-lg bg-card text-white h-fit">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Resources</h1>
                <button hidden={!isMentor} className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover active:scale-95" onClick={() => setIsCreateModalOpen(true)}>
                    Create New Resource
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources?.items.map((resource) => (
                    <div
                        key={resource.id}
                        className="bg-white dark:bg-muted p-5 rounded-xl border hover:shadow-md transition flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-start justify-between w-full">
                                <div className="flex gap-2 flex-1 min-w-0">
                                    <h2 className="text-lg font-semibold break-words w-full">
                                        {resource.title}
                                    </h2>
                                </div>
                                <div hidden={!isMentor} className="flex gap-2">
                                    <button
                                        className="text-white hover:text-muted-foreground transition cursor-pointer"
                                        onClick={() => {
                                            setSelectedResource(resource);
                                            setIsUpdateModalOpen(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button
                                        className="text-danger hover:text-danger-hover transition cursor-pointer"
                                        onClick={() => {
                                            setSelectedResource(resource);
                                            setIsDeleteModalOpen(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>

                            </div>

                            {/* Description */}
                            <p className="mt-2 text-sm text-title-information break-words whitespace-pre-wrap">
                                {resource.description}
                            </p>

                            {/* Course */}
                            <p className="mt-2 text-sm text-primary break-words">
                                <span>Course: </span>{resource.course.title}
                            </p>
                        </div>

                        <div className="flex justify-between mt-2">
                            <button onClick={() => handleDownload(resource.url, resource.title)} className=" cursor-pointer mr-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover active:scale-95"><FontAwesomeIcon className="mr-1" icon={faDownload} />Download</button>
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-info hover:text-info-hover font-medium hover:underline"
                            >
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="mb-0.5 -mr-1" />
                                View Document
                            </a>
                        </div>
                    </div>
                ))}

            </div>
            <div>
                {isLoading && (
                    <div className="flex flex-col justify-center items-center gap-1">
                        <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            className="text-xl"
                        />
                        <p className="text-center text-gray-500">Loading...</p>
                    </div>
                )}

                {!isLoading && (resources?.totalCount ?? 0) === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <FontAwesomeIcon icon={faFileLines} className="text-4xl mb-3 text-gray-400" />

                        <p className="text-lg font-medium">
                            No resources found
                        </p>
                    </div>
                )}

                {!isLoading && (resources?.totalCount ?? 0) > 0 && (
                    <Pagination
                        pageSizeOptions={ThreeColumnsPageSizeOptions.map(size => ({ label: size, value: size }))}
                        onPageSizeChange={handleChangePageSize}
                        currentPageSize={pageSize}
                        totalPages={totalPages}
                        currentPage={page}
                        onPageChange={setPage}
                    />
                )}
            </div>
            {isCreateModalOpen &&
                <CreateResourceModal
                    isLoading={createResourceMutation.isPending}
                    onSubmit={handleCreateResource}
                    onClose={() => setIsCreateModalOpen(false)} />}

            {isDeleteModalOpen &&
                <ConfirmModal
                    isLoading={deleteResourceMutation.isPending}
                    onConfirm={handleDeleteResource}
                    onCancel={() => setIsDeleteModalOpen(false)} />}

            {isUpdateModalOpen &&
                <UpdateResourceModal
                    data={selectedResource!}
                    isLoading={updateResourceMutation.isPending}
                    onSubmit={handleUpdateResource}
                    onClose={() => setIsUpdateModalOpen(false)} />}
        </div>
    )
}