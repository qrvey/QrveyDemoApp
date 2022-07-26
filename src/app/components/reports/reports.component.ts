import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
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
  share_report_page:boolean = false;

  constructor(private user: UserService, private router: Router, private backend: BackendService) {
    this.loggedUser = this.user.getUser();

    router.events.subscribe((event: Event) => {
      // see also 
      if (event instanceof NavigationEnd) {
        if (event.url.includes('shared-reports')) {
          this.share_report_page = true;
        }else{
          this.share_report_page = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.getReports();
  }

  getReports() {
    this.backend.getReports({ userid: this.loggedUser.qrvey_info.userid, appid: this.loggedUser.qrvey_info.appid, getshared: this.share_report_page }).subscribe((response: any) => {
      this.reports = response.Items;
      this.loading = false;
    },
      (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  loadingOn(hideHTML:boolean = true){
    this.loading_widget = true;
    if(hideHTML){
      this.widgetContainer = document.querySelector(".widget-wrapper");
      this.widgetContainer.innerHTML = '';
    }
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

  updatePageStatus(updates:any, hideHTML:boolean, callback:any) {
    this.loadingOn(hideHTML);

    this.backend.getReport({ userid: this.loggedUser.qrvey_info.userid, appid: this.loggedUser.qrvey_info.appid, pageid: this.selected_report.pageid }).subscribe((response: any) => {

      let report_model = {...response, ...updates};

      report_model.selected = false;

      const update_body = { 
        userid: this.loggedUser.qrvey_info.userid, 
        appid: this.loggedUser.qrvey_info.appid, 
        pageid: this.selected_report.pageid,
        qbody: report_model
      };

      this.backend.updateReport(update_body).subscribe((response: any) => {

        this.selected_report = response;

        const compare_body = { 
          userid: this.loggedUser.qrvey_info.userid, 
          appid: this.loggedUser.qrvey_info.appid, 
          pageid: this.selected_report.pageid,
          qbody: {
            version: "LATEST"
          }
        };

        this.backend.compareReport(compare_body).subscribe((response: any) => {
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

    },
      (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  shareReport(share:any){
    this.updatePageStatus({shared:share},false,()=>{
      this.loading_widget = false;
    })
  }

  actionClicked(m: string) {
    if (this.view_mode == m) return;
    this.view_mode = m;
    if (m == 'view') {
      this.updatePageStatus({editing:false, published: true, updateTo: "Published", forceUpdate: true}, true, () => this.loadPageWidget(this.selected_report));
    } else {
      this.updatePageStatus({editing:true}, true, () => this.loadPageWidget(this.selected_report, true));
    }
  }

}
