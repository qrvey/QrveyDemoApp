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
  tenants: any[] = [];
  plans: any[] = [];
  selected_report: any = null;
  view_mode: string = 'view';
  widgetContainer: any;
  share_report_page: boolean = false;
  new_report_modal: boolean = false;
  delete_report_modal: boolean = false;
  loading_general_action: boolean = false;
  deleting_report: boolean = false;
  publish_report_modal: boolean = false;
  publishing_report: boolean = false;
  confirmation_modal_text: any = {
    title: "Delete Report",
    message: "",
    action_id: null,
    action_index: null,
    confirm: "Confirm"
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

    if (this.loggedUser.type == 'admin') {
      this.getPlans();
    }
  }

  ngOnInit(): void {
    this.getReports();
  }

  getReports() {
    this.backend.getReports({ userid: this.loggedUser.qrvey_info.userid, appid: this.loggedUser.qrvey_info.appid, getshared: this.share_report_page, system_user_id: this.loggedUser.email }).subscribe({
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
    (window as any).customEUStyle = '';
    let page_view_tag = !builder ? document.createElement("qrvey-end-user") : document.createElement("qrvey-builders");
    page_view_tag.setAttribute("settings", "qrveyPageConfig");
    this.widgetContainer.append(page_view_tag);
  }

  comparePublishedVersions(report: any){
    // Here we doublecheck if the version that was edited is different from the version that is published
    // If not, then we update the published version
    if (this.loading_widget && report.sidebar) return;
    this.loadingOn();
    this.selected_report = report;
    delete this.selected_report.sidebar;
    const comparebody = {
      userid: this.loggedUser.qrvey_info.userid,
      appid: this.loggedUser.qrvey_info.appid,
      pageid: this.selected_report.pageid,
      qbody: {
        version: "LATEST"
      }
    };
    this.compareReporVersions(comparebody, (r:any) => {
      if(r.isEquivalent){
        // If the versions are equal, the widget gets embedded
        this.loadPageWidget(report);
      }else{
        // If not, then using the widget actions component, we updated the published version before embedding
        this.actionClicked("view", true, true);
      }
    })
  }

  async loadPageWidget(report: any, builder?: boolean) {
    if (this.view_mode == 'edit') {
      builder = true;
    }
    if (!report.system_user_id && this.loggedUser.type != 'admin' && this.view_mode == 'edit') {
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
      let clientid = null;
      if (builder) {
        asset_permissions = {
          pages: {
            page_ids: [
              report.pageid
            ]
          }
        }
      }

      if (this.loggedUser.type == 'viewer') clientid = this.loggedUser.email;

      const MAIN_COLOR = this.loggedUser.organization.hexcolor;
      const jwtbody = {
        userid: this.loggedUser.qrvey_info.userid,
        appid: this.loggedUser.qrvey_info.appid,
        pageid: report.pageid,
        permissions,
        asset_permissions,
        clientid,
        styles: {
          main_color: MAIN_COLOR,
          pageView: {
            canvasButtonBackgroundColor: MAIN_COLOR,
            canvasDatepickerFontColor: MAIN_COLOR,
            canvasDatepickerIconSelectorsColor: MAIN_COLOR,
            canvasValuelistFontColor: MAIN_COLOR,
            canvasValuelistIconSelectorsColor: MAIN_COLOR,
            navigationBackgroundColor: MAIN_COLOR,
            filterIconBackgroundColor: MAIN_COLOR,
            pageViewButtonBackgroundColor: MAIN_COLOR,
            tabsBackgroundColor: MAIN_COLOR
          },
          panel: {
            mainColor: MAIN_COLOR
          }
        },
        featurePermission: {
          navigation: {
            hideNavigationTab: true,
          },
          userManagement: {
            hideUserManagementTab: true
          },
          pagesAndApplication: {
            hidePublishAppButton: true,
            hidePublishPageButton: true,
            hideCopyPageLink: true,
            hideLaunchButton: true,
            hideCreateManagePages: true,
            hidePageStatus: true,
            hidePagesBar: true
          }
        }
      }
      this.widgetContainer.style.cssText = `--qv-main-color: ${MAIN_COLOR};  --qv-tab-bar-color: rgb(244, 246, 248); --qv-tab-font-color: #585858; --qv-secondary-color: #585858 !important;`;
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
        if (!body.no_select) {
          this.selected_report = { ...response, selected: true };
        }
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
    let r:any;
    this.backend.compareReport(body).subscribe({
      next: (response) => {
        r = response;
      },
      error: (e) => {
        console.log(e)
      },
      complete: () => {
        callback(r);
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
        callback();
      })
    })
  }

  shareReport(share: any) {
    this.updatePageStatus({ shared: share }, false, () => {
      this.loading_widget = false;
    })
  }

  actionClicked(m: string, from_new?: boolean, checked_version?: boolean) {
    if (this.view_mode == m && !from_new) return;
    this.view_mode = m;
    let updates: any;
    if (m == 'view') {
      updates = { editing: false, published: true, updateTo: "Published", forceUpdate: true, selected: false };
      this.updatePageStatus(updates, true, () => {
        if(from_new && !checked_version){
          this.actionClicked("edit", true);
        }else{
          this.loadPageWidget(this.selected_report)
        }
      });
    } else {
      updates = { editing: true, published: true, updateTo: "Published", forceUpdate: true };
      this.updatePageStatus(updates, true, () => this.loadPageWidget(this.selected_report, true));
    }
  }

  newReportModal() {
    this.new_report_modal = !this.new_report_modal;
  }

  newReportAdded(report: any) {
    this.getReports();
    this.selected_report = report;
    this.actionClicked("view", true);
  }

  reportOption(detail: any) {
    if (this.loading_general_action || this.deleting_report) return;
    switch (detail.option) {
      case 'delete':
        this.delete_report_modal = true;
        this.deleting_report = true;
        this.confirmation_modal_text = {
          title: "Delete Report",
          message: `This cannot be undone. Are you sure you want to delete report "${detail.report.name}"?`,
          action_id: detail.report.pageid,
          action_index: detail.index,
          confirm: "Confirm"
        };
        break;

      case 'rename':
        let report_to_update = this.reports[detail.index];
        report_to_update.name = detail.report.new_name;
        report_to_update.renaming = false;
        report_to_update.selected = false;
        delete report_to_update.new_name;
        const updatebody = {
          userid: this.loggedUser.qrvey_info.userid,
          appid: this.loggedUser.qrvey_info.appid,
          pageid: report_to_update.pageid,
          no_select: true,
          qbody: report_to_update
        };
        this.loading_general_action = true;
        this.updateReport(updatebody, () => {
          this.loading_general_action = false;
          this.reports[detail.index].name = report_to_update.name;
        })

        break;

      case 'duplicate':
        console.log(detail);
        this.loading_general_action = true;
        this.createFromTemplate(detail.report);
        break;

      default:
        break;
    }
  }

  closeDeleteReportModal() {
    this.delete_report_modal = false;
    this.deleting_report = false;

    this.confirmation_modal_text = {
      title: "Delete Report",
      message: "",
      action_id: null,
      action_index: null
    }
  }

  deleteSelectedReport() {
    const deletereportbody = {
      userid: this.loggedUser.qrvey_info.userid,
      appid: this.loggedUser.qrvey_info.appid,
      pageid: this.confirmation_modal_text.action_id
    }
    let no_error = false;
    this.confirmation_modal_text.confirm = "Deleting...";
    this.backend.deleteReport(deletereportbody).subscribe({
      next: (response: any) => {
        no_error = true
      },
      error: (e: any) => {
        console.log(e)
      },
      complete: () => {
        this.deleting_report = false;
        if (no_error) {
          this.deleteReportArray(this.confirmation_modal_text.action_index);
        }
      }
    })
  }

  deleteReportArray(index: number) {
    let new_reports = [...this.reports];
    new_reports.splice(index, 1);
    this.reports = new_reports;
    if (this.selected_report && this.selected_report.pageid == this.confirmation_modal_text.action_id) {
      this.widgetContainer.innerHTML = '';
      this.selected_report = null;
    }
    this.closeDeleteReportModal();
  }

  createFromTemplate(report: any) {
    const clonereportbody = {
      userid: this.loggedUser.qrvey_info.userid,
      appid: this.loggedUser.qrvey_info.appid,
      pageid: report.pageid,
      qbody: {
        pageName: 'Copy of ' + report.name
      }
    }
    let new_report_model: any;
    this.backend.cloneReport(clonereportbody).subscribe({
      next: (response) => {
        new_report_model = response;
      },
      error: (e: any) => {
        console.log(e);
      },
      complete: () => {
        const rmbody = {
          userid: this.loggedUser.qrvey_info.userid,
          appid: this.loggedUser.qrvey_info.appid,
          pageid: new_report_model.pageId
        };
        let updates = { 
          editing: false, 
          published: true, 
          updateTo: "Published", 
          forceUpdate: true, 
          selected: false, 
          system_user_id: this.loggedUser.type == 'admin' ? null : this.loggedUser.email, 
          shared: false 
        };
        this.getReportAndMerge(rmbody, updates, (rmresponse: any) => {
          const updatebody = {
            userid: this.loggedUser.qrvey_info.userid,
            appid: this.loggedUser.qrvey_info.appid,
            pageid: new_report_model.pageId,
            no_select: true,
            qbody: rmresponse
          };
          this.updateReport(updatebody, (updtresponse: any) => {
            this.loading_general_action = false;
            if (!this.share_report_page) {
              this.getReports();
            }
          })
        })

      }
    });
  }

  getTenants(){
    this.user.getTenantsAndUsers().subscribe({
      next: (response:any) => {
        this.tenants = response;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        // this.loading = false;
      }
    });
  }

  getPlans(){
    this.user.getPlans().subscribe({
      next: (response:any) => {
        this.plans = response;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        // this.loading = false;
      }
    });
  }

  publishReportModal(report?: any){
    this.publish_report_modal = true;
  }

  publishReportClose(){
    if(this.publishing_report) return;
    this.publish_report_modal = false;
  }

  publishReport(planid: any){
    if(this.publishing_report) return;
    console.log(planid); 
    const body = {
      planid,
      page: this.selected_report
    }
    this.backend.addPagePlan(body).subscribe({
      next: (response:any) => {
        console.log(response);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.publishing_report = false;
        this.publishReportClose();
      }
    });
  }

}
