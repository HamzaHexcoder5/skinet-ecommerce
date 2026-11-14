import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { Address, Order } from '../../core/models';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  readonly address = signal<Address>({
    fullName: '',
    phone: '',
    city: '',
    area: '',
    street: '',
    notes: ''
  });

  readonly delivery = signal<'standard' | 'express'>('standard');
  readonly payment = signal<'cod' | 'card'>('cod');
  readonly placing = signal(false);
  readonly placedOrder = signal<Order | null>(null);
  readonly errors = signal<Record<string, string>>({});

  get expressFee(): number {
    return 12;
  }

  get shippingFee(): number {
    return this.delivery() === 'express' ? this.expressFee : this.cart.shipping();
  }

  get total(): number {
    return Math.max(0, Math.round((this.cart.subtotal() + this.shippingFee - this.cart.discount()) * 100) / 100);
  }

  update(field: keyof Address, value: string) {
    this.address.set({ ...this.address(), [field]: value });
    if (this.errors()[field]) {
      const next = { ...this.errors() };
      delete next[field];
      this.errors.set(next);
    }
  }

  placeOrder() {
    const address = this.address();
    const errors = this.validate(address);
    this.errors.set(errors);

    if (Object.keys(errors).length > 0) {
      this.toast.error('Please check the highlighted fields');
      return;
    }

    this.placing.set(true);
    this.auth
      .placeOrder({
        items: this.cart.cart().items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          pictureUrl: item.pictureUrl
        })),
        subtotal: this.cart.subtotal(),
        shipping: this.shippingFee,
        discount: this.cart.discount(),
        total: this.total,
        address: {
          ...address,
          fullName: address.fullName.trim(),
          phone: address.phone.trim(),
          city: address.city.trim(),
          area: address.area.trim(),
          street: address.street.trim()
        },
        paymentMethod: this.payment()
      })
      .subscribe({
        next: (order) => {
          this.placing.set(false);
          this.placedOrder.set(order);
          this.cart.clear();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (error) => {
          this.placing.set(false);
          const serverErrors = error?.error?.errors;
          if (serverErrors) this.errors.set(serverErrors);
          this.toast.error(error?.error?.title ?? 'Could not place the order. Please try again.');
        }
      });
  }

  continueShopping() {
    this.router.navigate(['/catalog']);
  }

  private validate(address: Address): Record<string, string> {
    const errors: Record<string, string> = {};
    const phone = address.phone.trim();

    if (!address.fullName.trim()) errors['fullName'] = 'Full name is required';
    else if (address.fullName.trim().length < 3) errors['fullName'] = 'Enter your full name';

    if (!phone) errors['phone'] = 'Phone number is required';
    else if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) errors['phone'] = 'Enter a valid phone number';

    if (!address.city.trim()) errors['city'] = 'City is required';
    if (!address.street.trim()) errors['street'] = 'Street address is required';
    else if (address.street.trim().length < 5) errors['street'] = 'Add a little more detail';

    return errors;
  }
}
