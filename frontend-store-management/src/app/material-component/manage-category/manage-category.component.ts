import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  displayedColumns: string[] = ['name', 'edit'];
  dataSource: any;
  responseMessage: any;

  constructor(private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    //initialiser le loaderUI et l'affichage du tableau de données
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.categoryService.getCategorys().subscribe(
      //si reponse 200
      //response contient les données récuprés de la base de données apés l'appel à l'api
      (response: any) => {

        this.ngxService.stop();
        //construire la table dataSource de type MatTableDataSource qui nous permet de faire des filtres par valeurs
        this.dataSource = new MatTableDataSource(response);
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



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }


  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      action: 'Add'
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCatgory.subscribe(
      (response)=>{
        this.tableData();
      }
    )
  }


  handleEditAction(value:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      action: 'Edit',
      data:value
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe(
      (response)=>{
        this.tableData();
      }
    )
  }

}



