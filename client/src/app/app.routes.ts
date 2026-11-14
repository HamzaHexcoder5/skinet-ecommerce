import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ProductComponent } from './pages/product/product.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { SellerDashboardComponent } from './pages/seller/seller-dashboard.component';
import { SellerRegisterComponent } from './pages/seller/seller-register.component';
import { StoreComponent } from './pages/store/store.component';
import { PlaceholderComponent } from './pages/placeholder.component';
import { authGuard, sellerGuard } from './core/guards';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Skinet | Online Shopping for Snow Sports Gear' },
  { path: 'catalog', component: CatalogComponent, title: 'Shop | Skinet' },
  { path: 'product/:id', component: ProductComponent, title: 'Product | Skinet' },
  { path: 'store/:id', component: StoreComponent, title: 'Store | Skinet' },
  { path: 'cart', component: CartComponent, title: 'Shopping cart | Skinet' },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard], title: 'Checkout | Skinet' },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard], title: 'My orders | Skinet' },
  { path: 'wishlist', component: WishlistComponent, title: 'Wishlist | Skinet' },
  { path: 'login', component: LoginComponent, title: 'Sign in | Skinet' },
  { path: 'register', component: RegisterComponent, title: 'Create account | Skinet' },
  { path: 'seller', component: SellerDashboardComponent, canActivate: [sellerGuard], title: 'Seller center | Skinet' },
  { path: 'seller/register', component: SellerRegisterComponent, title: 'Become a seller | Skinet' },
  { path: '**', component: PlaceholderComponent, data: { title: 'Page not found' }, title: 'Not found | Skinet' }
];
