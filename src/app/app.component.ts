import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdleTimeoutService } from './services/idle-timeout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'idle-timeout-ang17-noSSR';
  idleService = inject(IdleTimeoutService);
  private idleSubscription?: Subscription;

  ngOnInit() {
    this.idleSubscription = this.idleService.idleState.subscribe((isIdle) => {
      if (isIdle) {
        console.log('User is idle');
        window.alert('User is inactive');
      } else {
        console.log('User is active');
      }
    });
  }
  ngOnDestroy() {
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }
  }

  onUserAction() {
    this.idleService.resetTimer();
  }
}
