import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { ToastService } from '../../core/toast.service';
import { WishlistService } from '../../core/wishlist.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  private wishlist = inject(WishlistService);
  private toast = inject(ToastService);
  private router = inject(Router);

  readonly couponInput = signal('');
  readonly couponError = signal(false);

  applyCoupon() {
    const applied = this.cart.applyCoupon(this.couponInput());
    this.couponError.set(!applied);
    if (applied) {
      this.toast.success(`Coupon ${this.couponInput().toUpperCase()} applied`);
      this.couponInput.set('');
    } else {
      this.toast.error('That coupon code is not valid');
    }
  }

  changeQuantity(productId: number, value: string) {
    const quantity = Number(value);
    if (!Number.isFinite(quantity)) return;
    this.cart.setQuantity(productId, quantity);
  }

  remove(productId: number) {
    this.cart.remove(productId);
    this.toast.info('Item removed from cart');
  }

  saveForLater(productId: number) {
    this.cart.remove(productId);
    if (!this.wishlist.has(productId)) this.wishlist.toggle(productId);
    this.toast.success('Moved to your wishlist');
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
