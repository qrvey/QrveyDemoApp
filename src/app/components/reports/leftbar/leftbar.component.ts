import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.scss']
})
export class LeftbarComponent implements OnInit {

  @Input() loggedUser: any;
  @Input() loading: any = true;
  @Input() reports: any[] = [];
  @Input() shareReportsPages: any;
  @Input() current_report: any;
  @Output() reportClicked: EventEmitter<any> = new EventEmitter();
  @Output() newReport: EventEmitter<any> = new EventEmitter();
  @Output() reportOptionClicked: EventEmitter<any> = new EventEmitter();

  constructor(private backend: BackendService) { }

  ngOnInit(): void {
  }

  selectReport(report: any) {
    if (this.current_report) this.current_report.selected = false;
    report.selected = true;
    this.current_report = report;
    report['sidebar'] = true;
    this.reportClicked.emit(report);
  }

  triggerNewReport() {
    this.newReport.emit();
  }

  reportOption(option: string, report: any, index?: number) {
    if(report.name == report.new_name){
      report.renaming = false;
      report.selected = false;
      return;
    }
    this.reportOptionClicked.emit({ option, report: {...report}, index });
  }

  renameReport(report: any){
    report.renaming = true;
    report["new_name"] = ''+report.name; 
    report.selected = true;
    setTimeout(() => {
      (document as any).getElementById("input-name-"+report.pageid).select();  
      (document as any).getElementById("input-name-"+report.pageid).focus();  
    }, 0);
  }

  onKey(event:any, option: string, report: any, index?: number ){
    if(event.key == 'Enter' || event.keyCode == 13)  this.reportOption(option,report,index);
  }

  getDate(date:string){
    let date_c = new Date(date);
    return date_c.toLocaleDateString("en-US");
  }

}
