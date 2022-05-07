import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from 'src/app/material-component/dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  role: any;
  constructor(private router: Router,
    private dialog: MatDialog) {

  }


  logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout'
    };
    //je lance le component (confirmation) enfant qui est la boite de dialogue
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    //si l'utilisateur clique sur yes,  la boite de dialogue se ferme,  le localstorage se vide et l'utilisateur serta rediriger à la page de connexion
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((user) => {
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);

    })
  }


  changePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }

}
