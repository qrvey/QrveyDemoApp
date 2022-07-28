import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.scss']
})
export class LeftbarComponent implements OnInit {

  @Input() loggedUser: any;
  @Input() loading: any;
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

  reportOption(option: string, pageid: string, name: string, index: number) {
    this.reportOptionClicked.emit({ option, pageid, name, index });
  }

}
