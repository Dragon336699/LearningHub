import { API_ROUTES } from "../../../configs/api_routes"
import { HttpClient } from "../../../lib/client"
import { PagedResult } from "../../../shared/types/pagedResult"
import { Result } from "../../../types/result"
import { UserRole } from "../../auth/types/auth.types"
import { CreateResourceForm } from "../schemas/CreateResourceSchema"
import { UpdateResourceForm } from "../schemas/UpdateResourceSchema"
import { Resource } from "../types/Resource.type"

export const resourceService = {
    async getResource(role: UserRole, page: number, pageSize: number, keyword?: string) {
        let response;
        if (role === "Trainee") {
            response = await HttpClient.get<Result<PagedResult<Resource>>>(`${API_ROUTES.RESOURCE.COMMON}?page=${page}&pageSize=${pageSize}${keyword ? `&keyword=${keyword}` : ''}`);
        } else {
            response = await HttpClient.get<Result<PagedResult<Resource>>>(`${API_ROUTES.RESOURCE.MENTOR}?page=${page}&pageSize=${pageSize}${keyword ? `&keyword=${keyword}` : ''}`);
        }
        return response.data;
    },

    async createResourceAsync(request: CreateResourceForm) {
        const formData = new FormData();

        Object.entries(request).forEach(([key, value]) => {
            formData.append(key, value as string | Blob);
        })

        const response = await HttpClient.post<Result<Resource>>(`${API_ROUTES.RESOURCE.COMMON}`, formData);
        return response.data;
    },

    async updateResourceAsync(request: UpdateResourceForm) {
        const formData = new FormData();

        Object.entries(request).forEach(([key, value]) => {
            formData.append(key, value as string | Blob);
        })

        const response = await HttpClient.put<Result<Resource>>(`${API_ROUTES.RESOURCE.COMMON}`, formData);
        return response.data;
    },

    async deleteResource(id: string) {
        const response = await HttpClient.delete<Result<Resource>>(`${API_ROUTES.RESOURCE.COMMON}/${id}`);
        return response.data;
    }
}