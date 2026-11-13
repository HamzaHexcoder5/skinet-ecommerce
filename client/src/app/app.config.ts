import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { InitService } from './core/services/init.service';
import { lastValueFrom } from 'rxjs';
import { authInterceptor } from './core/interceptors/auth.interceptor';

function initializeApp(initService: InitService) {
  return () => lastValueFrom(initService.init())
    .catch(() => {
      // The app must still boot when the API is unreachable, otherwise the
      // splash screen is removed and nothing is rendered.
    })
    .finally(() => {
      const splash = document.getElementById('initial-splash');
      if (splash) {
        splash.remove();
      }
    })
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([
      errorInterceptor, 
      loadingInterceptor,
      authInterceptor
    ])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [InitService]
    }
  ]
};
