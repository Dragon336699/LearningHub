import { HttpClient } from "../lib/client";
import { Certificate } from "../types/certificate";

interface ApiResult<T> {
  isSuccess: boolean;
  data: T;
  errors: string[] | null;
}

export const certificateService = {
  // POST /certificate?testUserId={id} in FromForm
  create: async (userId: string, name: string, org: string, issueDate: string, expDate: string | null, file: File | null) => {
    const formData = new FormData();
    formData.append("CertificateName", name);
    formData.append("Organization", org);
    formData.append("IssueDate", issueDate);
    if (expDate) formData.append("ExpirationDate", expDate);
    if (file) formData.append("CredentialFile", file); // Match with UpdateCertificateCommand

    return HttpClient.post<ApiResult<Certificate>>(`/certificate?testUserId=${userId}`, formData);
  },

  // PUT /certificate?testUserId={id} in FromForm
  update: async (userId: string, certId: string, name: string, org: string, issueDate: string, expDate: string | null, file: File | null) => {
    const formData = new FormData();
    formData.append("Id", certId);
    formData.append("CertificateName", name);
    formData.append("Organization", org);
    formData.append("IssueDate", issueDate);
    if (expDate) formData.append("ExpirationDate", expDate);
    if (file) formData.append("CredentialFile", file);

    return HttpClient.put<ApiResult<Certificate>>(`/certificate?testUserId=${userId}`, formData);
  },

  // DELETE /certificate/{certificateId}
  delete: async (certId: string) => {
    return HttpClient.delete<void>(`/certificate/${certId}`);
  }
};