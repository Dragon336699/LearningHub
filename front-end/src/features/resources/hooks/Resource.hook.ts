import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resourceService } from "../services/Resource.service";
import { CreateResourceForm } from "../schemas/CreateResourceSchema";
import { UpdateResourceForm } from "../schemas/UpdateResourceSchema";
import { UserRole } from "../../auth/types/auth.types";

export const useResource = (
  role: UserRole,
  page: number,
  pageSize = 10,
  keyword?: string,
) => {
  return useQuery({
    queryKey: ["resources", role, page, pageSize, keyword],
    queryFn: async () =>
      await resourceService.getResource(role, page, pageSize, keyword),
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateResourceForm) =>
      await resourceService.createResourceAsync(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resources"] }),
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateResourceForm) =>
      await resourceService.updateResourceAsync(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resources"] }),
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => resourceService.deleteResource(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resources"] }),
  });
};
