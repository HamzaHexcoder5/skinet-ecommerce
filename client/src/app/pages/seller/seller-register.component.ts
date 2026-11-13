import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-seller-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <section class="page py-10">
      <div class="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-ink-100 bg-white lg:grid-cols-[1fr_420px]">
        <!-- Pitch -->
        <div class="relative hidden bg-ink-900 p-8 text-white lg:block">
          <img src="/images/hero2.jpg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div class="relative">
            <span class="chip bg-white/10 text-white/80">Sell on Skinet</span>
            <h1 class="mt-4 text-3xl font-extrabold leading-tight">Open your store in minutes</h1>
            <p class="mt-3 max-w-sm text-sm text-white/70">
              Join thousands of sellers reaching riders across the country. No setup fee, no listing fee for 30 days.
            </p>

            <ul class="mt-8 space-y-4 text-sm">
              @for (item of [
                { icon: 'storefront', title: 'Your own storefront', text: 'Custom name, products and ratings.' },
                { icon: 'insights', title: 'Seller dashboard', text: 'Track stock, orders and revenue in one place.' },
                { icon: 'payments', title: 'Fast payouts', text: 'Weekly settlements straight to your account.' }
              ]; track item.title) {
                <li class="flex gap-3">
                  <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10">
                    <span class="material-icons text-[18px]">{{ item.icon }}</span>
                  </span>
                  <span>
                    <span class="block font-semibold">{{ item.title }}</span>
                    <span class="block text-white/60">{{ item.text }}</span>
                  </span>
                </li>
              }
            </ul>
          </div>
        </div>

        <!-- Form -->
        <div class="p-6 sm:p-8">
          <h2 class="text-xl font-extrabold text-ink-900">Create your store</h2>
          <p class="mt-1 text-sm text-ink-500">Your store goes live as soon as you add a product.</p>

          <form class="mt-6 space-y-4" (submit)="submit($event)">
            <div>
              <label class="label" for="storeName">Store name</label>
              <input id="storeName" name="storeName" class="input" placeholder="e.g. Alpine Outfitters" [(ngModel)]="storeName" required />
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="label" for="firstName">First name</label>
                <input id="firstName" name="firstName" class="input" [(ngModel)]="firstName" required />
              </div>
              <div>
                <label class="label" for="lastName">Last name</label>
                <input id="lastName" name="lastName" class="input" [(ngModel)]="lastName" />
              </div>
            </div>
            <div>
              <label class="label" for="email">Business email</label>
              <input id="email" name="email" type="email" class="input" placeholder="store@example.com" [(ngModel)]="email" required />
            </div>
            <div>
              <label class="label" for="password">Password</label>
              <input id="password" name="password" type="password" class="input" placeholder="At least 6 characters" [(ngModel)]="password" required />
            </div>

            @if (error()) {
              <p class="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{{ error() }}</p>
            }

            <button type="submit" class="btn-primary w-full py-3" [disabled]="loading()">
              {{ loading() ? 'Creating store…' : 'Create store' }}
            </button>
            <p class="text-center text-[11px] text-ink-400">By continuing you agree to the Skinet seller policy.</p>
          </form>

          <p class="mt-4 text-center text-sm text-ink-500">
            Already a seller?
            <a routerLink="/login" class="font-semibold text-brand-600">Sign in</a>
          </p>
        </div>
      </div>
    </section>
  `
})
export class SellerRegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  storeName = '';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  readonly loading = signal(false);
  readonly error = signal('');

  submit(event: Event) {
    event.preventDefault();
    if (!this.storeName || !this.firstName || !this.email || this.password.length < 6) {
      this.error.set('Fill in the store name, your name, email and a password of at least 6 characters.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth
      .registerSeller({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        storeName: this.storeName
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.toast.success('Your store is ready');
          this.router.navigateByUrl('/seller');
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Could not create the store. Try a different email.');
        }
      });
  }
}
