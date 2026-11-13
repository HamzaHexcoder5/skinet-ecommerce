import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SellerService } from '../../core/seller.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    @if (!auth.isSeller()) {
      <section class="page py-20 text-center">
        <span class="material-icons text-[56px] text-brand-400">storefront</span>
        <h1 class="mt-4 text-2xl font-extrabold text-ink-900">
          {{ auth.isLoggedIn() ? 'Open your store to start selling' : 'Sign in to the seller center' }}
        </h1>
        <p class="mx-auto mt-2 max-w-md text-sm text-ink-500">
          Manage products, stock and orders from one dashboard. Free to set up.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-2">
          @if (auth.isLoggedIn()) {
            <a routerLink="/seller/register" class="btn-primary">Create a store</a>
          } @else {
            <a routerLink="/login" class="btn-primary">Sign in</a>
            <a routerLink="/seller/register" class="btn-outline">Create a store</a>
          }
        </div>
      </section>
    } @else {
      <section class="page pt-4">
        <nav class="mb-4 flex items-center gap-1.5 text-xs text-ink-500">
          <a routerLink="/" class="transition hover:text-brand-600">Home</a>
          <span class="material-icons text-[14px]">chevron_right</span>
          <span class="font-medium text-ink-700">Seller center</span>
        </nav>

        <!-- Store header -->
        <div class="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink-900 p-5 text-white">
          <div class="flex items-center gap-4">
            <span class="grid h-14 w-14 place-items-center rounded-xl bg-brand-500 text-xl font-extrabold">
              {{ (auth.user()?.store?.name ?? 'S').charAt(0) }}
            </span>
            <div>
              <h1 class="text-xl font-extrabold">{{ auth.user()?.store?.name }}</h1>
              <p class="text-xs text-white/60">
                seller&#64;skinet · {{ auth.user()?.store?.rating || 'New' }} rating · joined {{ auth.user()?.store?.joined }}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <a routerLink="/catalog" class="btn border border-white/20 text-white hover:bg-white/10">View storefront</a>
            <button type="button" class="btn-primary" (click)="openForm()">
              <span class="material-icons text-[18px]">add</span>
              Add product
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          @for (stat of stats(); track stat.label) {
            <div class="rounded-xl border border-ink-100 bg-white p-4">
              <div class="flex items-center justify-between">
                <p class="text-xs font-semibold uppercase tracking-wide text-ink-400">{{ stat.label }}</p>
                <span class="material-icons text-[18px] text-brand-400">{{ stat.icon }}</span>
              </div>
              <p class="mt-2 text-2xl font-extrabold text-ink-900">{{ stat.value }}</p>
              <p class="mt-0.5 text-[11px] text-ink-500">{{ stat.hint }}</p>
            </div>
          }
        </div>

        <!-- Tabs -->
        <div class="mb-4 flex gap-1 overflow-x-auto border-b border-ink-200">
          @for (item of [
            { key: 'products', label: 'Products' },
            { key: 'orders', label: 'Orders' },
            { key: 'settings', label: 'Store settings' }
          ]; track item.key) {
            <button
              type="button"
              class="whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition"
              [class.text-brand-600]="tab() === item.key"
              [class.border-b-2]="tab() === item.key"
              [class.border-brand-500]="tab() === item.key"
              [class.text-ink-500]="tab() !== item.key"
              (click)="tab.set($any(item.key))"
            >
              {{ item.label }}
            </button>
          }
        </div>

        @switch (tab()) {
          @case ('products') {
            @if (formOpen()) {
              <div class="mb-4 rounded-xl border border-brand-200 bg-white p-5">
                <div class="mb-4 flex items-center justify-between">
                  <h2 class="text-base font-bold text-ink-900">Add a product</h2>
                  <button type="button" class="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-100" (click)="formOpen.set(false)" aria-label="Close form">
                    <span class="material-icons text-[18px]">close</span>
                  </button>
                </div>

                <form class="grid gap-3 sm:grid-cols-2" (submit)="addProduct($event)">
                  <div class="sm:col-span-2">
                    <label class="label" for="pname">Product name</label>
                    <input id="pname" name="pname" class="input" placeholder="e.g. Alpine Pro Snowboard 155" [(ngModel)]="newName" required />
                  </div>
                  <div>
                    <label class="label" for="pprice">Price (USD)</label>
                    <input id="pprice" name="pprice" type="number" min="1" class="input" [(ngModel)]="newPrice" required />
                  </div>
                  <div>
                    <label class="label" for="pstock">Stock</label>
                    <input id="pstock" name="pstock" type="number" min="0" class="input" [(ngModel)]="newStock" required />
                  </div>
                  <div>
                    <label class="label" for="pcat">Category</label>
                    <select id="pcat" name="pcat" class="input" [(ngModel)]="newCategory">
                      @for (category of ['Boards', 'Boots', 'Gloves', 'Hats']; track category) {
                        <option [value]="category">{{ category }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="label" for="pimg">Photo</label>
                    <select id="pimg" name="pimg" class="input" [(ngModel)]="newImage">
                      @for (image of images; track image) {
                        <option [value]="image">{{ image.split('/').pop() }}</option>
                      }
                    </select>
                  </div>
                  <div class="sm:col-span-2">
                    <button type="submit" class="btn-primary w-full py-3">Publish product</button>
                  </div>
                </form>
              </div>
            }

            <div class="overflow-hidden rounded-xl border border-ink-100 bg-white">
              <table class="w-full text-left text-sm">
                <thead class="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
                  <tr>
                    <th class="px-4 py-3 font-semibold">Product</th>
                    <th class="hidden px-4 py-3 font-semibold sm:table-cell">Price</th>
                    <th class="hidden px-4 py-3 font-semibold sm:table-cell">Stock</th>
                    <th class="px-4 py-3 font-semibold">Status</th>
                    <th class="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (product of seller.products(); track product.id) {
                    <tr class="border-t border-ink-100">
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-3">
                          <img [src]="product.image" [alt]="product.name" class="h-10 w-10 rounded-lg object-cover" />
                          <div class="min-w-0">
                            <p class="truncate font-medium text-ink-900">{{ product.name }}</p>
                            <p class="text-xs text-ink-500">{{ product.category }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="hidden px-4 py-3 font-semibold text-ink-800 sm:table-cell">\${{ product.price.toFixed(2) }}</td>
                      <td class="hidden px-4 py-3 sm:table-cell">
                        <span [class.text-red-500]="product.stock === 0">{{ product.stock }}</span>
                      </td>
                      <td class="px-4 py-3">
                        <button
                          type="button"
                          class="chip"
                          [class.bg-emerald-50]="product.status === 'Active'"
                          [class.text-emerald-700]="product.status === 'Active'"
                          (click)="seller.toggleStatus(product.id)"
                        >
                          {{ product.status }}
                        </button>
                      </td>
                      <td class="px-4 py-3 text-right">
                        <button type="button" class="text-ink-400 transition hover:text-red-500" (click)="remove(product.id)" aria-label="Delete product">
                          <span class="material-icons text-[18px]">delete_outline</span>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @case ('orders') {
            @if (auth.orders().length === 0) {
              <div class="rounded-xl border border-dashed border-ink-200 bg-white py-16 text-center">
                <span class="material-icons text-[44px] text-ink-300">receipt_long</span>
                <p class="mt-3 text-sm font-semibold text-ink-800">No orders yet</p>
                <p class="mt-1 text-xs text-ink-500">Orders placed on this device appear here.</p>
              </div>
            } @else {
              <div class="space-y-2">
                @for (order of auth.orders(); track order.id) {
                  <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-100 bg-white p-4">
                    <div>
                      <p class="text-sm font-bold text-ink-900">{{ order.id }}</p>
                      <p class="text-xs text-ink-500">{{ shortDate(order.placedAt) }} · {{ order.items.length }} items</p>
                    </div>
                    <span class="chip bg-amber-50 text-amber-700">{{ order.status }}</span>
                    <p class="text-sm font-bold text-ink-900">\${{ order.total.toFixed(2) }}</p>
                  </div>
                }
              </div>
            }
          }

          @case ('settings') {
            <div class="max-w-xl rounded-xl border border-ink-100 bg-white p-5">
              <h2 class="text-base font-bold text-ink-900">Store details</h2>
              <div class="mt-4 space-y-3">
                <div>
                  <label class="label" for="sname">Store name</label>
                  <input id="sname" class="input" [value]="auth.user()?.store?.name" disabled />
                </div>
                <div>
                  <label class="label" for="sdesc">Store description</label>
                  <textarea id="sdesc" rows="3" class="input" placeholder="Tell buyers what you sell"></textarea>
                </div>
                <button type="button" class="btn-primary" (click)="saveSettings()">Save changes</button>
              </div>
            </div>
          }
        }
      </section>
    }
  `
})
export class SellerDashboardComponent {
  readonly auth = inject(AuthService);
  readonly seller = inject(SellerService);
  private toast = inject(ToastService);

  readonly tab = signal<'products' | 'orders' | 'settings'>('products');
  readonly formOpen = signal(false);

  readonly images = [
    '/images/products/sb-ang1.png',
    '/images/products/sb-ang2.png',
    '/images/products/boot-ang1.png',
    '/images/products/glove-code1.png',
    '/images/products/hat-core1.png'
  ];

  newName = '';
  newPrice = 100;
  newStock = 10;
  newCategory = 'Boards';
  newImage = this.images[0];

  readonly stats = computed(() => {
    const products = this.seller.products();
    const active = products.filter((product) => product.status === 'Active');
    const stockValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    return [
      { label: 'Products', value: products.length, hint: `${active.length} active`, icon: 'inventory_2' },
      { label: 'Stock value', value: `$${stockValue.toFixed(0)}`, hint: 'at current prices', icon: 'payments' },
      { label: 'Orders', value: this.auth.orders().length, hint: 'this device', icon: 'receipt_long' },
      { label: 'Rating', value: this.auth.user()?.store?.rating || 'New', hint: 'seller score', icon: 'star' }
    ];
  });

  openForm() {
    this.tab.set('products');
    this.formOpen.set(true);
  }

  addProduct(event: Event) {
    event.preventDefault();
    if (!this.newName.trim()) {
      this.toast.error('Enter a product name');
      return;
    }

    this.seller.add({
      name: this.newName.trim(),
      price: Number(this.newPrice),
      stock: Number(this.newStock),
      category: this.newCategory,
      image: this.newImage
    });

    this.toast.success('Product published');
    this.newName = '';
    this.newPrice = 100;
    this.newStock = 10;
    this.formOpen.set(false);
  }

  remove(id: number) {
    this.seller.remove(id);
    this.toast.info('Product removed');
  }

  saveSettings() {
    this.toast.success('Store settings saved');
  }

  shortDate(value: string): string {
    return value ? new Date(value).toLocaleDateString() : '';
  }
}
