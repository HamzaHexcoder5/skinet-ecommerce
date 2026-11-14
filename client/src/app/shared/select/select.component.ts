import { Component, computed, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
  icon?: string;
}

type Variant = 'field' | 'bare' | 'search';

/**
 * Accessible replacement for the native <select> so every dropdown in the
 * storefront matches the rest of the design instead of the browser default.
 */
@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './select.component.html',
  host: { class: 'block' }
})
export class SelectComponent {
  readonly options = input.required<SelectOption[]>();
  readonly value = input<string>('');
  readonly placeholder = input('Select');
  readonly ariaLabel = input('Select an option');
  readonly variant = input<Variant>('field');
  readonly valueChange = output<string>();

  readonly open = signal(false);
  readonly activeIndex = signal(-1);

  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly current = computed(() => this.options().find((option) => option.value === this.value()));

  readonly triggerClass = computed(() => {
    const base =
      'flex w-full items-center justify-between gap-2 rounded-lg text-left outline-none transition focus-visible:ring-2 focus-visible:ring-brand-100';

    switch (this.variant()) {
      case 'bare':
        return `${base} h-9 bg-transparent px-2 text-sm font-semibold text-ink-800 hover:bg-ink-50`;
      case 'search':
        return `${base} h-full rounded-none rounded-l-[6px] border-r border-ink-200 bg-ink-50 px-3 text-xs font-semibold text-ink-600 hover:bg-ink-100`;
      default:
        return `${base} h-11 border border-ink-200 bg-white px-3.5 text-sm text-ink-800 hover:border-brand-300`;
    }
  });

  toggle() {
    this.open.set(!this.open());
    this.activeIndex.set(this.selectedIndex());
  }

  choose(option: SelectOption) {
    this.valueChange.emit(option.value);
    this.open.set(false);
    this.activeIndex.set(-1);
  }

  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!this.open()) {
          this.open.set(true);
          this.activeIndex.set(this.selectedIndex());
          return;
        }
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const count = this.options().length;
        const next = (this.activeIndex() + step + count) % count;
        this.activeIndex.set(next);
        return;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (!this.open()) {
          this.open.set(true);
          this.activeIndex.set(this.selectedIndex());
          return;
        }
        const option = this.options()[this.activeIndex()];
        if (option) this.choose(option);
        return;
      }
      case 'Escape':
        this.open.set(false);
        return;
      case 'Tab':
        this.open.set(false);
        return;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  private selectedIndex(): number {
    return Math.max(
      0,
      this.options().findIndex((option) => option.value === this.value())
    );
  }
}
