import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <section class="page py-10">
      <div class="mx-auto max-w-lg rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
        <h1 class="text-xl font-extrabold text-ink-900">Create your account</h1>
        <p class="mt-1 text-sm text-ink-500">It takes less than a minute.</p>

        <form class="mt-6 grid gap-4 sm:grid-cols-2" (submit)="submit($event)">
          <div>
            <label class="label" for="firstName">First name</label>
            <input id="firstName" name="firstName" class="input" [(ngModel)]="firstName" required />
          </div>
          <div>
            <label class="label" for="lastName">Last name</label>
            <input id="lastName" name="lastName" class="input" [(ngModel)]="lastName" />
          </div>
          <div class="sm:col-span-2">
            <label class="label" for="email">Email</label>
            <input id="email" name="email" type="email" class="input" placeholder="you@example.com" [(ngModel)]="email" required />
          </div>
          <div class="sm:col-span-2">
            <label class="label" for="password">Password</label>
            <input id="password" name="password" type="password" class="input" placeholder="At least 6 characters" [(ngModel)]="password" required />
          </div>

          @if (error()) {
            <p class="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 sm:col-span-2">{{ error() }}</p>
          }

          <button type="submit" class="btn-primary w-full py-3 sm:col-span-2" [disabled]="loading()">
            {{ loading() ? 'Creating account…' : 'Create account' }}
          </button>
        </form>

        <p class="mt-4 text-center text-sm text-ink-500">
          Already have an account?
          <a routerLink="/login" class="font-semibold text-brand-600">Sign in</a>
        </p>
      </div>
    </section>
  `
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  readonly loading = signal(false);
  readonly error = signal('');

  submit(event: Event) {
    event.preventDefault();
    if (!this.firstName || !this.email || this.password.length < 6) {
      this.error.set('Fill in your name, email and a password of at least 6 characters.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth
      .register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.toast.success('Account created. Welcome to Skinet!');
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Could not create the account. Try a different email.');
        }
      });
  }
}
