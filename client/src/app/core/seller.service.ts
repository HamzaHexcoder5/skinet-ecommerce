import { effect, Injectable, signal } from '@angular/core';

export interface SellerProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: 'Active' | 'Draft';
  image: string;
}

const KEY = 'skinet_seller_products_v2';

const DEFAULTS: SellerProduct[] = [
  { id: 101, name: 'Alpine Pro Snowboard 155', price: 320, category: 'Boards', stock: 12, status: 'Active', image: '/images/products/sb-ang1.png' },
  { id: 102, name: 'Thermal Grip Gloves', price: 24, category: 'Gloves', stock: 40, status: 'Active', image: '/images/products/glove-code1.png' },
  { id: 103, name: 'Summit Beanie', price: 18, category: 'Hats', stock: 0, status: 'Draft', image: '/images/products/hat-core1.png' }
];

@Injectable({ providedIn: 'root' })
export class SellerService {
  readonly products = signal<SellerProduct[]>(this.restore());

  constructor() {
    effect(() => localStorage.setItem(KEY, JSON.stringify(this.products())));
  }

  add(product: Omit<SellerProduct, 'id' | 'status'>) {
    const next: SellerProduct = {
      ...product,
      id: Date.now(),
      status: 'Active'
    };
    this.products.set([next, ...this.products()]);
  }

  remove(id: number) {
    this.products.set(this.products().filter((product) => product.id !== id));
  }

  toggleStatus(id: number) {
    this.products.set(
      this.products().map((product) =>
        product.id === id ? { ...product, status: product.status === 'Active' ? 'Draft' : 'Active' } : product
      )
    );
  }

  private restore(): SellerProduct[] {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return DEFAULTS;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  }
}
