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

}
