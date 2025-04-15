import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-passwordcreation',
  templateUrl: './passwordcreation.component.html',
  styleUrls: ['./passwordcreation.component.sass']
})
export class PasswordcreationComponent implements OnInit {
 
   loggedUser: any = {};
   userData: any;
   myDate:any;
   empObj:any;
   userId:any;
   empInfo:any={};
   profle_imgURL:any;
   ProfileImg:boolean = false;
   isEmpInfo:boolean = false;
   dsbleBtn:boolean = true;
   empLeaveTypes:any;
   selectedLeaveTypes = [];
   selectedAttndnceTypes = [];
   empcode:any;
   checkedIDs = [];
   checkedIDsAttendnce = [];
 
   finalData:any=[];
   finalDataAttendnce:any=[];
 
   bk_Date: any; 
   inValidEmpId:any;
   Responce:any;
   authBoolean:boolean;
   privil_eges:any= {};
   employeeid:any;
   attndnceDate:any;
   theRadioVal:any;
   minDateFrom: Date;
   maxDateFrom: Date;
   isLoading:boolean = false;
   colorTheme = 'theme-dark-blue';  
   constructor(public router: Router,
     public authService: AuthService,
     public datepipe: DatePipe,private fb: FormBuilder) {
     this.minDateFrom = new Date();
     this.maxDateFrom = new Date();
     this.passwordReset = this.fb.group({
      employeeCode: ['', Validators.required],
      password: ['', [Validators.required,Validators.minLength(6)]]
    });
    }
    passwordReset: FormGroup;
    isPasswordVisible: boolean = false;
    
   ngOnInit(): void {  
     // this.attndnceDate = [];  
     if(this.empLeaveTypes){
       this.fetchSelectedItems();
       this.fetchCheckedIDs(); 
     }
     else if (this.attndnceDate){
       this.fetchSelectedItems1();
       this.fetchCheckedIDs1();
     } 
     this.loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
     this.userData = JSON.parse(this.loggedUser);
     this.myDate =  decodeURIComponent(window.atob(localStorage.getItem('currentDate')));
     moment.locale('en');
     let x = decodeURIComponent(window.atob(localStorage.getItem('privileges')));
     this.privil_eges =   JSON.parse(x).Rights; 
     this.authBoolean=false;

     
     for (let i = 0; i < this.privil_eges.length; i++) {   
       if(this.privil_eges[i].Unfreeze_dates == "true"|| this.privil_eges[i].parent =="1"){ 
         this.authBoolean=true;
       }
     }
     if(this.authBoolean== false){
       let x = 'false'; 
       this.router.navigate(['/errorPage', {AuthrzdUser: x}]); 
     }
 
 
     this.maxDateFrom = new Date(this.myDate)
     let emp = [{ 'empID': "" + this.userData.user.empID + "" }];
     this.empObj =  emp[0];
     if (this.loggedUser == null || this.loggedUser == undefined) {
       this.router.navigate(['/login'], { replaceUrl: true });
     }
     this.router.events.subscribe((evt) => {
       if (!(evt instanceof NavigationEnd)) {
         return;
       }
       window.scrollTo(0, 0)
     });
   }

