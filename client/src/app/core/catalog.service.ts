import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
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

    return this.http.get<Pagination<Product>>(`${this.baseUrl}products`, { params });
  }

  getProduct(id: number | string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}categories`);
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}products/brands`);
  }

  getSellers(): Observable<Seller[]> {
    return this.http.get<Seller[]>(`${this.baseUrl}sellers`);
  }

  getSeller(id: number): Observable<Seller & { products: Product[] }> {
    return this.http.get<Seller & { products: Product[] }>(`${this.baseUrl}sellers?id=${id}`);
  }
}
