import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  loggedUser: any = null;

  constructor(private user: UserService, private router: Router) { 
    this.loggedUser = user.getUser();
    console.log(this.loggedUser)
  }

  ngOnInit(): void {
  }

  logout() {
    this.user.removeUser();
    this.router.navigate(['/login']);
  }

}
