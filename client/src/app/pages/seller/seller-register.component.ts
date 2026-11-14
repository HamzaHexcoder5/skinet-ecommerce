import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-seller-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './seller-register.component.html'
})
export class SellerRegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  form = { storeName: '', firstName: '', lastName: '', email: '', password: '' };
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
      .registerSeller({
        firstName: this.form.firstName.trim(),
        lastName: this.form.lastName.trim(),
        email: this.form.email.trim(),
        password: this.form.password,
        storeName: this.form.storeName.trim()
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.toast.success('Your store is ready');
          this.router.navigateByUrl('/seller');
        },
        error: (error) => {
          this.loading.set(false);
          const serverErrors = error?.error?.errors;
          if (serverErrors) this.errors.set(serverErrors);
          else this.formError.set(error?.error?.title ?? 'Could not create the store.');
        }
      });
  }

  private validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    const storeName = this.form.storeName.trim();

    if (!storeName) errors['storeName'] = 'Store name is required';
    else if (storeName.length < 3) errors['storeName'] = 'Store name must be at least 3 characters';
    else if (storeName.length > 60) errors['storeName'] = 'Store name is too long';

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
