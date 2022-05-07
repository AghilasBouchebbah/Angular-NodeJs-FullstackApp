import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstant } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: any = FormGroup;
  responseMessage: any;

  //les services à importer
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      //verifier que le champ est remplie et respecte l'expression reguliere indiquée
      name: [null, [Validators.required, Validators.pattern(GlobalConstant.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstant.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstant.contactNumberRegex)]],
      password: [null, [Validators.required]],
    })
  }


  handleSubmit() {
    //lancer l'icon de chargement au click
    this.ngxService.start();
    var formData = this.signupForm.value;
    //créer le payload de données pour faire l'appel à l'api signup du back
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }

    this.userService.signup(data).subscribe(
      //si reponse 200
      (response: any) => {

        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "");
        this.router.navigate(['/']);
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
