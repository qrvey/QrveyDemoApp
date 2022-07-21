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

  constructor(private user: UserService, private router: Router) {
    this.loggedUser = user.getUser();
    this.avatarURL = "url('" + this.user.avatarGenerator(this.loggedUser.name) + "')";
  }

  ngOnInit(): void {
  }

  logout() {
    this.user.removeUser();
    this.router.navigate(['/login']);
  }

}
