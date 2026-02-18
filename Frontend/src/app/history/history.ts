import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../api/employee.service';
import { EmployeeDto } from '../dto/employee/employee.dto';

@Component({
    selector: 'app-history',
    standalone: true,
    templateUrl: './history.html',
    imports: [CommonModule, RouterModule]
})
export class HistoryComponent implements OnInit {
    deletedEmployees: EmployeeDto[] = [];
    loading = false;

    constructor(
        private employeeService: EmployeeService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadHistory();
    }

    loadHistory() {
        this.loading = true;
        this.employeeService.getHistory().subscribe({
            next: (res) => {
                this.deletedEmployees = Array.isArray(res) ? res : (res.data || []);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading history', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }
}
