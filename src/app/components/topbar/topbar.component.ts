import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  @Input() noSecondBar: any;
  @Input() selectedRoute: any;

  loggedUser: any = null;
  avatarURL: string = '';
  theme: string = '';

  constructor(private user: UserService, private router: Router) {
    this.loggedUser = user.getUser();
    this.avatarURL = "url('" + this.user.avatarGenerator(this.loggedUser.name) + "')";
    this.theme = this.loggedUser.organization.theme;
  }

  ngOnInit(): void {
    let logo: HTMLElement = (document as any).querySelector("#logo-place");
    logo.setAttribute("style", `background-image:url(./assets/${this.loggedUser.organization.logo}); width: ${this.loggedUser.organization.logowidth}px`);
  }

  logout() {
    this.user.removeUser();
    this.router.navigate(['/login']);
  }

}
