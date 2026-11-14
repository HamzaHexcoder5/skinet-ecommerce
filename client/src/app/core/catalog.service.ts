import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { DEMO_CATEGORIES, DEMO_PRODUCTS, DEMO_SELLERS } from './demo-catalog';
import { CatalogQuery, Category, Pagination, Product, Seller } from './models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getProducts(query: CatalogQuery): Observable<Pagination<Product>> {
    let params = new HttpParams();

    if (query.search) params = params.set('search', query.search);
    if (query.categories?.length) params = params.set('categories', query.categories.join(','));
    if (query.brands?.length) params = params.set('brands', query.brands.join(','));
    if (query.types?.length) params = params.set('types', query.types.join(','));
    if (query.sort) params = params.set('sort', query.sort);
    if (query.minPrice != null) params = params.set('minPrice', String(query.minPrice));
    if (query.maxPrice != null) params = params.set('maxPrice', String(query.maxPrice));
    if (query.minRating != null) params = params.set('minRating', String(query.minRating));
    if (query.deals) params = params.set('deals', 'true');

    params = params.set('pageIndex', String(query.pageIndex ?? 1));
    params = params.set('pageSize', String(query.pageSize ?? 12));

    return this.http
      .get<Pagination<Product>>(`${this.baseUrl}products`, { params })
      .pipe(catchError(() => of(this.localCatalog(query))));
  }

  getProduct(id: number | string): Observable<Product> {
    return this.http
      .get<Product>(`${this.baseUrl}products/${id}`)
      .pipe(
        catchError(() => {
          const match = DEMO_PRODUCTS.find((product) => String(product.id) === String(id));
          if (!match) throw new Error('Product not found');
          return of(match);
        })
      );
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.baseUrl}categories`)
      .pipe(catchError(() => of(DEMO_CATEGORIES)));
  }

  getBrands(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.baseUrl}products/brands`)
      .pipe(
        catchError(() =>
          of([...new Set(DEMO_PRODUCTS.map((product) => product.brand))].sort((a, b) => a.localeCompare(b)))
        )
      );
  }

  getSellers(): Observable<Seller[]> {
    return this.http.get<Seller[]>(`${this.baseUrl}sellers`).pipe(catchError(() => of(DEMO_SELLERS)));
  }

  getSeller(id: number): Observable<Seller & { products: Product[] }> {
    return this.http.get<Seller & { products: Product[] }>(`${this.baseUrl}sellers?id=${id}`).pipe(
      catchError(() => {
        const seller = DEMO_SELLERS.find((item) => item.id === id);
        if (!seller) throw new Error('Store not found');
        return of({ ...seller, products: DEMO_PRODUCTS.filter((product) => product.sellerId === id) });
      })
    );
  }

  /**
   * Offline fallback used on static hosting, where /api is not available.
   * Mirrors the filtering, sorting and paging rules of the serverless endpoint.
   */
  private localCatalog(query: CatalogQuery): Pagination<Product> {
    let items = DEMO_PRODUCTS.slice();

    if (query.search) {
      const term = query.search.toLowerCase();
      items = items.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term)
      );
    }
    if (query.categories?.length) items = items.filter((product) => query.categories!.includes(product.category));
    if (query.brands?.length) items = items.filter((product) => query.brands!.includes(product.brand));
    if (query.types?.length) items = items.filter((product) => query.types!.includes(product.type));
    if (query.minPrice != null) items = items.filter((product) => product.price >= query.minPrice!);
    if (query.maxPrice != null) items = items.filter((product) => product.price <= query.maxPrice!);
    if (query.minRating != null) items = items.filter((product) => product.rating >= query.minRating!);
    if (query.deals) items = items.filter((product) => product.discountPercent > 0);

    switch (query.sort) {
      case 'priceAsc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        items.sort((a, b) => b.id - a.id);
        break;
      case 'discount':
        items.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'popular':
        items.sort((a, b) => b.sold - a.sold);
        break;
      default:
        items.sort((a, b) => a.name.localeCompare(b.name));
    }

    const pageSize = query.pageSize ?? 12;
    const pageIndex = query.pageIndex ?? 1;
    const count = items.length;

    return {
      pageIndex,
      pageSize,
      count,
      totalPages: Math.max(1, Math.ceil(count / pageSize)),
      data: items.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    };
  }
}
