import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-datasets-cont',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit {
  loggedUser: any = null;
  loading: boolean = true;
  widgetContainer: any;

  constructor(private user: UserService, private router: Router, private backend: BackendService) { 
    this.loggedUser = this.user.getUser();
  }

  ngOnInit(): void {
    
    const jwtbody = {
      userid: this.loggedUser.qrvey_info.userid,
      appid: this.loggedUser.qrvey_info.appid
    }
    this.getJWT(jwtbody, (jwtresponse: any) => {
      this.buildQrveyDataset(jwtresponse);
    })
  }

  buildQrveyDataset(token: string){
    this.loading = false;
    this.widgetContainer = document.querySelector(".widget-wrapper");
    this.widgetContainer.style.cssText = `--qv-main-color: ${this.loggedUser.organization.hexcolor}; --qv-tab-bar-color: rgb(244, 246, 248); --qv-tab-font-color: #585858; --qv-secondary-color: #585858 !important;`;
    (window as any).qrveyDatasetConfig = {
      qv_token: token,
      domain: environment.qrvey_domain
    };
    let pdataset_tag =  document.createElement("qrvey-data-sets");
    pdataset_tag.setAttribute("settings", "qrveyDatasetConfig");
    this.widgetContainer.append(pdataset_tag);
  }

  getJWT(body: any, callback: any) {
    let token: any = null;
    this.backend.generateJwt(body).subscribe({
      next: (response: any) => {
        token = response.token;
      },
      error: (e: any) => {
        console.log(e);
        this.loading = false;
      },
      complete: () => {
        callback(token);
      }
    })
  }

}
