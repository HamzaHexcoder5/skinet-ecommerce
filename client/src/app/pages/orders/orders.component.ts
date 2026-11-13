import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page pt-4">
      <nav class="mb-4 flex items-center gap-1.5 text-xs text-ink-500">
        <a routerLink="/" class="transition hover:text-brand-600">Home</a>
        <span class="material-icons text-[14px]">chevron_right</span>
        <span class="font-medium text-ink-700">My orders</span>
      </nav>

      <h1 class="mb-5 text-2xl font-extrabold text-ink-900">My orders</h1>

      @if (auth.orders().length === 0) {
        <div class="rounded-2xl border border-dashed border-ink-200 bg-white py-20 text-center">
          <span class="material-icons text-[56px] text-ink-300">receipt_long</span>
          <h2 class="mt-4 text-lg font-bold text-ink-900">No orders yet</h2>
          <p class="mt-1 text-sm text-ink-500">When you place an order it will appear here.</p>
          <a routerLink="/catalog" class="btn-primary mt-6">Start shopping</a>
        </div>
      } @else {
        <div class="space-y-3">
          @for (order of auth.orders(); track order.id) {
            <div class="rounded-xl border border-ink-100 bg-white">
              <button
                type="button"
                class="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
                (click)="toggle(order.id)"
              >
                <div>
                  <p class="text-sm font-bold text-ink-900">Order {{ order.id }}</p>
                  <p class="text-xs text-ink-500">{{ shortDate(order.placedAt) }} · {{ order.items.length }} items · {{ order.paymentMethod }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="chip bg-amber-50 text-amber-700">{{ order.status }}</span>
                  <span class="text-base font-bold text-ink-900">\${{ order.total.toFixed(2) }}</span>
                  <span class="material-icons text-[20px] text-ink-400">
                    {{ expanded() === order.id ? 'expand_less' : 'expand_more' }}
                  </span>
                </div>
              </button>

              @if (expanded() === order.id) {
                <div class="border-t border-ink-100 p-4">
                  <div class="space-y-2">
                    @for (item of order.items; track item.productId) {
                      <div class="flex items-center gap-3">
                        <img [src]="item.pictureUrl" [alt]="item.name" class="h-12 w-12 rounded-lg object-cover" />
                        <div class="min-w-0 flex-1">
                          <p class="truncate text-sm font-medium text-ink-800">{{ item.name }}</p>
                          <p class="text-xs text-ink-500">Qty {{ item.quantity }} · \${{ item.price.toFixed(2) }}</p>
                        </div>
                        <p class="text-sm font-semibold text-ink-800">\${{ (item.price * item.quantity).toFixed(2) }}</p>
                      </div>
                    }
                  </div>

                  <div class="mt-3 grid gap-3 border-t border-ink-100 pt-3 text-xs text-ink-600 sm:grid-cols-2">
                    <div>
                      <p class="font-semibold uppercase tracking-wide text-ink-400">Delivery address</p>
                      <p class="mt-1">{{ order.address?.fullName }}</p>
                      <p>{{ order.address?.street }}, {{ order.address?.area }}</p>
                      <p>{{ order.address?.city }} · {{ order.address?.phone }}</p>
                    </div>
                    <div class="sm:text-right">
                      <p>Subtotal: \${{ order.subtotal.toFixed(2) }}</p>
                      <p>Delivery: \${{ order.shipping.toFixed(2) }}</p>
                      @if (order.discount > 0) {
                        <p class="text-emerald-600">Discount: -\${{ order.discount.toFixed(2) }}</p>
                      }
                      <p class="mt-1 text-sm font-bold text-ink-900">Total: \${{ order.total.toFixed(2) }}</p>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </section>
  `
})
export class OrdersComponent {
  readonly auth = inject(AuthService);
  readonly expanded = signal<string | null>(null);

  toggle(id: string) {
    this.expanded.set(this.expanded() === id ? null : id);
  }

  shortDate(value: string): string {
    return value ? new Date(value).toLocaleDateString() : '';
  }
}
