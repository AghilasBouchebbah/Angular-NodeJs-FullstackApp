import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  onAddCatgory = new EventEmitter();
  onEditCategory = new EventEmitter();

  categoryForm :any = FormGroup;
  dialogAction:any = "Add";
  action:any = "Add";
  responseMessage:any;


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder: FormBuilder,
  private categoryService: CategoryService,
  public dialogRef: MatDialogRef<CategoryComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.categoryForm=this.formBuilder.group({
      name:[null,[Validators.required]]

    });

    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "update";
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }


  handleSubmit(){
    if(this.dialogAction === "Edit"){
      this.edit()
    }
    else{
      this.add();
    }
  }

  add(){
    var formData  =this.categoryForm.value;
    var data = {
      name: formData.name
    }
    this.categoryService.add(data).subscribe(
      //si reponse 200
      (response: any) => {

        
        this.dialogRef.close();
        this.onAddCatgory.emit();
        this.responseMessage = response.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
        //si erreur
      }, (error:any) => {
        console.log(error);
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

  edit(){
    var formData  =this.categoryForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name
    }
    this.categoryService.update(data).subscribe(
      //si reponse 200
      (response: any) => {

        
        this.dialogRef.close();
        this.onEditCategory.emit();
        this.responseMessage = response.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
        //si erreur
      }, (error:any) => {
        console.log(error);
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
