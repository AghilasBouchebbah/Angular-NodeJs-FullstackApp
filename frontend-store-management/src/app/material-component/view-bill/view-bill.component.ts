import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource:any = [];
  responseMessage:any;

  constructor(private billService: BillService,
    private snackbarService: SnackbarService,
   private dialog:MatDialog,
    private ngxService:NgxUiLoaderService,
    private router:Router
  ) { }

  ngOnInit(): void {
    //initialiser le loaderUI et l'affichage du tableau de données
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.billService.getBills().subscribe(
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

  handleViewAction(values:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data:values
    }
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }

  downloadReportAction(value:any){

    this.ngxService.start();
    var data = {
      name: value.name,
      email: value.email,
      uuid: value.uuid,
      contactNumber: value.contactNumber,
      paymentMethod: value.paymentMethod,
      totalAmount: value.total,
      productDetails: value.productDetails
    }
    this.billService.getPdf(data).subscribe(
      (response)=>{
        saveAs(response,value.uuid+'.pdf');
        this.ngxService.stop();
      }
    )

      
  }

 
  handleDeleteAction(value:any){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        message: 'delete ' + value.name + ' Bill'
      }
      //faire appel à la boite de dialogue "confirmation"
      const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
      const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
        (response) => {
          this.ngxService.start();
          this.deleteBill(value.id);
          dialogRef.close();
        }
      )
  }

  deleteBill(id:any){

    this.billService.delete(id).subscribe(
      (response: any) => {
        //arreter le loader animation
        this.ngxService.stop();
        //rafraichir la table
        this.tableData();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');

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
      })

}
  




}
