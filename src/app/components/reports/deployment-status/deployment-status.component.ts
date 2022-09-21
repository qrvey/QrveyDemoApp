import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-deployment-status',
  templateUrl: './deployment-status.component.html',
  styleUrls: ['./deployment-status.component.scss']
})
export class DeploymentStatusComponent implements OnInit {
  @Input() taskid: any;

  constructor() { }

  ngOnInit(): void {
  }

}
