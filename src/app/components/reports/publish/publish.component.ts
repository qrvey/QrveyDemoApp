import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {

  creating: boolean = false;
  // selected_tenants_text: string = "Select Tenants";
  // selected_tenants: any[] = [];
  planid: string = '';
  @Input() selectedReport: any;
  @Input() plans: any[] = [];
  @Input() loggedUser: any;
  @Input() publishing: boolean = false;
  @Output() publishReportClose: EventEmitter<any> = new EventEmitter();
  @Output() publishReport: EventEmitter<any> = new EventEmitter();
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.triggerClosePublishReport()
  }

  constructor() {

  }

  ngOnInit(): void {
  }

  triggerClosePublishReport() {
    if (this.creating) return;
    this.publishReportClose.emit();
  }

  closeTenantsDrop() {
    const checkList: any = document.getElementById('tenants-drop');
    checkList.classList.remove('visible');
  }


  publishReportPlan() { 
    if(!this.planid || this.planid == '') return;
    this.publishReport.emit(this.planid);
  }

}
