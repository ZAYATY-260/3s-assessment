import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../api/employee.service';
import { ToastService } from '../components/Toast/toast.service';
import { DepartmentsDto } from '../dto/employee/departments.dto';
import { EmployeeDto } from '../dto/employee/employee.dto';

@Component({
  selector: 'app-employees',
  standalone: true,
  templateUrl: './employees.html',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class EmployeesComponent implements OnInit {
  employees: EmployeeDto[] = [];
  Departments: DepartmentsDto[] = [];
  search = '';
  page = 1;
  pageSize = 5;
  statusFilter = '';
  totalPages = 1;
  totalItems = 0;
  pageNumbers: number[] = [];
  sortBy = '';
  isAscending = true;
  Math = Math;
  showAddModal = false;
  showDeleteConfirm = false;
  deleteId: number | null = null;
  newEmployee = {
    fullName: '',
    email: '',
    phone: '',
    department: '',
    salary: 0,
    hireDate: '',
    isActive: true
  };

  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('EmployeesComponent constructor');
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.getdepartments();
  }

  loadEmployees() {
    console.log('Loading employees...', { page: this.page, pageSize: this.pageSize, search: this.search, sortBy: this.sortBy, isAscending: this.isAscending });
    this.employeeService.getEmployees(this.page, this.pageSize, this.search, this.sortBy, this.isAscending)
      .subscribe({
        next: (res) => {
          this.employees = [...res.data];
          this.totalPages = res.totalPages;
          this.totalItems = res.totalCount;
          this.updatePageNumbers();

          console.log('UI Data updated:', this.employees.length);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('API Error:', err);
        }
      });
  }

  onSort(field: string) {
    if (this.sortBy === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortBy = field;
      this.isAscending = true;
    }
    this.page = 1;
    this.loadEmployees();
  }

  onFilterChange() {
    this.page = 1;
    this.loadEmployees();
  }

  updatePageNumbers() {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    this.pageNumbers = pages;
  }

  trackByPage(index: number, page: number): number {
    return page;
  }

  private searchTimer: any;

  onSearchChange() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.page = 1;
      this.loadEmployees();
    }, 300);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadEmployees();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadEmployees();
    }
  }

  goToPage(pageNum: number) {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.page = pageNum;
      this.loadEmployees();
    }
  }

  toggleStatus(id: number) {
    console.log('toggleStatus triggered for ID:', id);
    const employee = this.employees.find(e => e.id === id);

    if (!employee) {
      console.error('Employee not found in list:', id);
      return;
    }

    const oldStatus = !!employee.isActive;
    const newStatus = !oldStatus;

    employee.isActive = newStatus;
    this.cdr.detectChanges();

    this.employeeService.updateEmployeeStatus(id, newStatus)
      .subscribe({
        next: () => {
          console.log(`Successfully updated status for employee ${id} to ${newStatus}`);
          this.toastService.success(`Employee status updated to ${newStatus ? 'Active' : 'Inactive'}`);
        },
        error: (err) => {
          console.error('API Error updating status:', err);
          employee.isActive = oldStatus;
          this.cdr.detectChanges();
          this.toastService.error('Failed to update status. Check if the server is running.');
        }
      });
  }

  getdepartments() {
    this.employeeService.getdepartments().subscribe({
      next: (res) => {
        this.Departments = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching departments', err);
      }
    })
  }


  deleteEmployee(id: number) {
    this.deleteId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.deleteId === null) return;

    this.employeeService.deleteEmployee(this.deleteId).subscribe({
      next: () => {
        this.loadEmployees();
        this.toastService.success('Employee deleted successfully');
        this.showDeleteConfirm = false;
        this.deleteId = null;
      },
      error: () => {
        this.toastService.error('Failed to delete employee');
        this.showDeleteConfirm = false;
        this.deleteId = null;
      }
    });
  }

  resetForm() {
    this.newEmployee = {
      fullName: '',
      email: '',
      phone: '',
      department: '',
      salary: 0,
      hireDate: '',
      isActive: true
    };
  }

  submitAdd() {
    this.employeeService.createEmployee(this.newEmployee)
      .subscribe({
        next: () => {
          this.showAddModal = false;
          this.resetForm();
          this.loadEmployees();
          this.toastService.success('Employee added successfully!');
        },
        error: (err) => {
          console.error('Error adding employee', err);
          this.toastService.error('Failed to add employee. Please try again.');
        }
      });
  }
}
