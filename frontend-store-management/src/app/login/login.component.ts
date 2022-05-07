import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstant } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any = FormGroup;
  responseMessage: any;

  //les services à importer
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      //verifier que le champ est remplie et respecte l'expression reguliere indiquée
      email: [null, [Validators.required, Validators.pattern(GlobalConstant.emailRegex)]],
      password: [null, [Validators.required]],
    })
  }


  handleSubmit() {
    //lancer l'icon de chargement au click
    this.ngxService.start();
    var formData = this.loginForm.value;
    //créer le payload de données pour faire l'appel à l'api signup du back
    var data = {
      email: formData.email,
      password: formData.password
    }

    this.userService.login(data).subscribe(
      //si reponse 200
      (response: any) => {

        this.ngxService.stop();
        this.dialogRef.close();
        //stokage du navigateur (clé valeur) pour stocker le token de connexion (session)
        localStorage.setItem('token',response.token);
        this.responseMessage = response?.message;
        this.router.navigate(['/store/dashboard']);
        //si erreur
      }, (error) => {

        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        }
        else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstant.error);
      }
    )
  }

}