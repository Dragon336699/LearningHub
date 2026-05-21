export interface Certificate {
  id: string;
  certificateName: string;
  organization: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
}