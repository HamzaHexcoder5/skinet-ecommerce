import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from '../../core/toast.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="flex min-h-screen flex-col">
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>

    <div class="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      @for (item of toasts.toasts(); track item.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lift"
          [class]="item.type === 'error' ? 'bg-red-600' : item.type === 'success' ? 'bg-emerald-600' : 'bg-ink-900'"
        >
          <span class="material-icons text-[18px]">
            {{ item.type === 'error' ? 'error_outline' : item.type === 'success' ? 'check_circle_outline' : 'info' }}
          </span>
          <p class="flex-1">{{ item.message }}</p>
          <button type="button" class="opacity-70 transition hover:opacity-100" (click)="toasts.dismiss(item.id)" aria-label="Dismiss">
            <span class="material-icons text-[18px]">close</span>
          </button>
        </div>
      }
    </div>
  `
})
export class ShellComponent {
  readonly toasts = inject(ToastService);
}
