import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SetColorService } from 'src/app/services/set-color/set-color.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user_email: string = '';
  user_password: string = '';
  error: any = null;
  validating: boolean = false;
  all_users: any[] = [];
  loading: boolean = true;
  help_modal: boolean = false;
  confirmation_modal_text: any = {
    title: "Demo App Help",
    message: "",
    action_id: null,
    action_index: null,
    confirm: "",
    no_footer: true
  }

  constructor(private user: UserService, private router: Router, private SetColorService: SetColorService) {
    if (this.user.getUser()) {
      this.SetColorService.setColor(this.user.getUser());
      this.router.navigate(['/']);
    }
    this.user.getUsers().subscribe({
      next: (response: any) => {
        this.all_users = response;
      },
      error: (e: any) => {
        console.log(e);
      },
      complete: () => {
        this.loading = false;
        this.confirmation_modal_text.message = this.buildHelpHTML(this.all_users);
      }
    })
  }

  ngOnInit(): void {
    this.SetColorService.setColor();
  }

  onKey(event:any){
    if(event.key == 'Enter' || event.keyCode == 13)  this.signIn();
  }

  signIn() { //backend auth
    if (!this.user_email || !this.user_password || this.validating) return;
    this.error = null;
    this.validating = true;
    this.user.authUser({ email: this.user_email }).subscribe((response: any) => {
      localStorage.setItem('loggedUser', JSON.stringify(response));
      this.user.setUser(response);
      this.SetColorService.setColor(this.user.getUser());
      if (response.type == "viewer") {
        this.router.navigate(['/shared-reports']);
      } else {
        this.router.navigate(['/']);
      }
      this.validating = false;
    },
      (error: any) => {
        console.log(error.error.message);
        this.error = error.error;
        this.validating = false;
      }
    );
  }

  modalShow() {
    this.help_modal = !this.help_modal;
  }

  buildHelpHTML(users: any) {
    let HTML = `Here's a list of existing users you can use to test this demo app!<br><br>`;
    let org_id: number = 0;
    users.forEach((u: any, i: number) => {
      if (u.type != 'admin') {
        if(u.organization.id != org_id && i > 1) HTML += `<b>------------</b><br><br>`;
        org_id = u.organization.id;
        HTML += `<b>Name</b>: ${u.name}<br/>`;
        HTML += `<b>Email</b>: ${u.email}<br/>`;
        HTML += `<b>Password</b>: 123456<br/>`;
        HTML += `<b>Type</b>: ${u.type}<br/>`;
        HTML += `<b>Organization</b>: ${u.organization.name}${i + 1 == users.length ? '' : '<br/><br/>'}`;
      }
    });
    return HTML;
  }

}
