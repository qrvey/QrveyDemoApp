import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {

  creating: boolean = false;
  selected_tenants_text: string = "Select Tenants";
  selected_tenants: any[] = [];
  @Input() selectedReport: any;
  @Input() tenants: any[] = [];
  @Input() loggedUser: any;
  @Output() publishReportClose: EventEmitter<any> = new EventEmitter();

  constructor() {

  }

  ngOnInit(): void {
  }

  dropOptions(e?: any) {
    e.stopPropagation();
    const checkList: any = document.getElementById('tenants-drop');
    if (checkList && checkList.classList.contains('visible'))
      checkList.classList.remove('visible');
    else
      checkList.classList.add('visible');
  }

  triggerClosePublishReport() {
    if (this.creating) return;
    this.publishReportClose.emit();
  }

  closeTenantsDrop() {
    const checkList: any = document.getElementById('tenants-drop');
    checkList.classList.remove('visible');
  }

  getTenantsNames(tenantsids: any[]) {
    let names = '';
    tenantsids.forEach((t: string, i: number) => {
      names += this.tenants.filter(e => e.id == t)[0].name;
      if (i + 1 < tenantsids.length) {
        names += ', ';
      }
    });
    return names;
  }

  addRemoveTenant(e: any) {
    console.log(e);
    const checked = e.target.value;
    let checkboxes = document.querySelectorAll(".tenants-checks");
    let t_allcheck: any = (document as any).getElementById("t-all")
    if (checked != 'all') {

      if (this.selected_tenants.includes('all')) {
        t_allcheck.checked = false;
        this.selected_tenants = [];
        checkboxes.forEach((c: any) => {
          if(c.checked){
            this.selected_tenants.push(c.value);
          }
        });
      }else{
        if (e.target.checked) {
          this.selected_tenants.push(checked);
        } else {
          this.selected_tenants.splice(this.selected_tenants.indexOf(checked), 1);
        }
      }
      
      if (this.selected_tenants.length > 0) {
        this.selected_tenants_text = this.getTenantsNames(this.selected_tenants);
      } else {
        this.selected_tenants_text = "Select Tenants";
      }
    } else {
      this.selected_tenants = [];
      if (e.target.checked) {
        checkboxes.forEach((c: any) => {
          c.checked = true;
        });
        this.selected_tenants_text = "All";
        this.selected_tenants.push(checked);
      } else {
        checkboxes.forEach((c: any) => {
          c.checked = false;
        })
        this.selected_tenants_text = "Select Tenants";
      }

    }
  }

  publishReport() { 
    if(this.selected_tenants.length == 0) return;
    
    // this.triggerClosePublishReport()
  }

}
