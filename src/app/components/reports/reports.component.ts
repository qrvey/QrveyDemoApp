import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  loggedUser: any = null;

  constructor(private user: UserService, private router: Router) { 
    this.loggedUser = user.getUser();
  }

  ngOnInit(): void {
  }

}
