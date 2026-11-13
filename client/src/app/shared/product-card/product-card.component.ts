import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  private cart = inject(CartService);
  private toast = inject(ToastService);
  readonly wishlist = inject(WishlistService);

  add(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const product = this.product();
    this.cart.add(product);
    this.toast.success(`${product.name} added to cart`);
  }

  toggleWishlist(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.wishlist.toggle(this.product().id);
  }
}
