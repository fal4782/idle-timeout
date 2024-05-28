// idle-timeout.service.ts

import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription, interval } from 'rxjs';
import { throttle } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IdleTimeoutService {
  private idleSubject = new Subject<boolean>(); //subject to emit idle state changes (true/false)
  private timeout = 6; //duration after which use is considered idle
  private lastActivity?: Date; //timestamp of last user activity
  private idleCheckinInterval = 10; //freq at which service checks for idle state (in seconds)
  public idleSubscription?: Subscription; // holds the subscription object returned when we subscribe to 'idleState' observable -> subscription to the interval that checks for idle state changes

  constructor() {
    this.resetTimer();
    this.startWatching();
  }

  get idleState(): Observable<boolean> {
    return this.idleSubject.asObservable();
  }

  private startWatching() {
    //sets up an interval to check for idle state changes
    this.idleSubscription = interval(this.idleCheckinInterval * 1000) //emits a value after every checkInInterval
      .pipe(throttle(() => interval(1000))) //throttle ensures that the inner observable ( `interval(1000)` ) emits only once every second
      .subscribe(() => {
        const now = new Date();

        if (
          //compare the current time with the last activity time
          now.getTime() - this.lastActivity?.getTime()! >
          this.timeout * 1000
        ) {
          //emit the idle state if the timeout threshold is exceeded
          this.idleSubject.next(true);
        }
      });
  }

  resetTimer() {
    this.lastActivity = new Date();
    this.idleSubject.next(false); //notify subscribers that user is no longer active
  }

  stopWatching() {
    // unsubscribe from the idle check interval and stop monitoring the idle state changes
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }
  }
}
