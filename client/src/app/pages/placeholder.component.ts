import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page py-20 text-center">
      <span class="material-icons text-[56px] text-brand-400">construction</span>
      <h1 class="mt-4 text-2xl font-bold text-ink-900">{{ title }}</h1>
      <p class="mt-2 text-sm text-ink-500">This page is being rebuilt. Check back shortly.</p>
      <a routerLink="/" class="btn-primary mt-6">Back to home</a>
    </section>
  `
})
export class PlaceholderComponent {
  title = inject(ActivatedRoute).snapshot.data['title'] ?? 'Coming soon';
}
