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

  constructor(private user: UserService, private router: Router, private SetColorService: SetColorService) {
    if (this.user.getUser()) {
      this.SetColorService.setColor(this.user.getUser());
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.SetColorService.setColor();
  }

  signIn() { //backend auth
    if (!this.user_email || this.validating) return;
    this.error = null;
    this.validating = true;
    this.user.authUser({ email: this.user_email }).subscribe((response: any) => {
      console.log(response);
      localStorage.setItem('loggedUser', JSON.stringify(response));
      this.user.setUser(response);
      this.SetColorService.setColor(this.user.getUser());
      if(response.type == "viewer"){
        this.router.navigate(['/shared-reports']);
      }else{
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

}
