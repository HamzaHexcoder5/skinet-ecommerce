import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { CatalogService } from '../../core/catalog.service';
import { Category } from '../../core/models';
import { WishlistService } from '../../core/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private router = inject(Router);
  private catalog = inject(CatalogService);
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  readonly wishlist = inject(WishlistService);

  readonly categories = signal<Category[]>([]);
  readonly term = signal('');
  readonly scope = signal('all');
  readonly mobileOpen = signal(false);
  readonly accountOpen = signal(false);

  constructor() {
    this.catalog.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.categories.set([])
    });
  }

  search(event?: Event) {
    event?.preventDefault();
    const query: Record<string, string> = {};
    if (this.term().trim()) query['q'] = this.term().trim();
    if (this.scope() !== 'all') query['category'] = this.scope();
    this.mobileOpen.set(false);
    this.router.navigate(['/catalog'], { queryParams: query });
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
}
