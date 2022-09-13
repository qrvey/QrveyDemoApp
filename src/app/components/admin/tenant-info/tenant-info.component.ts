import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from 'src/app/services/backend/backend.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-tenant-info',
  templateUrl: './tenant-info.component.html',
  styleUrls: ['./tenant-info.component.scss']
})
export class TenantInfoComponent implements OnInit {

  tenant:any;
  loading: boolean = true;
  change_load: boolean = false;
  plans:any;

  constructor(private user: UserService, private router: Router, private backend: BackendService, private route: ActivatedRoute) { 
    this.route.params.subscribe( (params:any) => {
      this.getTenant(params.tenantid);
    } );
  }

  ngOnInit(): void {
  }

  getTenant(id:string){
    this.user.getTenant(id).subscribe({
      next: (response:any) => {
        this.tenant = response;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.getPlans();
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
        this.loading = false;
      }
    });
  }

  changeUserType(user:any, type:string, e:any){
    if(user.type == type) {
      e.preventDefault();
      return;
    }

    this.change_load = true;

    
    this.user.changeUserType(user.id, type).subscribe({
      next: (response:any) => {
        user.type = type;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.change_load = false;
      }
    });

  }

  changeTenantPlan(info:any){
    this.change_load = true;
    this.user.changeTenantPlan(info.tenantid,info.planid).subscribe({
      next: (response:any) => {
        this.tenant.planid = info.planid;
        this.change_load = false;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.change_load = false;
      }
    });
  }

}
