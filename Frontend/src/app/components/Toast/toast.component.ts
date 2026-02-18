import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../Toast/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2">
      <div
        *ngFor="let toast of toastService.toasts()"
        [ngClass]="{
          'bg-emerald-600 shadow-emerald-200': toast.type === 'success',
          'bg-rose-600 shadow-rose-200': toast.type === 'error',
          'bg-blue-600 shadow-blue-200': toast.type === 'info'
        }"
        class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-white/20 text-white min-w-[320px] backdrop-blur-md animate-in slide-in-from-top-4 duration-300"
      >
        <div class="flex-shrink-0">
          <svg *ngIf="toast.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span class="flex-1 font-semibold text-sm">{{ toast.message }}</span>
        <button (click)="toastService.remove(toast.id)" class="hover:bg-white/20 p-1 rounded-lg transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
    toastService = inject(ToastService);
}
