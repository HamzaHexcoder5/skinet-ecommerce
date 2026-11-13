import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <section class="page py-10">
      <div class="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-ink-100 bg-white md:grid-cols-2">
        <div class="relative hidden bg-ink-900 p-8 text-white md:block">
          <img src="/images/hero1.jpg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div class="relative flex h-full flex-col justify-between">
            <img src="/images/logo.png" alt="Skinet" class="h-9 w-auto brightness-0 invert" />
            <div>
              <h2 class="text-2xl font-extrabold leading-snug">Welcome back to the mountain</h2>
              <p class="mt-2 text-sm text-white/70">Track orders, save favourites and check out faster.</p>
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <h1 class="text-xl font-extrabold text-ink-900">Sign in</h1>
          <p class="mt-1 text-sm text-ink-500">Use any email and a password of 6+ characters.</p>

          <form class="mt-6 space-y-4" (submit)="submit($event)">
            <div>
              <label class="label" for="email">Email</label>
              <input id="email" name="email" type="email" class="input" placeholder="you@example.com" [(ngModel)]="email" required />
            </div>
            <div>
              <label class="label" for="password">Password</label>
              <input id="password" name="password" type="password" class="input" placeholder="••••••••" [(ngModel)]="password" required />
            </div>

            @if (error()) {
              <p class="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{{ error() }}</p>
            }

            <button type="submit" class="btn-primary w-full py-3" [disabled]="loading()">
              {{ loading() ? 'Signing in…' : 'Sign in' }}
            </button>
          </form>

          <p class="mt-4 text-center text-sm text-ink-500">
            New to Skinet?
            <a routerLink="/register" class="font-semibold text-brand-600">Create an account</a>
          </p>
          <p class="mt-2 text-center text-xs text-ink-400">
            Selling instead?
            <a routerLink="/seller/register" class="font-semibold text-ink-600">Open a store</a>
          </p>
        </div>
      </div>
    </section>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  email = '';
  password = '';
  readonly loading = signal(false);
  readonly error = signal('');

  submit(event: Event) {
    event.preventDefault();
    if (!this.email || this.password.length < 6) {
      this.error.set('Enter your email and a password of at least 6 characters.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.email, this.password).subscribe({
      next: (session) => {
        this.loading.set(false);
        this.toast.success(`Welcome back, ${session.user.firstName}`);
        this.router.navigateByUrl(session.user.role === 'seller' ? '/seller' : '/');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not sign in. Check your details and try again.');
      }
    });
  }
}
