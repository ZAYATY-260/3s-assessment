import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts = signal<Toast[]>([]);
    private nextId = 0;

    show(message: string, type: ToastType = 'info') {
        const id = this.nextId++;
        this.toasts.update((current) => [...current, { id, message, type }]);

        setTimeout(() => {
            this.remove(id);
        }, 4000);
    }

    success(message: string) {
        this.show(message, 'success');
    }

    error(message: string) {
        this.show(message, 'error');
    }

    remove(id: number) {
        this.toasts.update((current) => current.filter((t) => t.id !== id));
    }
}
