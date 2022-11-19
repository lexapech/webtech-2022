import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-photoviewer',
  templateUrl: './photoviewer.component.html',
  styleUrls: ['./photoviewer.component.less']
})
export class PhotoviewerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {pictures:string[],index:number },) { }

  ngOnInit(): void {
  }

  prev(){
    if(this.data.index>0)
      this.data.index--
  }
  next(){
    if(this.data.index<this.data.pictures.length-1)
    this.data.index++
  }

}
