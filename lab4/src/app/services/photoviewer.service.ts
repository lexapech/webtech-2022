import { Injectable } from '@angular/core';
import {ConfirmComponent} from "../components/confirm/confirm.component";
import AppSettings from "../AppSettings";
import {MatDialog} from "@angular/material/dialog";
import {PhotoviewerComponent} from "../components/photoviewer/photoviewer.component";

@Injectable({
  providedIn: 'root'
})
export class PhotoviewerService {

  constructor(private dialog: MatDialog) {


  }
  open(picture:string,pictures:string[]) {
    let index = pictures.findIndex(x=>x===picture)
    const dialogRef = this.dialog.open(PhotoviewerComponent, {
      width: '70%',
      height: '70%',
      panelClass: "phv-panel",
      data: {pictures:pictures,index:index}
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
