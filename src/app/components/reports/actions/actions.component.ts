import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  @Input() loggedUser: any;
  @Input() selectedReport:any;
  @Input() mode: string = "view";
  @Input() shareReportsPages: any;
  @Input() disablePublish: boolean = false;
  @Output() actionClicked: EventEmitter<any> = new EventEmitter();
  @Output() shareReport: EventEmitter<any> = new EventEmitter();
  @Output() publishReport: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  changeView(m:string){
    this.actionClicked.emit(m);
  }

  shareClicked(){
    this.shareReport.emit( !this.selectedReport.shared );
  }

  publishClicked(){
    this.publishReport.emit( this.selectedReport );
  }

}
