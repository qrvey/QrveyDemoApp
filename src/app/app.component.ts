import { Component } from '@angular/core';
import { UserService } from './services/user/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor( private user: UserService,  private router: Router) {
    if(!this.user.getUser()) {
      this.router.navigate(['login']);
    }
  }
}
