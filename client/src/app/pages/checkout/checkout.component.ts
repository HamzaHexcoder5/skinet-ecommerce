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
  readonly errors = signal<string[]>([]);

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
  }

  placeOrder() {
    const address = this.address();
    const missing: string[] = [];
    if (!address.fullName.trim()) missing.push('Full name');
    if (!address.phone.trim()) missing.push('Phone number');
    if (!address.city.trim()) missing.push('City');
    if (!address.street.trim()) missing.push('Street address');
    this.errors.set(missing);

    if (missing.length > 0) {
      this.toast.error('Please complete the delivery address');
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
        address,
        paymentMethod: this.payment() === 'cod' ? 'Cash on delivery' : 'Card'
      })
      .subscribe({
        next: (order) => {
          this.placing.set(false);
          this.placedOrder.set(order);
          this.cart.clear();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: () => {
          this.placing.set(false);
          this.toast.error('Could not place the order. Please try again.');
        }
      });
  }

  continueShopping() {
    this.router.navigate(['/catalog']);
  }
}
