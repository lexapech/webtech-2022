import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import SignupRequest from "../../model/auth/SignupRequest";
import {ProfileService} from "../../services/profile.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router,private profileService : ProfileService) { }
  //TODO: form checks
  ngOnInit(): void {

    this.signupForm = this.formBuilder.group({
      firstname: [''],
      midname:[''],
      lastname:[''],
      birthday:[''],
      email: ['', Validators.email],
      password: [''],
      password2: ['']
    });
  }

  signup() {
    const signupRequest: SignupRequest = {
      firstname: this.signupForm.controls['firstname'].value,
      midname:this.signupForm.controls['midname'].value,
      lastname:this.signupForm.controls['lastname'].value,
      birthday:this.signupForm.controls['birthday'].value,
      email: this.signupForm.controls['email'].value,
      password:this.signupForm.controls['password'].value,
    };
    localStorage.setItem("fsbook-last-login",this.signupForm.controls['email'].value)
    this.authService.signup(signupRequest).subscribe(() => {
      this.authService.currentUser.subscribe(()=>{
        this.router.navigate(['']);
        this.profileService.currentUser
      });
    })
  }

}
