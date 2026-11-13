import { effect, Injectable, signal } from '@angular/core';

const KEY = 'skinet_wishlist_v2';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  readonly ids = signal<number[]>(this.restore());

  constructor() {
    effect(() => localStorage.setItem(KEY, JSON.stringify(this.ids())));
  }

  has(id: number): boolean {
    return this.ids().includes(id);
  }

  toggle(id: number) {
    this.ids.set(this.has(id) ? this.ids().filter((item) => item !== id) : [...this.ids(), id]);
  }

  private restore(): number[] {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
