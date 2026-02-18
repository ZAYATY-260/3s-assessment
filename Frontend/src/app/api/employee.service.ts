import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class EmployeeService {

    private apiUrl = 'http://localhost:5187/api';

    constructor(private http: HttpClient) { }

    getEmployees(page: number, pageSize: number, search: string, sortBy: string = '', isAscending: boolean = true, status: string = '') {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (search && search.trim() !== '') {
            params = params.set('search', search.trim());
        }

        if (sortBy) {
            params = params.set('sortBy', sortBy);
            params = params.set('isAscending', isAscending.toString());
        }

        console.log('API Request params:', params.toString());
        return this.http.get<any>(this.apiUrl + '/employees', { params });
    }

    updateEmployeeStatus(id: number, isActive: boolean) {
        return this.http.put(`${this.apiUrl}/employees/${id}/status`, { isActive });
    }

    getdepartments() {
        return this.http.get<any>(`${this.apiUrl}/departments`);
    }

    getHistory() {
        return this.http.get<any>(`${this.apiUrl}/employees/history`);
    }

    createEmployee(employee: any) {
        return this.http.post(`${this.apiUrl}/employees`, employee);
    }

    deleteEmployee(id: number) {
        return this.http.delete(`${this.apiUrl}/employees/${id}`);
    }
}
