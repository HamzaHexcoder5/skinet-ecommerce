import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Address, Order, User } from './models';

export const SESSION_KEY = 'skinet_session_v2';
const ORDERS_KEY = 'skinet_orders_v2';

export interface Session {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  readonly session = signal<Session | null>(this.restore());
  readonly user = computed(() => this.session()?.user ?? null);
  readonly token = computed(() => this.session()?.token ?? null);
  readonly isLoggedIn = computed(() => !!this.session());
  readonly isSeller = computed(() => this.session()?.user.role === 'seller');
  readonly orders = signal<Order[]>(this.restoreOrders());

  login(email: string, password: string) {
    return this.http
      .post<Session>(`${this.baseUrl}auth/login`, { email, password })
      .pipe(tap((session) => this.persist(session)));
  }

  register(payload: { firstName: string; lastName: string; email: string; password: string }) {
    return this.http
      .post<Session>(`${this.baseUrl}auth/register`, payload)
      .pipe(tap((session) => this.persist(session)));
  }

  registerSeller(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    storeName: string;
  }) {
    return this.http
      .post<Session>(`${this.baseUrl}auth/register`, payload)
      .pipe(tap((session) => this.persist(session)));
  }

  /** Confirms the stored token is still valid and refreshes the cached profile. */
  refreshSession() {
    if (!this.session()) return;
    this.http.get<User>(`${this.baseUrl}auth/me`).subscribe({
      next: (user) => this.persist({ token: this.session()!.token, user }),
      error: () => this.logout()
    });
  }

  logout() {
    this.session.set(null);
    localStorage.removeItem(SESSION_KEY);
  }

  placeOrder(payload: {
    items: unknown;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    address: Address;
    paymentMethod: string;
  }) {
    return this.http
      .post<Order>(`${this.baseUrl}orders`, payload)
      .pipe(tap((order) => this.rememberOrder(order)));
  }

  loadOrders() {
    if (!this.isLoggedIn()) return;
    this.http.get<Order[]>(`${this.baseUrl}orders`).subscribe({
      next: (orders) => {
        const merged = [...orders, ...this.orders().filter((local) => !orders.some((item) => item.id === local.id))];
        this.orders.set(merged);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(merged));
      },
      error: () => {
        /* keep the locally cached orders */
      }
    });
  }

  private rememberOrder(order: Order) {
    const next = [order, ...this.orders().filter((item) => item.id !== order.id)];
    this.orders.set(next);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
  }

  private restoreOrders(): Order[] {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persist(session: Session) {
    this.session.set(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private restore(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }
}
