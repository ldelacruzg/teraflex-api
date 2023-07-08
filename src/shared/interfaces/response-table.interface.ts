export interface ResponseTableInterface {
  page: number;
  limit: number;
  status: boolean;
  data: any;
  total: number;
  totalPages: number;
  message?: string;
}
