import { computed, effect, Injectable, signal } from '@angular/core';
import { Cart, CartItem, Product } from './models';

const STORAGE_KEY = 'skinet_cart_v2';

const COUPONS: Record<string, { label: string; percent?: number; flat?: number; freeShipping?: boolean }> = {
  SKINET10: { label: '10% off your order', percent: 10 },
  WELCOME5: { label: '$5 off your first order', flat: 5 },
  FREESHIP: { label: 'Free delivery', freeShipping: true }
};

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly cart = signal<Cart>(this.restore());
  readonly couponCode = signal<string | null>(this.cart().coupon);

  readonly count = computed(() => this.cart().items.reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() =>
    this.cart().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  readonly shipping = computed(() => {
    if (this.cart().items.length === 0) return 0;
    if (this.coupon()?.freeShipping) return 0;
    return this.subtotal() >= 120 ? 0 : 7.99;
  });

  readonly discount = computed(() => {
    const coupon = this.coupon();
    if (!coupon) return 0;
    if (coupon.percent) return Math.round(this.subtotal() * (coupon.percent / 100) * 100) / 100;
    if (coupon.flat) return Math.min(coupon.flat, this.subtotal());
    return 0;
  });

  readonly total = computed(() =>
    Math.max(0, Math.round((this.subtotal() + this.shipping() - this.discount()) * 100) / 100)
  );

  readonly coupon = computed(() => {
    const code = this.couponCode();
    return code && COUPONS[code] ? { code, ...COUPONS[code] } : null;
  });

  constructor() {
    effect(() => {
      const cart = this.cart();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    });
  }

  add(product: Product, quantity = 1) {
    const items = [...this.cart().items];
    const existing = items.find((item) => item.productId === product.id);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.quantityInStock || 99);
    } else {
      const item: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: Math.min(quantity, product.quantityInStock || 99),
        pictureUrl: product.pictureUrl,
        brand: product.brand,
        sellerName: product.sellerName,
        stock: product.quantityInStock
      };
      items.push(item);
    }

    this.cart.set({ ...this.cart(), items });
  }

  setQuantity(productId: number, quantity: number) {
    const items = this.cart()
      .items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock || 99)) }
          : item
      );
    this.cart.set({ ...this.cart(), items });
  }

  remove(productId: number) {
    this.cart.set({
      ...this.cart(),
      items: this.cart().items.filter((item) => item.productId !== productId)
    });
  }

  quantityOf(productId: number): number {
    return this.cart().items.find((item) => item.productId === productId)?.quantity ?? 0;
  }

  applyCoupon(code: string): boolean {
    const normalised = code.trim().toUpperCase();
    if (!COUPONS[normalised]) return false;
    this.couponCode.set(normalised);
    this.cart.set({ ...this.cart(), coupon: normalised });
    return true;
  }

  clearCoupon() {
    this.couponCode.set(null);
    this.cart.set({ ...this.cart(), coupon: null });
  }

  clear() {
    this.cart.set({ items: [], coupon: null });
    this.couponCode.set(null);
  }

  private restore(): Cart {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { items: [], coupon: null };
      const parsed = JSON.parse(raw) as Cart;
      if (!Array.isArray(parsed.items)) return { items: [], coupon: null };
      return { items: parsed.items, coupon: parsed.coupon ?? null };
    } catch {
      return { items: [], coupon: null };
    }
  }
}
