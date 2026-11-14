import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SellerProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  pictureUrl: string;
}

export interface SellerOrder {
  id: string;
  placedAt: string;
  status: string;
  paymentMethod: string;
  sellerTotal: number;
  address?: { fullName?: string; city?: string; phone?: string };
  items: { productId: number; name: string; price: number; quantity: number; pictureUrl: string }[];
}

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
  type: string;
  pictureUrl: string;
}

function mapProduct(product: ApiProduct): SellerProduct {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.type,
    stock: product.quantityInStock,
    image: product.pictureUrl,
    description: product.description
  };
}

@Injectable({ providedIn: 'root' })
export class SellerProductService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  readonly products = signal<SellerProduct[]>([]);
  readonly loading = signal(false);
  readonly loaded = signal(false);
  readonly orders = signal<SellerOrder[]>([]);
  readonly ordersLoading = signal(false);

  load() {
    this.loading.set(true);
    this.http.get<ApiProduct[]>(`${this.baseUrl}seller/products`).subscribe({
      next: (products) => {
        this.products.set(products.map(mapProduct));
        this.loading.set(false);
        this.loaded.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.loaded.set(true);
      }
    });
  }

  loadOrders() {
    this.ordersLoading.set(true);
    this.http.get<SellerOrder[]>(`${this.baseUrl}seller/orders`).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.ordersLoading.set(false);
      },
      error: () => {
        this.orders.set([]);
        this.ordersLoading.set(false);
      }
    });
  }

  create(payload: ProductPayload) {
    return this.http
      .post<ApiProduct>(`${this.baseUrl}seller/products`, payload)
      .pipe(tap((product) => this.products.set([mapProduct(product), ...this.products()])));
  }

  update(id: number, payload: ProductPayload) {
    return this.http
      .put<ApiProduct>(`${this.baseUrl}seller/products/${id}`, payload)
      .pipe(
        tap((product) =>
          this.products.set(
            this.products().map((item) => (item.id === id ? mapProduct(product) : item))
          )
        )
      );
  }

  remove(id: number) {
    return this.http
      .delete<void>(`${this.baseUrl}seller/products/${id}`)
      .pipe(tap(() => this.products.set(this.products().filter((item) => item.id !== id))));
  }
}
