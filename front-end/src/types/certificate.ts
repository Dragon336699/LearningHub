export interface Certificate {
  id: string;
  certificateName: string;
  organization: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
  file?: File; // For new uploads, not sent from backend
}