import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.scss']
})
export class LeftbarComponent implements OnInit {

  @Input() loggedUser:any;
  @Input() loading: any;
  @Input() reports: any[] = [];
  @Output() reportClicked: EventEmitter<any> = new EventEmitter();
  current_report: any;

  constructor() { }

  ngOnInit(): void {
  }

  selectReport(report:any){
    if(this.current_report) this.current_report.selected = false;
    report.selected = true;
    this.current_report = report;
    report['sidebar'] = true;
    this.reportClicked.emit(report);
  }

}
