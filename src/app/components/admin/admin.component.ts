import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  loggedUser: any = null;
  loading: boolean = true;
  tenants: any[] = [];

  constructor(private user: UserService, private router: Router, private backend: BackendService) { 
    this.loggedUser = this.user.getUser();
  }

  ngOnInit(): void {
    this.user.getTenantsAndUsers().subscribe({
      next: (response:any) => {
        console.log(response);
        this.tenants = response;
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
