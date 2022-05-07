import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstant } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: any = FormGroup;
  responseMessage: any;

  //les services à importer
  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      //verifier que le champ est remplie et respecte l'expression reguliere indiquée
      email: [null, [Validators.required, Validators.pattern(GlobalConstant.emailRegex)]],
    })
  }



  handleSubmit() {
    //lancer l'icon de chargement au click
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    //créer le payload de données pour faire l'appel à l'api signup du back
    var data = {
      email: formData.email
    }

    this.userService.forgotPassword(data).subscribe(
      //si reponse
      (response: any) => {

        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.dialogRef.close();
        this.snackbarService.openSnackBar(this.responseMessage, "");
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
