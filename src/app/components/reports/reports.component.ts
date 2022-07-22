import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  loggedUser: any = null;
  loading: boolean = true;
  loading_widget: boolean = false;
  reports: any[] = [];

  constructor(private user: UserService, private router: Router, private backend: BackendService) { 
    this.loggedUser = user.getUser();
  }

  ngOnInit(): void {
    this.getReports();
  }

  getReports(){
    this.backend.getReports({ userid: this.loggedUser.qrvey_info.userid, appid: this.loggedUser.qrvey_info.appid, }).subscribe((response: any) => {
      this.reports = response.Items;
      this.loading = false;
    },
      (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  loadPageView(report:any){
    if(this.loading_widget) return;
    this.loading_widget = true;
    const widgetContainer: any = document.querySelector(".widget-wrapper");
    widgetContainer.innerHTML = '';
    const body = {
      userid: this.loggedUser.qrvey_info.userid,
      appid:  this.loggedUser.qrvey_info.appid,
      pageid: report.pageid
    }
    this.backend.generateJwt(body).subscribe((response: any) => {
      this.loading_widget = false;
      (window as any).pageViewConfig = {
        qv_token: response.token,
        domain: environment.qrvey_domain
      };
      let page_view_tag = document.createElement("qrvey-end-user");
      page_view_tag.setAttribute("settings", "pageViewConfig");
      widgetContainer.append(page_view_tag);
    },
      (error: any) => {
        console.log(error);
        this.loading_widget = false;
      }
    );
  }

}
