import { Component, ElementRef, HostListener, inject, signal, AfterViewInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subject, catchError, debounceTime, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { CatalogService } from '../../core/catalog.service';
import { Category, Product } from '../../core/models';
import { SelectComponent, SelectOption } from '../../shared/select/select.component';
import { WishlistService } from '../../core/wishlist.service';

const RECENT_KEY = 'skinet_recent_searches';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, SelectComponent],
  templateUrl: './header.component.html',
  // The host is the sticky element: an inner <header> could never stick,
  // because its containing block would be this component's own host box.
  host: { class: 'sticky top-0 z-40 block' }
})
export class HeaderComponent implements AfterViewInit {
  private router = inject(Router);
  private catalog = inject(CatalogService);
  private hostEl = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  readonly wishlist = inject(WishlistService);

  readonly categories = signal<Category[]>([]);
  readonly scopeOptions = signal<SelectOption[]>([]);
  readonly term = signal('');
  readonly scope = signal('all');
  readonly mobileOpen = signal(false);
  readonly accountOpen = signal(false);

  readonly suggestions = signal<Product[]>([]);
  readonly suggestOpen = signal(false);
  readonly activeIndex = signal(-1);
  readonly searching = signal(false);
  readonly recent = signal<string[]>(this.readRecent());

  private term$ = new Subject<string>();

  constructor() {
    this.catalog.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.scopeOptions.set([
          { value: 'all', label: 'All categories', icon: 'apps' },
          ...categories.map((category) => ({
            value: category.slug,
            label: category.name,
            hint: String(category.count)
          }))
        ]);
      },
      error: () => this.categories.set([])
    });

    this.term$
      .pipe(
        debounceTime(150),
        switchMap((term) => {
          const query = term.trim();
          // Even a single character should suggest something, like any
          // production search box does.
          if (!query) {
            this.searching.set(false);
            return of([] as Product[]);
          }
          this.searching.set(true);
          return this.catalog.getProducts({ search: query, pageSize: 6 }).pipe(
            map((page) => page.data),
            catchError(() => of([] as Product[]))
          );
        })
      )
      .subscribe((products) => {
        this.searching.set(false);
        this.suggestions.set(products);
      });
  }

  ngAfterViewInit() {
    const el = this.hostEl.nativeElement;
    const publish = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    publish();
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(publish).observe(el);
  }

  onTerm(value: string) {
    this.term.set(value);
    this.suggestOpen.set(true);
    this.activeIndex.set(-1);
    this.term$.next(value);
  }

  onSearchKey(event: KeyboardEvent) {
    const items = this.suggestions();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.suggestOpen.set(true);
      this.activeIndex.set(Math.min(this.activeIndex() + 1, items.length - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.set(Math.max(this.activeIndex() - 1, -1));
      return;
    }

    if (event.key === 'Enter' && this.activeIndex() >= 0) {
      event.preventDefault();
      const product = items[this.activeIndex()];
      if (product) this.openProduct(product);
      return;
    }

    if (event.key === 'Escape') {
      this.suggestOpen.set(false);
      this.activeIndex.set(-1);
    }
  }

  openProduct(product: Product) {
    this.suggestOpen.set(false);
    this.activeIndex.set(-1);
    this.term.set('');
    this.term$.next('');
    this.router.navigate(['/product', product.id]);
  }

  search(event?: Event) {
    event?.preventDefault();
    this.submitSearch();
  }

  submitSearch() {
    const query = this.term().trim();
    const params: Record<string, string> = {};
    if (query) params['q'] = query;
    if (this.scope() !== 'all') params['category'] = this.scope();
    if (query) this.remember(query);
    this.suggestOpen.set(false);
    this.mobileOpen.set(false);
    this.router.navigate(['/catalog'], { queryParams: params });
  }

  useRecent(term: string) {
    this.term.set(term);
    this.suggestOpen.set(false);
    this.remember(term);
    this.router.navigate(['/catalog'], { queryParams: { q: term } });
  }

  clearRecent() {
    this.recent.set([]);
    localStorage.removeItem(RECENT_KEY);
  }

  closeSearch() {
    this.suggestOpen.set(false);
    this.activeIndex.set(-1);
  }

  setScope(value: string) {
    this.scope.set(value);
  }

  logout() {
    this.auth.logout();
    this.accountOpen.set(false);
    this.router.navigateByUrl('/');
  }

  closeMenus() {
    this.mobileOpen.set(false);
    this.accountOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('[data-search]')) this.suggestOpen.set(false);
  }

  private remember(term: string) {
    const next = [term, ...this.recent().filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 6);
    this.recent.set(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  }

  private readRecent(): string[] {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
    } catch {
      return [];
    }
  }
}
