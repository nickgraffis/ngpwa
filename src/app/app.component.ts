import { Component, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'pwa';

  version;

  public sw = inject(SwUpdate);
  ngOnInit() {
    console.log('sw', this.sw.isEnabled);
    if (this.sw.isEnabled) {
      this.sw.versionUpdates.subscribe((event) => {
        //@ts-ignore
        this.version = event.version.hash;
        console.log('current version is', event);
        console.log('available version is', event);
        if (
          event.type !== 'NO_NEW_VERSION_DETECTED' &&
          confirm('New version available. Load New Version?')
        ) {
          this.sw.activateUpdate().then(() => location.reload());
        }
      });

      setInterval(() => {
        this.sw.checkForUpdate().then((newUpdate) => {
          if (!newUpdate) console.log('no new update');
        });
      }, 1000);
    } else {
      console.log('sw', this.sw.isEnabled);
    }
  }
}
