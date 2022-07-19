import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  constructor(private user: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(){
    this.user.removeUser();
    this.router.navigate(['/login']);
  }

}
