import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { Product } from '../../core/models';
import { WishlistService } from '../../core/wishlist.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  template: `
    <section class="page pt-4">
      <nav class="mb-4 flex items-center gap-1.5 text-xs text-ink-500">
        <a routerLink="/" class="transition hover:text-brand-600">Home</a>
        <span class="material-icons text-[14px]">chevron_right</span>
        <span class="font-medium text-ink-700">Wishlist</span>
      </nav>

      <h1 class="mb-5 text-2xl font-extrabold text-ink-900">Wishlist</h1>

      @if (items().length === 0) {
        <div class="rounded-2xl border border-dashed border-ink-200 bg-white py-20 text-center">
          <span class="material-icons text-[56px] text-ink-300">favorite_border</span>
          <h2 class="mt-4 text-lg font-bold text-ink-900">Your wishlist is empty</h2>
          <p class="mt-1 text-sm text-ink-500">Tap the heart on any product to save it here.</p>
          <a routerLink="/catalog" class="btn-primary mt-6">Browse products</a>
        </div>
      } @else {
        <p class="mb-4 text-sm text-ink-500">{{ items().length }} saved items</p>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          @for (product of items(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      }
    </section>
  `
})
export class WishlistComponent implements OnInit {
  private catalog = inject(CatalogService);
  readonly wishlist = inject(WishlistService);

  private readonly all = signal<Product[]>([]);
  readonly items = computed(() => this.all().filter((product) => this.wishlist.ids().includes(product.id)));

  ngOnInit() {
    this.catalog.getProducts({ pageSize: 100 }).subscribe({
      next: (page) => this.all.set(page.data),
      error: () => this.all.set([])
    });
  }
}
