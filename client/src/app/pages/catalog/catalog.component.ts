import { Component, inject, OnInit, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { Category, Product } from '../../core/models';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

interface PriceBand {
  label: string;
  min: number | null;
  max: number | null;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, ProductCardComponent],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit {
  private catalog = inject(CatalogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly brands = signal<string[]>([]);
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly totalPages = signal(1);

  readonly page = signal(1);
  readonly search = signal('');
  readonly sort = signal('popular');
  readonly selectedCategories = signal<string[]>([]);
  readonly selectedBrands = signal<string[]>([]);
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  readonly minRating = signal<number | null>(null);
  readonly dealsOnly = signal(false);
  readonly filtersOpen = signal(false);

  readonly sortOptions = [
    { value: 'popular', label: 'Best selling' },
    { value: 'newest', label: 'Newest first' },
    { value: 'priceAsc', label: 'Price: low to high' },
    { value: 'priceDesc', label: 'Price: high to low' },
    { value: 'rating', label: 'Top rated' },
    { value: 'discount', label: 'Biggest discount' }
  ];

  readonly priceBands: PriceBand[] = [
    { label: 'Under $50', min: null, max: 50 },
    { label: '$50 – $150', min: 50, max: 150 },
    { label: '$150 – $300', min: 150, max: 300 },
    { label: 'Over $300', min: 300, max: null }
  ];

  ngOnInit() {
    this.catalog.getCategories().subscribe({ next: (c) => this.categories.set(c), error: () => this.categories.set([]) });
    this.catalog.getBrands().subscribe({ next: (b) => this.brands.set(b), error: () => this.brands.set([]) });

    this.route.queryParamMap.subscribe((params) => {
      this.search.set(params.get('q') ?? '');
      this.sort.set(params.get('sort') ?? 'popular');
      this.dealsOnly.set(params.get('deals') === 'true');
      this.selectedCategories.set(params.get('category') ? [params.get('category')!] : []);
      this.selectedBrands.set(params.get('brand') ? [params.get('brand')!] : []);
      this.minPrice.set(params.get('min') ? Number(params.get('min')) : null);
      this.maxPrice.set(params.get('max') ? Number(params.get('max')) : null);
      this.minRating.set(params.get('rating') ? Number(params.get('rating')) : null);
      this.page.set(params.get('page') ? Number(params.get('page')) : 1);
      this.load();
    });
  }

  toggleCategory(slug: string) {
    const current = this.selectedCategories();
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
    this.selectedCategories.set(next);
    this.apply();
  }

  toggleBrand(brand: string) {
    const current = this.selectedBrands();
    const next = current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand];
    this.selectedBrands.set(next);
    this.apply();
  }

  selectBand(band: PriceBand) {
    const active = this.minPrice() === band.min && this.maxPrice() === band.max;
    this.minPrice.set(active ? null : band.min);
    this.maxPrice.set(active ? null : band.max);
    this.apply();
  }

  isBandActive(band: PriceBand) {
    return this.minPrice() === band.min && this.maxPrice() === band.max;
  }

  setRating(value: number | null) {
    this.minRating.set(this.minRating() === value ? null : value);
    this.apply();
  }

  changeSort(value: string) {
    this.sort.set(value);
    this.apply();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.page.set(page);
    this.apply();
  }

  clearAll() {
    this.router.navigate(['/catalog']);
    this.filtersOpen.set(false);
  }

  get hasFilters() {
    return (
      this.selectedCategories().length > 0 ||
      this.selectedBrands().length > 0 ||
      this.minPrice() != null ||
      this.maxPrice() != null ||
      this.minRating() != null ||
      this.dealsOnly()
    );
  }

  get pages(): number[] {
    const total = this.totalPages();
    const current = this.page();
    const start = Math.max(1, Math.min(current - 1, total - 2));
    return Array.from({ length: Math.min(3, total) }, (_, index) => start + index);
  }

  apply() {
    const query: Record<string, string> = {};
    if (this.search()) query['q'] = this.search();
    if (this.sort() && this.sort() !== 'popular') query['sort'] = this.sort();
    if (this.dealsOnly()) query['deals'] = 'true';
    if (this.selectedCategories().length === 1) query['category'] = this.selectedCategories()[0];
    if (this.selectedBrands().length === 1) query['brand'] = this.selectedBrands()[0];
    if (this.minPrice() != null) query['min'] = String(this.minPrice());
    if (this.maxPrice() != null) query['max'] = String(this.maxPrice());
    if (this.minRating() != null) query['rating'] = String(this.minRating());

    this.filtersOpen.set(false);
    this.router.navigate(['/catalog'], { queryParams: query });
  }

  private load() {
    this.loading.set(true);
    this.catalog
      .getProducts({
        search: this.search() || undefined,
        categories: this.selectedCategories(),
        brands: this.selectedBrands(),
        sort: this.sort(),
        deals: this.dealsOnly(),
        minPrice: this.minPrice(),
        maxPrice: this.maxPrice(),
        minRating: this.minRating(),
        pageIndex: this.page(),
        pageSize: 12
      })
      .subscribe({
        next: (result) => {
          this.products.set(result.data);
          this.total.set(result.count);
          this.totalPages.set(result.totalPages);
          this.loading.set(false);
        },
        error: () => {
          this.products.set([]);
          this.total.set(0);
          this.loading.set(false);
        }
      });
  }
}
