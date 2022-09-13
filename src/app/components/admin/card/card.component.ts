import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() tenant?: any;
  @Input() plan_template?: any;
  @Input() plan?: any;
  @Output() changeTenantPlan: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  changePlan(tenantid: string, planid: string, e: any) { 
    if(this.tenant.planid == planid){
      e.preventDefault();
      return;
    }

    this.changeTenantPlan.emit({tenantid,planid});
  }

}
