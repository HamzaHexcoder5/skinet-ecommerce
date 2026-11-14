import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { Product } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { WishlistService } from '../../core/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  private auth = inject(AuthService);
  private cart = inject(CartService);
  private toast = inject(ToastService);
  readonly wishlist = inject(WishlistService);

  add(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.auth.requireLogin('Sign in to add items to your cart')) return;

    const product = this.product();
    this.cart.add(product);
    this.toast.success(`${product.name} added to cart`);
  }

  toggleWishlist(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.auth.requireLogin('Sign in to save products to your wishlist')) return;

    const product = this.product();
    this.wishlist.toggle(product.id);
    this.toast.success(
      this.wishlist.has(product.id) ? `${product.name} saved to wishlist` : `${product.name} removed from wishlist`
    );
  }
}
