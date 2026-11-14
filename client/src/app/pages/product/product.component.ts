import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { CatalogService } from '../../core/catalog.service';
import { Product } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { WishlistService } from '../../core/wishlist.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalog = inject(CatalogService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  readonly cart = inject(CartService);
  readonly wishlist = inject(WishlistService);

  readonly product = signal<Product | null>(null);
  readonly related = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly quantity = signal(1);
  readonly tab = signal<'description' | 'specs' | 'reviews'>('description');

  readonly reviews = [
    { name: 'Ayesha K.', rating: 5, date: '2 days ago', text: 'Exactly as described. Shipping was faster than expected and the packaging was solid.' },
    { name: 'Bilal R.', rating: 4, date: '1 week ago', text: 'Great quality for the price. Fits well, would buy from this seller again.' },
    { name: 'Hamza S.', rating: 5, date: '3 weeks ago', text: 'Used it for a full weekend trip, no complaints at all. Recommended.' }
  ];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return;
      this.loading.set(true);
      this.notFound.set(false);
      this.quantity.set(1);
      this.tab.set('description');

      this.catalog.getProduct(id).subscribe({
        next: (product) => {
          this.product.set(product);
          this.loading.set(false);
          this.loadRelated(product);
        },
        error: () => {
          this.loading.set(false);
          this.notFound.set(true);
        }
      });
    });
  }

  increment() {
    const product = this.product();
    if (!product) return;
    this.quantity.set(Math.min(this.quantity() + 1, product.quantityInStock || 99));
  }

  decrement() {
    this.quantity.set(Math.max(1, this.quantity() - 1));
  }

  addToCart() {
    const product = this.product();
    if (!product) return;
    if (!this.auth.requireLogin('Sign in to add items to your cart')) return;

    this.cart.add(product, this.quantity());
    this.toast.success(`${product.name} added to cart`);
  }

  buyNow() {
    const product = this.product();
    if (!product) return;
    if (!this.auth.requireLogin('Sign in to buy this item')) return;

    this.cart.add(product, this.quantity());
    this.router.navigate(['/checkout']);
  }

  toggleWishlist() {
    const product = this.product();
    if (!product) return;
    if (!this.auth.requireLogin('Sign in to save products to your wishlist')) return;

    this.wishlist.toggle(product.id);
    this.toast.success(
      this.wishlist.has(product.id) ? `${product.name} saved to wishlist` : `${product.name} removed from wishlist`
    );
  }

  private loadRelated(product: Product) {
    this.catalog.getProducts({ categories: [product.category], pageSize: 5 }).subscribe({
      next: (page) => this.related.set(page.data.filter((item) => item.id !== product.id).slice(0, 4)),
      error: () => this.related.set([])
    });
  }
}
