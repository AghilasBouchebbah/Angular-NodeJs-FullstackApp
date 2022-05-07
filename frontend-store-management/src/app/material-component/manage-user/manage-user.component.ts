import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstant } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource:any;
  responseMessage:any;

  constructor(private userService: UserService,
    private snackbarService: SnackbarService,
    private ngxService:NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    //initialiser le loaderUI et l'affichage du tableau de données
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.userService.getUser().subscribe(
      (response: any) => {
        this.ngxService.stop();
        //construire la table dataSource de type MatTableDataSource qui nous permet de faire des filtres par valeurs
        this.dataSource = new MatTableDataSource(response);
        //si erreur
      }, (error:any) => {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  handleChangeAction(status:any,id:any){
    this.ngxService.start();
    var data = {
      status:status.toString(),
      id:id
    }

    this.userService.update(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'success');

      }, (error:any) => {
        console.log(error);
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        }
        else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstant.error);
      })
  }



}
