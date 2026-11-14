import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { Category, Product } from '../../core/models';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  query?: Record<string, string>;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private catalog = inject(CatalogService);
  private destroyRef = inject(DestroyRef);

  readonly categories = signal<Category[]>([]);
  readonly deals = signal<Product[]>([]);
  readonly trending = signal<Product[]>([]);
  readonly fresh = signal<Product[]>([]);
  readonly loading = signal(true);

  readonly slides: Slide[] = [
    {
      image: 'images/hero1.jpg',
      eyebrow: 'Winter season 2026',
      title: 'Gear up for the mountain',
      subtitle: 'Boards, boots and gloves from verified sellers — up to 30% off this week.',
      cta: 'Shop the collection',
      link: '/catalog'
    },
    {
      image: 'images/hero2.jpg',
      eyebrow: 'Flash deals',
      title: 'Prices that drop fast',
      subtitle: 'Limited stock, limited time. New deals unlocked every morning.',
      cta: 'See flash deals',
      link: '/catalog',
      query: { deals: 'true' }
    },
    {
      image: 'images/hero3.jpg',
      eyebrow: 'Become a seller',
      title: 'Open your store today',
      subtitle: 'Reach thousands of riders. Free store setup, zero listing fees for 30 days.',
      cta: 'Start selling',
      link: '/seller/register'
    }
  ];

  readonly activeSlide = signal(0);
  readonly countdown = signal({ hours: '00', minutes: '00', seconds: '00' });

  ngOnInit() {
    this.catalog.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.categories.set([])
    });

    this.catalog.getProducts({ deals: true, sort: 'discount', pageSize: 8 }).subscribe({
      next: (page) => this.deals.set(page.data),
      error: () => this.deals.set([])
    });

    this.catalog.getProducts({ sort: 'popular', pageSize: 8 }).subscribe({
      next: (page) => {
        this.trending.set(page.data);
        this.loading.set(false);
      },
      error: () => {
        this.trending.set([]);
        this.loading.set(false);
      }
    });

    this.catalog.getProducts({ sort: 'newest', pageSize: 4 }).subscribe({
      next: (page) => this.fresh.set(page.data),
      error: () => this.fresh.set([])
    });

    const slideTimer = setInterval(() => {
      this.activeSlide.set((this.activeSlide() + 1) % this.slides.length);
    }, 6000);

    const clockTimer = setInterval(() => this.tick(), 1000);
    this.tick();

    this.destroyRef.onDestroy(() => {
      clearInterval(slideTimer);
      clearInterval(clockTimer);
    });
  }

  goToSlide(index: number) {
    this.activeSlide.set(index);
  }

  private tick() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const diff = Math.max(0, end.getTime() - now.getTime());
    const hours = Math.floor(diff / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);
    this.countdown.set({
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    });
  }
}
