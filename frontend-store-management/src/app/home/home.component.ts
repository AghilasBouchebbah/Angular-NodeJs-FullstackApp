import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../services/user.service';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //declarer les modules et component à utiliser
  constructor(private dialog: MatDialog, private router: Router, private userService: UserService) { }

  // check si le token exist dans le navigateur et que il est valide donc il garde le user toujours sur la page de dashboard meme si il demande la page de connexion
  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      this.userService.checkToken().subscribe((Response: any) => {
        this.router.navigate(['/store/dashboard']);


      }, (error: any) => {
        console.log(error);
      })

    }
  }

  //en cliquant sur le bouton signup, le Mat-dialogue s'ouvre
  signupAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(SignupComponent, dialogConfig);
  };

  forgotPasswordAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  };

  loginAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(LoginComponent, dialogConfig);
  };



}
