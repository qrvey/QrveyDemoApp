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
  selected_report: any = null;
  view_mode: string = 'view';
  widgetContainer: any;


  constructor(private user: UserService, private router: Router, private backend: BackendService) {
    this.loggedUser = this.user.getUser();
  }

  ngOnInit(): void {
    this.getReports();
  }

  getReports() {
    this.backend.getReports({ userid: this.loggedUser.qrvey_info.userid, appid: this.loggedUser.qrvey_info.appid }).subscribe((response: any) => {
      this.reports = response.Items;
      this.loading = false;
    },
      (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  loadingOn(){
    this.loading_widget = true;
    this.widgetContainer = document.querySelector(".widget-wrapper");
    this.widgetContainer.innerHTML = '';
  }

  loadPageWidget(report: any, builder?: boolean) {
    if (this.loading_widget && report.sidebar) return;
    this.loadingOn();
    this.selected_report = report;
    delete this.selected_report.sidebar;
    if (this.view_mode == 'edit') {
      builder = true;
    }

    if (!report.system_user_id && this.view_mode == 'edit') {
      this.view_mode = 'view';
      builder = false;
    }


    const dbody = {
      userid: this.loggedUser.qrvey_info.userid,
      appid: this.loggedUser.qrvey_info.appid,
      datasetname: "Main Mysql - orders - View"
    }


    this.backend.datasetLookup(dbody).subscribe((res: any) => {

      let permissions = [
        {
          "dataset_id": res.Items[0].datasetId,
          "record_permissions": [
            {
              "security_name": "customer_number",
              "values": [
                this.loggedUser.organization.id
              ]
            }
          ]
        }
      ];

      let asset_permissions = {};
      if (builder) {
        asset_permissions = {
          pages: {
            page_ids: [
              report.pageid
            ]
          }
        }
      }

      const jbody = {
        userid: this.loggedUser.qrvey_info.userid,
        appid: this.loggedUser.qrvey_info.appid,
        pageid: report.pageid,
        permissions,
        asset_permissions
      }

      this.backend.generateJwt(jbody).subscribe((response: any) => {
        this.loading_widget = false;
        (window as any).qrveyPageConfig = {
          qv_token: response.token,
          domain: environment.qrvey_domain
        };
        let page_view_tag = !builder ? document.createElement("qrvey-end-user") : document.createElement("qrvey-builders");
        page_view_tag.setAttribute("settings", "qrveyPageConfig");
        this.widgetContainer.append(page_view_tag);
        if (builder) {
          (window as any).runEndUser(true /* True if it's pageBuilder, False if it's pageView widget */, true /* False if you want to set your on CSS, True if you want for the script to apply a default pageBuilder Limited view */);
        }
      },
        (error: any) => {
          console.log(error);
          this.loading_widget = false;
        }
      );


    },
      (error: any) => {
        console.log(error);
        this.loading_widget = false;
      }
    )
  }

  updatePageStatus(updates:any, callback:any) {
    this.loadingOn();

    this.backend.getReport({ userid: this.loggedUser.qrvey_info.userid, appid: this.loggedUser.qrvey_info.appid, pageid: this.selected_report.pageid }).subscribe((response: any) => {

      let report_model = {...this.selected_report, ...updates};

      report_model.selected = false;

      const update_body = { 
        userid: this.loggedUser.qrvey_info.userid, 
        appid: this.loggedUser.qrvey_info.appid, 
        pageid: this.selected_report.pageid,
        qbody: report_model
      };

      this.backend.updateReport(update_body).subscribe((response: any) => {
        this.loading = false;
        callback();
      },
        (error: any) => {
          console.log(error);
          this.loading = false;
        }
      );

    },
      (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  async actionClicked(m: string) {
    if (this.view_mode == m) return;
    this.view_mode = m;
    if (m == 'view') {
      this.updatePageStatus({editing:false, published: true}, () => this.loadPageWidget(this.selected_report));
    } else {
      this.updatePageStatus({editing:true}, () => this.loadPageWidget(this.selected_report, true));
    }
  }

}
