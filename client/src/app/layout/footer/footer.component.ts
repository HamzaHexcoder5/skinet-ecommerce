import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  private toast = inject(ToastService);
  readonly email = signal('');
  readonly year = new Date().getFullYear();

  subscribe(event: Event) {
    event.preventDefault();
    if (!this.email().includes('@')) {
      this.toast.error('Enter a valid email address');
      return;
    }
    this.toast.success('You are subscribed to Skinet deals');
    this.email.set('');
  }
}