 numberOnly(event): boolean {
   const charCode = (event.which) ? event.which : event.keyCode;
   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
     return false;
   }
   return true;
 }
 
 onSearchChange(searchValue: string): void {  
   // console.log(searchValue);
   if(searchValue.length>=5){
     this.userId = { 'userid': "" + searchValue + "" };
     this.getApiData()
   }else if(searchValue.length==0){
    this.passwordReset.reset();
this.empInfo={};
this.ProfileImg =false;
   }
   
 }
 
 resetData(){
   // this.ngOnInit();    
this.passwordReset.reset();
this.empInfo={};
this.ProfileImg =false;
   // this.empInfo = false;
 }

 
 
 
 getApiData(){ 

   this.isLoading= true;
   this.authService.unfreeze_empinfo(this.userId).subscribe(res=>{
       // console.log(res);
       if(res){        
         this.inValidEmpId = res.info.length; 
         this.empInfo = res.info[0];
         //console.log("data",JSON.stringify(this.empInfo))
         this.employeeid=this.empInfo.HRMSEMPLOYEEID;
         this.empcode=this.empInfo.EmpCode;
         this.isEmpInfo= true;
         this.isLoading= false;
       }else{
         this.isEmpInfo= false;
         this.isLoading= false;
        // alert('something went wrong')
       } 
   });
   let param= { 'empID': "" + this.userId.userid + "" };
   this.authService.profilepicview(param).subscribe(res=>{
       if(res){
           this.profle_imgURL= this.authService.imgbase + res.profilepicview ; 
           if(res.profilepicview){
             let x = res.profilepicview.split('/');
             if(x[1]==this.userId.userid){
               this.ProfileImg =true;
             }else{
               this.ProfileImg =false;
             }
           }
           this.isLoading= false; 
       }else{
         this.isLoading= false;
         //alert('something went wrong')
       }
   })
 }
 
 onChange() {
   this.finalData = []; 
   this.fetchSelectedItems();
   for(let i=0; i<this.selectedLeaveTypes.length; i++){
     if(this.selectedLeaveTypes[i].isSelected){
       this.finalData.push(JSON.parse(this.selectedLeaveTypes[i].TYPE));
     }
   }
 }
 fetchSelectedItems() {
   this.selectedLeaveTypes = this.empLeaveTypes.filter((value, index) => {
     return value.isSelected
   });
 }
 
 fetchCheckedIDs() {
   this.checkedIDs = [];  
   this.empLeaveTypes.forEach((value, index) => {
     if (value.isSelected) {
       this.checkedIDs.push(JSON.stringify(value.TYPE));    
     }
   });
 }
  
 onDateCheck(){
   this.finalDataAttendnce=[];
   this.fetchSelectedItems1();
   for(let i=0; i<this.selectedAttndnceTypes.length; i++){
     if(this.selectedAttndnceTypes[i].isSelected){
       this.finalDataAttendnce.push(this.selectedAttndnceTypes[i].DATE);
     }
   } 
   if(this.finalDataAttendnce.length >0){
     this.dsbleBtn = false;
   }
 }
 
 fetchSelectedItems1() {
   this.selectedAttndnceTypes = this.attndnceDate.filter((value, index) => {
     return value.isSelected
   });
 }
 
 fetchCheckedIDs1() {
   this.checkedIDsAttendnce = [];  
   this.attndnceDate.forEach((value, index) => {
     if (value.isSelected) {
       this.checkedIDsAttendnce.push(value.DATE);    
     }
   });
 }
 
 onSubmit(): void {
  if (!this.passwordReset.valid) {
    this.passwordReset.markAllAsTouched();
    return; 
  }
  const data = {
    "employeeId": this.employeeid,  
    "employeeCode":this.empcode,
    "password": this.passwordReset.get('password')?.value,
    "loginId": this.userData.user.empID,
    "createdBy": this.userData.user.empID
  };

  this.authService.postPasswordReset(data).subscribe(
    (res: any) => {
      Swal.fire({
        title: 'Success!',
        text: 'Password Changed Successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      this.empInfo={};
      this.passwordReset.reset();
      this.ProfileImg =false;
  
    },
    (error) => {
    //  console.error("Error during password reset:", error);
      let errorMessage = 'Failed to change password. Please try again.';
      if (error.status === 404 && error.error) {
        try {
          const errorObj = JSON.parse(error.error);
          errorMessage = errorObj.message ;
        } catch (e) {
          //console.error("Error parsing error response:", e);
        }
      }

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      this.empInfo={};
      this.passwordReset.reset();
      this.ProfileImg =false;
    }
  );
}

 }
 