import { Component, OnInit } from '@angular/core';
import { ShellComponent } from './layout/shell/shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  template: '<app-shell />'
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // The splash lives in index.html and is removed once the shell has rendered.
    setTimeout(() => document.getElementById('initial-splash')?.remove(), 120);
  }
}
