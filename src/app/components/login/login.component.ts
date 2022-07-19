import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user_email:string = '';
  user_password:string = '';

  constructor(private user: UserService, private router: Router) { 
    if(this.user.getUser()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
  }

  signIn(){ //backend auth
    let sample_user = {
      email: "sample@sample.com",
      id: 123456,
      name: "Sergio Blanco",
      type: "composer"
    }
    localStorage.setItem('loggedUser', JSON.stringify(sample_user));
    this.user.setUser();
    this.router.navigate(['/']);
  }

}
