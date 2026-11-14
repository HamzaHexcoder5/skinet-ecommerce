import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { Product, Seller } from '../../core/models';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

type StoreView = Seller & { products: Product[] };

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './store.component.html'
})
export class StoreComponent implements OnInit {
  private catalog = inject(CatalogService);
  private route = inject(ActivatedRoute);

  readonly store = signal<StoreView | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!Number.isFinite(id)) {
        this.notFound.set(true);
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.notFound.set(false);
      this.catalog.getSeller(id).subscribe({
        next: (store) => {
          this.store.set(store);
          this.loading.set(false);
        },
        error: () => {
          this.store.set(null);
          this.notFound.set(true);
          this.loading.set(false);
        }
      });
    });
  }

  stars(rating: number): number[] {
    return [1, 2, 3, 4, 5].map((star) => (rating >= star ? 1 : rating >= star - 0.5 ? 0.5 : 0));
  }

  followers(value: number): string {
    return value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value);
  }
}
