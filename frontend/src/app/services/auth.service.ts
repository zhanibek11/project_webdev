import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser$ = new BehaviorSubject<any>(null);

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
