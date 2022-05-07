import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstant } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm:any =FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    public dialogRef:MatDialogRef<ChangePasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.changePasswordForm=this.formBuilder.group({
      oldPassword:[null,[Validators.required]],
      newPassword:[null,[Validators.required]],
      confirmPassword:[null,[Validators.required]],

    })
  }
  
  //verifier que newPassword et confirmPassword sont identique
  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value){
      return true;
    }
    else{
      return false;
    }
  }



  handleChangePasswordSubmit() {
    //lancer l'icon de chargement au click
    this.ngxService.start();
    var formData = this.changePasswordForm.value;
    //créer le payload de données pour faire l'appel à l'api changePassword du back
    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    } 

    this.userService.changePassword(data).subscribe(
      //si reponse 200
      (response: any) => {

        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.dialogRef.close();
        this.snackbarService.openSnackBar(this.responseMessage, "success");
        //si erreur
      }, (error) => {
        console.log(error);
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
