import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent implements OnInit {

  report_name: string = '';
  template: string = '';
  creating: boolean = false;
  create_button_label: string = 'Create';
  @Input() reports: any[] = [];
  @Input() loggedUser: any;
  @Output() newReportClose: EventEmitter<any> = new EventEmitter();
  @Output() newReport: EventEmitter<any> = new EventEmitter();
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.triggerCloseReport()
  }

  constructor(private backend: BackendService) { }

  ngOnInit(): void {
  }

  triggerCloseReport() {
    if (this.creating) return;
    this.newReportClose.emit();
  }

  createReport() {
    if (!this.report_name || this.creating) return;

    if (this.template && this.template != '') {
      this.createFromTemplate();
      return;
    }

    this.creating = true;
    this.create_button_label = 'Creating...';
    const qbody = {
      "name": this.report_name,
      "description": "",
      "private": false,
      "published": true,
      "active": false,
      "editing": false,
      "system_user_id": this.loggedUser.email, //Custom prop
    }

    const newreportbody = {
      userid: this.loggedUser.qrvey_info.userid,
      appid: this.loggedUser.qrvey_info.appid,
      qbody: qbody
    }

    let new_report_model: any;

    this.backend.createNewReport(newreportbody).subscribe({
      next: (response: any) => {
        new_report_model = { ...response, selected: true };
      },
      error: (e: any) => {
        console.log(e);
      },
      complete: () => {
        this.creating = false;
        this.create_button_label = 'Create';
        this.newReportClose.emit();
        this.newReport.emit(new_report_model);
      }
    });
  }

  getReport(body: any, updates: any, callback: any) {
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
    let new_report_model: any;
    this.backend.updateReport(body).subscribe({
      next: (response) => {
        new_report_model = { ...response, selected: true };
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        callback(new_report_model);
      }
    });
  }

  createFromTemplate() {
    this.creating = true;
    this.create_button_label = 'Cloning...';
    const clonereportbody = {
      userid: this.loggedUser.qrvey_info.userid,
      appid: this.loggedUser.qrvey_info.appid,
      pageid: this.template,
      qbody: {
        pageName: this.report_name
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
        this.getReport(rmbody, { system_user_id: this.loggedUser.email }, (rmresponse: any) => {
          this.create_button_label = 'Creating...';
          const updatebody = {
            userid: this.loggedUser.qrvey_info.userid,
            appid: this.loggedUser.qrvey_info.appid,
            pageid: new_report_model.pageId,
            qbody: rmresponse
          };
          this.updateReport(updatebody, (updtresponse: any) => {
            this.creating = false;
            this.create_button_label = 'Create';
            this.newReportClose.emit();
            this.newReport.emit(updtresponse);
          })
        })

      }
    });
  }

}
