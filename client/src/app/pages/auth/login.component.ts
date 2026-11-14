import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  email = '';
  password = '';
  readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  readonly loading = signal(false);
  readonly errors = signal<Record<string, string>>({});
  readonly formError = signal('');

  submit(event: Event) {
    event.preventDefault();
    const errors: Record<string, string> = {};

    if (!this.email.trim()) errors['email'] = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.email.trim())) errors['email'] = 'Enter a valid email address';
    if (!this.password) errors['password'] = 'Password is required';

    this.errors.set(errors);
    this.formError.set('');
    if (Object.keys(errors).length > 0) return;

    this.loading.set(true);
    this.auth.login(this.email.trim(), this.password).subscribe({
      next: (session) => {
        this.loading.set(false);
        this.toast.success(`Welcome back, ${session.user.firstName}`);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl ?? (session.user.role === 'seller' ? '/seller' : '/'));
      },
      error: (error) => {
        this.loading.set(false);
        const serverErrors = error?.error?.errors;
        if (serverErrors) this.errors.set(serverErrors);
        else if (!error?.status || error.status === 404) {
          this.formError.set(
            'Sign-in needs the live server and this preview cannot reach it. Open the hosted app to sign in.'
          );
        } else this.formError.set(error?.error?.title ?? 'Could not sign in. Please try again.');
      }
    });
  }

  useDemo(role: 'customer' | 'seller') {
    this.email = role === 'seller' ? 'seller@skinet.dev' : 'customer@skinet.dev';
    this.password = role === 'seller' ? 'Seller@123' : 'Customer@123';
    this.errors.set({});
    this.formError.set('');
  }
}
