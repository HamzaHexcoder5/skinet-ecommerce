import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { AuthService } from './auth.service';

const STORAGE_KEY = 'skinet_wishlist_v2';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private auth = inject(AuthService);

  readonly ids = signal<number[]>([]);

  constructor() {
    // Saved items follow the signed-in account, never the browser.
    effect(() => {
      const userId = this.auth.user()?.id ?? null;
      untracked(() => this.ids.set(userId ? this.read(userId) : []));
    });

    effect(() => {
      const userId = this.auth.user()?.id ?? null;
      const ids = this.ids();
      if (!userId) return;
      localStorage.setItem(this.key(userId), JSON.stringify(ids));
    });
  }

  has(id: number): boolean {
    return this.ids().includes(id);
  }

  toggle(id: number) {
    this.ids.set(this.has(id) ? this.ids().filter((item) => item !== id) : [...this.ids(), id]);
  }

  clear() {
    this.ids.set([]);
  }

  private key(userId: string): string {
    return `${STORAGE_KEY}:${userId}`;
  }

  private read(userId: string): number[] {
    try {
      const raw = localStorage.getItem(this.key(userId));
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
