import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import {AuthService} from "../../services/auth.service";
import LoginRequest from "../../model/auth/LoginRequest";
import {ProfileService} from "../../services/profile.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.less']
})
export class SigninComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router,private profileService : ProfileService) {

  }

  ngOnInit(): void {
    let lastLogin = localStorage.getItem("fsbook-last-login")
    this.loginForm = this.formBuilder.group({
      email: [lastLogin, Validators.email],
      password: ['']
    });
    this.authService.clearLogged();
    this.authService.currentUser.subscribe({
      next:()=> {this.router.navigate(['']);this.profileService.currentUser},
      error: ()=>{}
    })

  }

  login() {
    const loginRequest: LoginRequest = {
      username: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
    };
    localStorage.setItem("fsbook-last-login",this.loginForm.controls['email'].value)
    this.authService.login(loginRequest).subscribe(message => {
      console.log("login")
      this.authService.currentUser.subscribe(()=>{
        console.log("here")
        this.profileService.currentUser
        this.router.navigate(['']);
      });
      })

  }

}
