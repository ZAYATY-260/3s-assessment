export interface EmployeeDto {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  salary: number;
  hireDate: string;
  isActive: boolean;
  isDeleted: boolean;
}


export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
