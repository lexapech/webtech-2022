import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NewsService} from "../../services/news.service";
import Post from "../../model/user/Post";
import {ProfileService} from "../../services/profile.service";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../confirm/confirm.component";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit, OnDestroy {
   @Input('Profile') isMine:boolean=false
  @Input('UserId') id:string|null=null
    myProfile:boolean=false
    news: Post[]=[]

    yourText:string=""

    postForm:FormGroup;

    selected:File |null=null;
  constructor(private newsService : NewsService,private formBuilder: FormBuilder,private route: ActivatedRoute,private profileService:ProfileService,private dialog: MatDialog) {
      this.postForm = this.formBuilder.group({
          text: [''],
          image: ['']
      });
  }


  deletePost(postId:string){
      //console.log(postId)
      const dialogRef = this.dialog.open(ConfirmComponent, {
          width: '350px',
          data: 'Вы уверены, что хотите удалить запись?'
      });
      dialogRef.afterClosed().subscribe(result => {
          if (result===true) {
              this.newsService.deletePost(postId).subscribe(x=>{
                  if (x.status==="ok") {
                      this.news=this.news.filter(post=>post.id!==postId)

                  }
              })
          }
      });
  }


    ngOnDestroy(): void {
        this.newsService.unsubscribe()
    }

    onFileSelected(event:any) {
        if(event.target.files.length > 0)
        {
           this.selected=event.target.files[0]
        }
        else {
            this.selected = null;
        }
    }

    createPost()
    {
        let formData=new FormData()
        formData.append("text",this.postForm.controls['text'].value)
        if(this.selected)
            formData.append("image",this.selected)
        this.newsService.post(formData).subscribe(()=>{
            console.log("loag")
            this.loadNews()}

        )
    }

    loadNews(){
        if(this.isMine)
            this.route.url.pipe(map(segments => segments.join(''))).subscribe(url=>{
                if(url.startsWith("me"))
                {
                    this.profileService.getUserInfo("").subscribe(user=>{
                        console.log(user.id)
                        this.newsService.getNews(user.id).subscribe(x=>{
                            this.news=[];
                            this.news.push(...x)
                            this.myProfile=true
                        })
                    })

                } else {
                    this.newsService.getNews(url.replace("id","")).subscribe(x=>{
                        this.news=[];
                        this.news.push(...x)
                        this.myProfile=false
                    })
                }
            })
        else {
            this.newsService.getNews(undefined).subscribe(x => {

                this.news = [];
                this.news.push(...x)
            })
        }
    }


  ngOnInit(): void {
      this.loadNews()
      this.newsService.subscribe()
      this.newsService.setNewsListener((x:Post)=>{
          this.loadNews()
         // this.news=new Array(x).concat(this.news)
      })
  }
}
