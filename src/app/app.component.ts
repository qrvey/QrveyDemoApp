import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user/user.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  hideBar: boolean = false;
  currentRoute: string = '';

  constructor(private user: UserService, private router: Router) {
    if (!this.user.getUser()) {
      this.router.navigate(['login']);
    }else{
      let user = this.user.getUser();
      if(user.type == "viewer"){
        this.router.navigate(['shared-reports']);
      }
    }

    router.events.subscribe((event: Event) => {
      // see also 
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        if (event.url.includes('admin') || event.url.includes('datasets')) {
          this.hideBar = true;
        }else{
          this.hideBar = false;
        }
      }

    });
  }

  ngOnInit(): void {
  }


  loggedUser() {
    return this.user.getUser();
  }
}
