export interface DashboardSummary {
  id: number;
  totalUser: number;
  totalSession: number;
  totalResource: number;
  createdAt: string;
}

export interface DashboardFilterParams {
  FromDate: string;
  ToDate: string;
}

export interface ZenQuote {
  q: string;
  a: string;
}