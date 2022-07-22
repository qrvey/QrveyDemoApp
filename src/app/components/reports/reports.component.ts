import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  loggedUser: any = null;
  loading: boolean = true;
  reports: any[] = [];

  constructor(private user: UserService, private router: Router, private backend: BackendService) { 
    this.loggedUser = user.getUser();
  }

  ngOnInit(): void {
    this.getReports();
  }

  getReports(){
    this.backend.getReports({ userid: this.loggedUser.qrvey_info.userid, appid: this.loggedUser.qrvey_info.appid, }).subscribe((response: any) => {
      console.log(response);
      this.reports = response.Items;
      this.loading = false;
    },
      (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

}
