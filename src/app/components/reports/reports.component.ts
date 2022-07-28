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
  share_report_page: boolean = false;
  new_report_modal: boolean = false;
  delete_report_modal: boolean = false;
  loading_general_action: boolean = false;
  confirmation_modal_text: any = {
    title: "Delete Report",
    message: "",
    action_id: null,
    action_index: null
  }

  constructor(private user: UserService, private router: Router, private backend: BackendService) {
    this.loggedUser = this.user.getUser();

    this.router.events.subscribe((event: Event) => {
      // see also 
      if (event instanceof NavigationEnd) {
        if (event.url.includes('shared-reports')) {
          this.share_report_page = true;
        } else {
          this.share_report_page = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.getReports();
  }

  getReports() {
    this.backend.getReports({ userid: this.loggedUser.qrvey_info.userid, appid: this.loggedUser.qrvey_info.appid, getshared: this.share_report_page }).subscribe({
      next: (response: any) => {
        this.reports = response.Items;
      },
      error: (e: any) => {
        console.log(e);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadingOn(hideHTML: boolean = true) {
    this.loading_widget = true;
    if (hideHTML) {
      this.widgetContainer = document.querySelector(".widget-wrapper");
      this.widgetContainer.innerHTML = '';
    }
  }

  getDatasetRLS(body: any, callback: any) {
    let permissions: any = [];
    this.backend.datasetLookup(body).subscribe({
      next: (response: any) => {
        permissions = [
          {
            "dataset_id": response.Items[0].datasetId,
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
      },
      error: (e: any) => {
        console.log(e);
        this.loading = false;
      },
      complete: () => {
        callback(permissions);
      }
    })
  }

  getJWT(body: any, callback: any) {
    let token: any = null;
    this.backend.generateJwt(body).subscribe({
      next: (response: any) => {
        token = response.token;
      },
      error: (e: any) => {
        console.log(e);
        this.loading_widget = false;
      },
      complete: () => {
        callback(token);
      }
    })
  }

  buildQrveyPage(token: any, builder: boolean) {
    this.loading_widget = false;
    (window as any).qrveyPageConfig = {
      qv_token: token,
      domain: environment.qrvey_domain
    };
    let page_view_tag = !builder ? document.createElement("qrvey-end-user") : document.createElement("qrvey-builders");
    page_view_tag.setAttribute("settings", "qrveyPageConfig");
    this.widgetContainer.append(page_view_tag);
    if (builder) {
      (window as any).runEndUser(true /* True if it's pageBuilder, False if it's pageView widget */, true /* False if you want to set your on CSS, True if you want for the script to apply a default pageBuilder Limited view */);
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
    this.getDatasetRLS(dbody, (dresponse: any) => {
      let permissions = dresponse;
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
      const jwtbody = {
        userid: this.loggedUser.qrvey_info.userid,
        appid: this.loggedUser.qrvey_info.appid,
        pageid: report.pageid,
        permissions,
        asset_permissions
      }
      this.getJWT(jwtbody, (jwtresponse: any) => {
        this.buildQrveyPage(jwtresponse, builder as boolean);
      })
    })
  }

  getReportAndMerge(body: any, updates: any, callback: any) {
    let report_model: any;
    this.backend.getReport(body).subscribe({
      next: (response) => {
        report_model = { ...response, ...updates };
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        callback(report_model);
      }
    });
  }

  updateReport(body: any, callback: any) {
    this.backend.updateReport(body).subscribe({
      next: (response) => {
        this.selected_report = { ...response, selected: true };
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        callback();
      }
    });
  }

  compareReporVersions(body: any, callback: any) {
    this.backend.compareReport(body).subscribe({
      error: (e) => {
        console.log(e)
      },
      complete: () => {
        callback();
      }
    });
  }

  updatePageStatus(updates: any, hideHTML: boolean, callback: any) {
    this.loadingOn(hideHTML);

    const rmbody = {
      userid: this.loggedUser.qrvey_info.userid,
      appid: this.loggedUser.qrvey_info.appid,
      pageid: this.selected_report.pageid
    };

    this.getReportAndMerge(rmbody, updates, (rmresponse: any) => {
      const updatebody = {
        userid: this.loggedUser.qrvey_info.userid,
        appid: this.loggedUser.qrvey_info.appid,
        pageid: this.selected_report.pageid,
        qbody: rmresponse
      };

      this.updateReport(updatebody, () => {
        const comparebody = {
          userid: this.loggedUser.qrvey_info.userid,
          appid: this.loggedUser.qrvey_info.appid,
          pageid: this.selected_report.pageid,
          qbody: {
            version: "LATEST"
          }
        };
        this.compareReporVersions(comparebody, () => callback())
      })
    })
  }

  shareReport(share: any) {
    this.updatePageStatus({ shared: share }, false, () => {
      this.loading_widget = false;
    })
  }

  actionClicked(m: string) {
    if (this.view_mode == m) return;
    this.view_mode = m;
    let updates: any;
    if (m == 'view') {
      updates = { editing: false, published: true, updateTo: "Published", forceUpdate: true, selected: false };
      this.updatePageStatus(updates, true, () => this.loadPageWidget(this.selected_report));
    } else {
      updates = { editing: true };
      this.updatePageStatus(updates, true, () => this.loadPageWidget(this.selected_report, true));
    }
  }

  newReportModal() {
    this.new_report_modal = !this.new_report_modal;
  }

  newReportAdded(report: any) {
    this.getReports();
    this.view_mode = this.view_mode == "edit" ? "view" : "edit";
    this.selected_report = report;
    this.actionClicked(this.view_mode == "edit" ? "view" : "edit");
  }

  reportOption(detail: any) {
    if (this.loading_general_action) return;
    switch (detail.option) {
      case 'delete':
        this.delete_report_modal = true;
        this.confirmation_modal_text = {
          title: "Delete Report",
          message: `This cannot be undone. Are you sure you want to delete report "${detail.name}"?`,
          action_id: detail.pageid,
          action_index: detail.index
        };
        break;

      default:
        break;
    }
  }

  closeDeleteReportModal() {
    this.delete_report_modal = false;
    this.confirmation_modal_text = {
      title: "Delete Report",
      message: "",
      action_id: null,
      action_index: null
    }
  }

  deleteSelectedReport() {
    if (this.loading_general_action) return;
    this.loading_general_action = true;
    const deletereportbody = {
      userid: this.loggedUser.qrvey_info.userid,
      appid: this.loggedUser.qrvey_info.appid,
      pageid: this.confirmation_modal_text.action_id
    }
    let no_error = false;
    this.backend.deleteReport(deletereportbody).subscribe({
      next: (response: any) => {
        no_error = true
      },
      error: (e: any) => {
        console.log(e)
      },
      complete: () => {
        this.loading_general_action = false;
        if(no_error){
          this.deleteReportArray(this.confirmation_modal_text.action_index);
        }
      }
    })
  }

  deleteReportArray(index: number){
    let new_reports = [...this.reports];
    new_reports.splice(index, 1);
    this.reports = new_reports;
    if(this.selected_report.pageid == this.confirmation_modal_text.action_id){
      this.widgetContainer.innerHTML = '';
      this.selected_report = null;
    }
    this.closeDeleteReportModal();
  }

}
