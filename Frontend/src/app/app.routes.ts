import { Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees';
import { HistoryComponent } from './history/history';

export const routes: Routes = [
    { path: '', component: EmployeesComponent },
    { path: 'history', component: HistoryComponent },
    { path: '**', redirectTo: '' }
];
