import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
<<<<<<< Updated upstream
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()), // Enable `fetch` for HttpClient
    ...appConfig.providers,         // Include other providers from appConfig
  ],
}).catch((err) => console.error(err));
=======
import { routes } from './app/app.routes';


bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
});
>>>>>>> Stashed changes
