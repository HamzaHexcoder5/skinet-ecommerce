import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 1;

  success(message: string) {
    this.push(message, 'success');
  }

  error(message: string) {
    this.push(message, 'error');
  }

  info(message: string) {
    this.push(message, 'info');
  }

  dismiss(id: number) {
    this.toasts.set(this.toasts().filter((toast) => toast.id !== id));
  }

  private push(message: string, type: Toast['type']) {
    const toast: Toast = { id: this.nextId++, message, type };
    this.toasts.set([...this.toasts(), toast]);
    setTimeout(() => this.dismiss(toast.id), 3200);
  }
}
