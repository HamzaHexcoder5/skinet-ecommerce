import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  form = { firstName: '', lastName: '', email: '', password: '' };
  readonly loading = signal(false);
  readonly errors = signal<Record<string, string>>({});
  readonly formError = signal('');

  submit(event: Event) {
    event.preventDefault();
    const errors = this.validate();
    this.errors.set(errors);
    this.formError.set('');
    if (Object.keys(errors).length > 0) return;

    this.loading.set(true);
    this.auth
      .register({
        firstName: this.form.firstName.trim(),
        lastName: this.form.lastName.trim(),
        email: this.form.email.trim(),
        password: this.form.password
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.toast.success('Account created. Welcome to Skinet!');
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          this.loading.set(false);
          const serverErrors = error?.error?.errors;
          if (serverErrors) this.errors.set(serverErrors);
          else this.formError.set(error?.error?.title ?? 'Could not create the account.');
        }
      });
  }

  private validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this.form.firstName.trim()) errors['firstName'] = 'First name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.form.email.trim())) {
      errors['email'] = 'Enter a valid email address';
    }
    if (this.form.password.length < 8) errors['password'] = 'Use at least 8 characters';
    else if (!/[A-Za-z]/.test(this.form.password) || !/[0-9]/.test(this.form.password)) {
      errors['password'] = 'Use both letters and numbers';
    }
    return errors;
  }
}
