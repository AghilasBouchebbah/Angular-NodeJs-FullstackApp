import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  onEmitStatusChange = new EventEmitter();
  details:any ={};
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any) { }

  ngOnInit(): void {
    if(this.dialogData){
      this.details = this.dialogData;

    }
  }

  handleChangeAction(){
    //il emit la reponse au parent qui est le header.component
    this.onEmitStatusChange.emit();
  }

}
