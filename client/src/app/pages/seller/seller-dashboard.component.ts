import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ProductPayload, SellerProductService } from '../../core/seller-product.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './seller-dashboard.component.html'
})
export class SellerDashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly catalog = inject(SellerProductService);
  private toast = inject(ToastService);

  readonly tab = signal<'products' | 'orders' | 'settings'>('products');
  readonly formOpen = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly confirmDelete = signal<number | null>(null);
  readonly saving = signal(false);
  readonly errors = signal<Record<string, string>>({});

  readonly images = [
    'images/products/sb-ang1.png',
    'images/products/sb-ang2.png',
    'images/products/sb-core1.png',
    'images/products/boot-ang1.png',
    'images/products/boot-purple1.png',
    'images/products/glove-code1.png',
    'images/products/hat-core1.png'
  ];

  readonly categories = ['Boards', 'Boots', 'Gloves', 'Hats'];

  form: ProductPayload = this.emptyForm();

  readonly stats = computed(() => {
    const products = this.catalog.products();
    const stockValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    const outOfStock = products.filter((product) => product.stock === 0).length;
    const revenue = this.catalog.orders().reduce((sum, order) => sum + order.sellerTotal, 0);
    return [
      { label: 'Products', value: products.length, hint: `${outOfStock} out of stock`, icon: 'inventory_2' },
      { label: 'Orders', value: this.catalog.orders().length, hint: 'in your store', icon: 'receipt_long' },
      { label: 'Revenue', value: `$${revenue.toFixed(0)}`, hint: 'from your products', icon: 'payments' },
      { label: 'Stock value', value: `$${stockValue.toFixed(0)}`, hint: 'at current prices', icon: 'inventory' }
    ];
  });

  ngOnInit() {
    if (this.auth.isSeller()) {
      this.catalog.load();
      this.catalog.loadOrders();
    }
  }

  openCreate() {
    this.tab.set('products');
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.errors.set({});
    this.formOpen.set(true);
  }

  openEdit(product: { id: number; name: string; description: string; price: number; stock: number; category: string; image: string }) {
    this.tab.set('products');
    this.editingId.set(product.id);
    this.form = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      pictureUrl: product.image
    };
    this.errors.set({});
    this.formOpen.set(true);
  }

  closeForm() {
    this.formOpen.set(false);
    this.editingId.set(null);
    this.errors.set({});
  }

  submit() {
    const errors = this.validate();
    this.errors.set(errors);
    if (Object.keys(errors).length > 0) {
      this.toast.error('Please fix the highlighted fields');
      return;
    }

    this.saving.set(true);
    const id = this.editingId();
    const request = id ? this.catalog.update(id, this.form) : this.catalog.create(this.form);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(id ? 'Product updated' : 'Product published');
        this.closeForm();
      },
      error: (error) => {
        this.saving.set(false);
        const serverErrors = error?.error?.errors;
        if (serverErrors) this.errors.set(serverErrors);
        this.toast.error(error?.error?.title ?? 'Could not save the product');
      }
    });
  }

  askDelete(id: number) {
    this.confirmDelete.set(id);
  }

  cancelDelete() {
    this.confirmDelete.set(null);
  }

  remove(id: number) {
    this.catalog.remove(id).subscribe({
      next: () => {
        this.confirmDelete.set(null);
        this.toast.info('Product deleted');
      },
      error: (error) => {
        this.confirmDelete.set(null);
        this.toast.error(error?.error?.title ?? 'Could not delete the product');
      }
    });
  }

  saveSettings() {
    this.toast.success('Store settings saved');
  }

  shortDate(value: string): string {
    return value ? new Date(value).toLocaleDateString() : '';
  }

  private validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this.form.name.trim()) errors['name'] = 'Product name is required';
    else if (this.form.name.trim().length < 3) errors['name'] = 'Use at least 3 characters';
    if (!Number.isFinite(this.form.price) || this.form.price <= 0) errors['price'] = 'Enter a price above 0';
    if (!Number.isFinite(this.form.stock) || this.form.stock < 0) errors['stock'] = 'Stock cannot be negative';
    if (!this.form.category) errors['category'] = 'Choose a category';
    if (!this.form.pictureUrl) errors['pictureUrl'] = 'Choose a photo';
    return errors;
  }

  private emptyForm(): ProductPayload {
    return {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'Boards',
      pictureUrl: this.images[0]
    };
  }
}
