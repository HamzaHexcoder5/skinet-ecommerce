export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  discountPercent: number;
  pictureUrl: string;
  images: string[];
  type: string;
  brand: string;
  category: string;
  quantityInStock: number;
  rating: number;
  ratingCount: number;
  sold: number;
  sellerId: number;
  sellerName: string;
  freeShipping: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  tagline: string;
  count: number;
}

export interface Seller {
  id: number;
  name: string;
  slug: string;
  rating: number;
  followers: number;
  since: number;
  productCount?: number;
}

export interface Pagination<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  totalPages: number;
  data: T[];
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  brand: string;
  sellerName: string;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  coupon: string | null;
}

export interface Store {
  name: string;
  slug: string;
  rating: number;
  products: number;
  joined: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'seller';
  store: Store | null;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  pictureUrl: string;
}

export interface Order {
  id: string;
  placedAt: string;
  status: string;
  paymentMethod: string;
  address: Address | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface Address {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  notes?: string;
}

export interface CatalogQuery {
  search?: string;
  categories?: string[];
  brands?: string[];
  types?: string[];
  sort?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRating?: number | null;
  deals?: boolean;
  pageIndex?: number;
  pageSize?: number;
}
