import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-leavequota',
  templateUrl: './leavequota.component.html',
  styleUrls: ['./leavequota.component.sass']
})
export class LeavequotaComponent implements OnInit {
  myDate: any;
  veiwModal: any;
  listOfReqsts: any;
  empData: any;
  searchText: string = ''; 
  prevData: any;
  search: any[] = [];
  reqData: any;
  isLoading: boolean;
  public submitted: boolean = false;
  myArray: any;
  ImgBasepath: any;
  pdfData: any;
  userData: any;
  modalType: any;
  ReasonForm: FormGroup;
  leaveForm: FormGroup;
  leaveFormAdd: FormGroup;
  editingLeave: any;
  leavedata: any[] = [];
  unassignedlist:any[]=[];
  leaveDataInformation:any[]=[];
  Employeeid:any;
  Assineddata:any;
  UnAssineddata:any;
  employeesequenceno:any;
  sublocation:any;
  isdiabled:any;
  experience :any;
  Total:any;
  authBoolean:boolean;
  privil_eges:any= {}; 
  manageremail:any;


  veiwModalApply: any;
  
  maxAvlDates:any;
  public FYFromyear:any;
  minAvlDtes:any;

  selctdLeave:any;  
  actual_availblLeaves:any;
  public disableButton: boolean = false;
  notifyMsg:any;
  LeaveApplyForm:FormGroup; 
  public FYToyear:any;
  data1:any;
  data2:any;
  minDateFrom: Date;
  maxDateFrom: Date;
  minDateTo: Date;
  frmLoctn:any;
  toLoctn:any; 
  maxDateTo:Date;
  public deviceInfo:any;
  public showLoctnInputs: boolean;
  employeemail:any;
  public showHlfDayInputs: boolean = false;
  minDateVal:number = 0;
  maxDateVal:number = 0;
  selected_Leave:any;
  keyword1 = 'name'; 
  keyword2 = 'name';
  colorTheme = 'theme-dark-blue';  
  isDatePickerDisabled:boolean = true;
  emp: any = [];
  showNotfctn1:boolean = false;
  showNotfctn:boolean = false;
  showFromLoctnError:boolean= false;
  emp_Obj:any;
  empObj:any;
  leaveData: any;
  leaveFormData:any;  
  leaveTypes:any;
  defaultLeave:any;
  showError:boolean = false;
  halfDay:any;
  selectedLeaveType:any;
  half_DayType:any;
  oth_flag:any;
  showToLoctnError:boolean= false;
  constructor(
    public authService: AuthService, 
    private renderer: Renderer2, 
    public fb: FormBuilder, 
    public router: Router,public datepipe: DatePipe
  ) {}
  public dayTypes:string [] = ["Full Day", "Half Day"];  
  public halfDayDates:any = [];
  public halfDayType:any = ["1st Half","2nd Half"]
  ngOnInit(): void {
    this.isDatePickerDisabled = true; 
    this.showLoctnInputs=false;
    this.defaultLeave = '--Select leave Type--'
    this.halfDay = '';  
    this.modalType = '';
    this.isLoading = false;
    let loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(loggedUser);

this.sublocation=this.userData.user.sublocation;
//this.emp_Obj =  this.userData.user.empID;
let device = decodeURIComponent(window.atob(localStorage.getItem('applction')));
this.deviceInfo = JSON.parse(device).deviceInfo;
this.myDate = decodeURIComponent(window.atob(localStorage.getItem('currentDate')));
this.LeaveApplyForm = this.fb.group({  
  leaveType: ['', Validators.required], 
  fromDate: ['', Validators.required],
  toDate: ['', Validators.required],
  day_Type: [this.dayTypes[0]],
  hlfDay_Date: [''],
  hlfDay_Type: [this.halfDayType[0]],
  OD_FromLocation: ['',],
  OD_ToLocation: ['', ],
  reason: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300) ]]
});
this.LeaveApplyForm.get('leaveType').setValue(this.defaultLeave);
this.LeaveApplyForm.value.day_Type= this.dayTypes[0]; 
    this.modalType = '';
    this.isLoading = false;
   
    //console.log("data" + JSON.stringify(this.userData));  // Convert object to string
this.sublocation=this.userData.user.sublocation;


let x =decodeURIComponent(window.atob(localStorage.getItem('privileges')));;
    this.privil_eges =   JSON.parse(x).Rights;

    this.authBoolean=false;
    for (let i = 0; i < this.privil_eges.length; i++) {   
      if(this.privil_eges[i].LeaveQuota == "true"){ 
        this.authBoolean=true;
      }
    }
    if(this.authBoolean== false){
      let x = 'false'; 
      this.router.navigate(['/errorPage', {AuthrzdUser: x}]); 
    }


//alert(this.sublocation)
    //this.myDate = decodeURIComponent(window.atob(localStorage.getItem('currentDate')));
    this.getApiData();

    this.authService.getCurrentDate().subscribe(response => {
      if (response && response.currentDate) {
        this.myDate = response.currentDate;  
       // alert(this.myDate);
      } else {
        console.log('No currentDate found in API response.');
      }
    });


    this.leaveForm = this.fb.group({
      QUANTITY: ['', Validators.required ]  
    });
    
  }
  getApiData() {
    this.isLoading = true;
    this.ImgBasepath = this.authService.imgbase;
    const formdata=new FormData();
    //this.userData.user.empID
    formdata.append('employeeSequenceNo',this.userData.user.empID);
    //let editBlockParam = { "REQUESTTYPE": "BANKADD", "empID": "" + this.userData.user.empID + "" }
    this.authService.getEligibleleaveEmployees(formdata).subscribe(res => {
      this.listOfReqsts = res;
      //console.log("data"+JSON.stringify( this.listOfReqsts))
      this.search = res; 
      this.isLoading = false;
    

  //console.log(res);
     // this.Employeeid=res.Employeeid;
      // if (this.listOfReqsts.length == 0) {
      //   this.router.navigate(['/profileRequests'], { replaceUrl: true });
      // }
      
    });  
  }

  View(item:any)
  {
    this.Assigned(item);
    this.getunassignedleaves(item);
    this.Employeeid=item.Employeeid;
    this.employeesequenceno=item.EmployeeSeq;
    this.experience=item.Experience;
    //alert(this.experience);
  }
  Assigned(item: any) {
    this.Assineddata=item;
    this.empData = item;
  
   // console.log("getdataa"+this.empData);
    const formdata = new FormData();
    formdata.append("employeeSequenceNo",item.EmployeeSeq);
    formdata.append("location",this.sublocation);
    this.authService.getleavedata(formdata).subscribe((res: any) => {
      this.leavedata = res;
      //console.log("--->"+res)
    
    });
   
   
  }


  getunassignedleaves(item:any){
    this.UnAssineddata=item;
    const formdata=new FormData();
    formdata.append("employeeSequenceNo",item.EmployeeSeq);
    formdata.append("location",this.sublocation);
    this.authService.getunassigneddata(formdata).subscribe((res:any)=>{
      this.unassignedlist=res;
      //this.Employeeid=res.Employeeid;
      //console.log("unassigned"+res);

      //

    })
  }
  
  closeVeiwModal() {
    this.modalType = '';
    this.veiwModal = false;
    this.renderer.removeClass(document.body, 'modal-open');
  }
  showmyModal() {
    this.veiwModal = !this.veiwModal;
    this.renderer.addClass(document.body, 'modal-open');
  }
  Action(leaves: any, action: any) {

    //alert(action);
    
    let api: boolean = true; // This is valid
    //alert(this.Employeeid);
    const formdata = new FormData();
    formdata.append('Leavetypeid', leaves.LEAVETYPEID);
    formdata.append('employeeid', this.Employeeid);
    formdata.append('createdby', this.userData.user.empID);
    formdata.append('actiontype', action);
//alert(action)

     if (action === 'Edit') {
        this.editingLeave = leaves;
        this.leaveForm.patchValue({ QUANTITY: leaves.QUANTITY });
         api=false;
      } 
     
    else if (action === 'Update') {
      this.editingLeave = leaves;
      //this.leaveForm.patchValue({ QUANTITY: leaves.QUANTITY });

      const quantity = this.leaveForm.get('QUANTITY')?.value;
      //alert(quantity);
      if (quantity=== undefined || quantity=== null ||quantity=== 0||quantity=== '') {
        // Handle the case where Total is undefined, null, or 0
        //alert(`Total is either undefined, null, or zero. ${leaves.NAME}'s quantity is not valid.`);
        Swal.fire({
          title: 'Warning!',
          text: `Total is either undefined, null, or zero. ${leaves.NAME}'s quantity is not valid.`,
          icon: 'warning',
          confirmButtonText: 'OK'
      });
        api = false;  // Prevent further actions
        } 
       else if(leaves.QUANTITY>quantity)
        {
          //alert(leaves.NAME)
         // alert(`The ${leaves.NAME} quantity cannot be less than the current balance of ${leaves.QUANTITY}`);
          Swal.fire({
            title: 'Warning!',
            text: `The ${leaves.NAME} quantity cannot be less than the current balance of ${leaves.QUANTITY}`,
            icon: 'warning',
            confirmButtonText: 'OK'
        });
           api=false;
         // this.Assigned(this.Assineddata);
         // this.getunassignedleaves(this.UnAssineddata);
        }
        else if(leaves.QUANTITY==quantity)
        {
          //alert(`The '${leaves.NAME}' quantity is the same as the current balance of '${leaves.QUANTITY}'. No changes were made.`);
          Swal.fire({
            title: 'Warning!',
            text: `The ${leaves.NAME} quantity is the same as the current balance of ${leaves.QUANTITY}. No changes were made.`,
            icon: 'warning',
            confirmButtonText: 'OK'
        });
          api = false; // Set api to false, indicating no changes
        }
          
      //alert(quantity);
      formdata.append('Total', quantity);
    } 
  //  else if (action === 'Add') {
   
  //     this.Total = leaves.Total;
  //     //alert("Total: " + this.Total);
      
  //     if (this.Total === undefined || this.Total === null || this.Total === 0) {
  //         // Handle the case where Total is undefined, null, or 0
  //         alert(`Total is either undefined, null, or zero. ${leaves.NAME}'s quantity is not valid.`);
  //         api = false;  // Prevent further actions
  //     } 
     
  //     formdata.append('Total', this.Total);

     
  //  }
  else if (action === 'Add') {
    // Check for experience before proceeding if Leavetypeid is 4
    if (leaves.LEAVETYPEID === 4) {
        let match = this.experience.match(/(\d+)\s*(year|month)s?/g);
        let years = 0;
        let months = 0;

        // Check for years and months in the experience string
        if (match) {
            match.forEach(item => {
                if (item.includes('year')) years = parseInt(item);
                if (item.includes('month')) months = parseInt(item);
            });
        }

        // If the experience is less than 1 year (12 months), alert
        if (years < 1 || (years === 0 && months <=6)) {
           // alert("Please verify,Experience is less than 1 year.");
            Swal.fire({
              title: 'Warning!',
              text: `Please verify,Experience is less than 6 Months.`,
              icon: 'warning',
              confirmButtonText: 'OK'
          });
            api = false;
        }
    }

    this.Total = leaves.Total;
    
    if (this.Total === undefined || this.Total === null || this.Total === 0) {
        //alert(`Total is either undefined, null, or zero. ${leaves.NAME}'s quantity is not valid.`);
        Swal.fire({
          title: 'Warning!',
          text: `Total is either undefined, null, or zero. ${leaves.NAME}'s quantity is not valid.`,
          icon: 'warning',
          confirmButtonText: 'OK'
      });
        api = false;
    }

    formdata.append('Total', this.Total);
} 
   
    else {
      formdata.append('Total', null);
    } 

 
    //alert(action);
    if(api)
    {
      formdata.append('employeesequenceno', this.employeesequenceno);
      this.authService.getleavesByAction(formdata).subscribe(
        (res: any) => {
         // console.log(res);
          Swal.fire({
            title: 'Success!',
            text: 'Successfully updated!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
    
          this.Assigned(this.Assineddata);
          this.getunassignedleaves(this.UnAssineddata);
        },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while updating the data. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          //console.error('Error details:', error);
        }
      );
    }
 
  }


  get f() { return this.LeaveApplyForm.controls; }
  ViewApply(item:any)
  {
    //console.log("1"+JSON.stringify(item))
    this.leaveDatas(item);
    this.Employeeid=item.Employeeid;
    this.employeesequenceno=item.EmployeeSeq;
    this.experience=item.Experience;
    this.employeemail=item.EMPLOYEEMAIL
    this.manageremail=item.ManagerEmail
    //alert(this.experience);
  }
  leaveDatas(item: any) {
    //alert(item.EmployeeSeq);
    this.emp_Obj =  item.EmployeeSeq;
    this.emp = [{ 'empID': "" + item.EmployeeSeq + "" },{ 'buid': "" + this.userData.user.buid + "" } ];
    this.empObj = this.emp[0]; 
   // console.log(JSON.stringify(this.emp));
    let emp = [{ 'empID': "" +item.EmployeeSeq + "", "application": this.deviceInfo.deviceType }];
    this.emp_Obj =  emp[0];
    this.Assineddata=item;
    this.empData = item;
    // return false
    this.authService.leavequota(this. emp_Obj).subscribe(
      (res) => {
        this.isLoading = false;  
        this.leaveDataInformation = res.LeaveQuota;
      });
      
      this.authService.Leavetypes(this.emp_Obj).subscribe(
        (res) => {        
          this.leaveTypes  = res.Leavetypes;        
        }) 
  }
  // closeVeiwModalApply() {
  //   this.modalType = '';
  //   this.veiwModalApply = false;
  //   this.renderer.removeClass(document.body, 'modal-open');
  //   // this.getApiData();
  //                this.submitted = false;
  //                this.showNotfctn1 = false;
  //                this.showNotfctn = false; 
  //                this.resetLeaveForm();
  //                this.LeaveApplyForm.reset();
  //                this.selectedLeaveType='';
                
  //                this.LeaveApplyForm.get('leaveType')?.setValue('');
  // this.LeaveApplyForm.get('leaveType')?.markAsPristine();
  // this.LeaveApplyForm.get('leaveType')?.markAsUntouched();
  //               // this.ngOnInit();
  // }
  closeVeiwModalApply() {
  this.modalType = '';
  this.veiwModalApply = false;
  this.renderer.removeClass(document.body, 'modal-open');

  this.submitted = false;
  this.showNotfctn1 = false;
  this.showNotfctn = false;

  this.LeaveApplyForm.reset();
  this.LeaveApplyForm.get('leaveType')?.setValue('');

  this.LeaveApplyForm.get('leaveType')?.markAsPristine();
  this.LeaveApplyForm.get('leaveType')?.markAsUntouched();
  this.ngOnInit();
}

  showmyModalApply() {
    this.veiwModalApply = !this.veiwModalApply;
    this.renderer.addClass(document.body, 'modal-open');
  }
  onlyNumbers(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 0 && event.key === '0') {
      event.preventDefault();
      return;
    }
    const regex = /^[0-9]$/;
    if (!regex.test(event.key)) {
      event.preventDefault(); 
    }
    if (input.value.startsWith('0') && input.value.length > 0) {
      event.preventDefault();
    }
  }
  
  applySearchFilter() {
    if (!this.searchText) {
      this.listOfReqsts = this.search;  
      return;
    }
    const searchTextLower = this.searchText.toLowerCase();
    this.listOfReqsts = this.search.filter(item => {
      return (
        item.Employeename && item.Employeename.toLowerCase().includes(searchTextLower) ||
        item.EmployeeSeq && item.EmployeeSeq.toString().toLowerCase().includes(searchTextLower) ||
        item.BUNAME && item.BUNAME.toLowerCase().includes(searchTextLower) ||
        item.Department && item.Department.toLowerCase().includes(searchTextLower) ||
        item.Designation && item.Designation.toLowerCase().includes(searchTextLower)
      );
    
    });
  
  }
  allowOnlyLettersAndSpaces(event: KeyboardEvent) {
    const charCode = event.key;
    const inputField = event.target as HTMLInputElement;
    const inputValue = inputField.value;
    if (charCode === "Backspace") {
      return; 
    }
  
    if (charCode === " " && inputValue.length === 0) {
      event.preventDefault(); 
    } else if (!/^[a-zA-Z0-9\s.]$/.test(charCode)) {
      event.preventDefault(); 
    }
  }
     
  public onOptionsSelected(event) {
   
          this.showNotfctn1 = false;     
          
          if(this.LeaveApplyForm.value.leaveType==this.defaultLeave){
            this.isDatePickerDisabled = true; 
            this.showError = true;
          }else{
            this.isDatePickerDisabled = false; 
            this.showError = false;
          }
         this.LeaveApplyForm.get('fromDate').setValue('');
         this.LeaveApplyForm.get('toDate').setValue('');
         this.resetLeaveForm();
        this.LeaveApplyForm.value.leaveType = event.target['options'][event.target['options'].selectedIndex].text;  
        
        if(this.LeaveApplyForm.value.leaveType == 'ONDUTY'){
          this.showLoctnInputs = true;
        }
        else{
          this.showLoctnInputs = false;
        }
       var x = (event.target['options'].selectedIndex)-1;
      this.selectedLeaveType = this.leaveTypes[x].shortname;
      this.selected_Leave = this.leaveTypes[x].fullname;
     if(this.leaveTypes[x].shortname == 'SL'){   
        if(parseInt(this.leaveTypes[x].bkdays) > parseInt(this.leaveTypes[x].backdate )){
          this.minDateVal =  this.leaveTypes[x].backdate; 
          this.maxDateVal = 0;
         }
         else{
          this.minDateVal = this.leaveTypes[x].bkdays;
         }
     }
     else{
      if(parseInt(this.leaveTypes[x].bkdays) > parseInt(this.leaveTypes[x].backdate )){
        this.minDateVal =  this.leaveTypes[x].backdate; 
     }
     else { 
      this.minDateVal =  this.leaveTypes[x].bkdays;
   }
      this.maxDateVal= 90;
     }      
        this.minDateFrom = new Date(this.myDate);
        this.maxDateFrom = new Date(this.myDate);
        this.minDateTo = new Date(this.myDate);
        this.maxDateTo = new Date(this.myDate); 
        this.enableDates(); 
        this.showNotfctn = false;
     }

    enableDates(){
        this.minDateFrom.setDate(this.minDateFrom.getDate() - this.minDateVal);
        this.maxDateFrom.setDate(this.maxDateFrom.getDate() + this.maxDateVal);      
        
    }
    dateCreated(event){
      
      this.resetLeaveForm();
    this.minDateTo = new Date(this.myDate);
    this.maxDateTo = new Date(this.myDate); 
     var get_date = this.datepipe.transform(this.LeaveApplyForm.value.fromDate, 'yyyy-MM-dd'); 
     let passingObj = {'fromdate': get_date, 'empID': ''+this.employeesequenceno+'', 'leavetype': this.selectedLeaveType};
     
     //let passingObj = {'fromdate': get_date, 'empID': this.userData.user.empID, 'leavetype': this.selectedLeaveType};
     
     this.minDateTo = new Date(get_date);
     this.maxDateTo = new Date(get_date);

     //alert(JSON.stringify(passingObj));
     if(this.LeaveApplyForm.value.fromDate){
 
     this.isLoading = true;

     this.authService.eligibleleaves(passingObj).subscribe(
        (res) => {
          this.isLoading = false;
          // console.log(res);
          var response = res.eligibleleaves[0];
          if(this.selectedLeaveType==response.Shortname){
          this.showNotfctn = true;   
          this.showNotfctn1 = false; 
          
          this.FYFromyear = this.datepipe.transform(get_date, 'yyyy'); 
          // console.log("FromDate Year: "+this.FYFromyear);
        }
        //++++++++ notification or leaves count alert +++++++++++
          if(response.availableQuantity != null && (this.selectedLeaveType == 'CL'|| this.selectedLeaveType == 'SL'|| this.selectedLeaveType == 'EL'|| this.selectedLeaveType == 'MRL' )){
            this.actual_availblLeaves = response.ACTUALAVAIL;
            this.minAvlDtes = response.Min;
            this.maxAvlDates = response.Max;
            this.selctdLeave = response.Shortname;   
          } 
            // alert(this.minDateTo+"-----"+res.eligibleleaves[0].Max);
           // this.minDateTo = new Date(this.LeaveApplyForm.value.fromDate);
           if(this.selectedLeaveType == 'EL'){
            this.minDateTo.setDate(this.minDateTo.getDate() + parseInt(res.eligibleleaves[0].Min)-1); 
           }
           else{           
             this.minDateTo.setDate(this.minDateTo.getDate()-parseInt(res.eligibleleaves[0].Min));  
            }
            if(this.selectedLeaveType == 'MRL' || this.selectedLeaveType == 'CL' || this.selectedLeaveType == 'EL'){
              let theVal = res.eligibleleaves[0].availableQuantity;
              if(theVal == "0.5"){
                theVal=1;
              }
              this.maxDateTo.setDate(this.maxDateTo.getDate()+parseInt(theVal)-1);
            }
            else{
              // this.minDateTo.setDate(this.minDateTo.getDate() + parseInt(get_date)-1);
              this.minDateTo = new Date(get_date);
              // this.maxDateTo.setDate(this.maxDateTo.getDate()+ 29);
              if(this.selectedLeaveType == 'SL'){
                // this.maxDateTo = new Date(get_date);
                let theVal = res.eligibleleaves[0].SL_MX_LEAVE; 
                if(theVal == "0.5"){
                  theVal=1;
                }
                this.maxDateTo.setDate(this.maxDateTo.getDate()+parseInt(theVal)-1);                
              }
              else{
                this.maxDateTo.setDate(this.maxDateTo.getDate()+ 29);
              }
            }

            // resetting toDate input, onclick of fromDate input
            this.LeaveApplyForm.get('toDate').setValue('');

            //  console.log("min-to"+ ":" +this.minDateTo)
            //  console.log("max-to"+ ":" +this.maxDateTo)
        })
      }
    }
    maxDate_Clicks(event){ 
      
      this.resetLeaveForm();
    if(this.LeaveApplyForm.value.fromDate !=''&& this.LeaveApplyForm.value.toDate !=''){
      if(this.selectedLeaveType =="CL"||this.selectedLeaveType=="SL"){
        this.checkFY();
      }
      else{
        this.todateAPIcall();
      }
      }   
    };
    
   public checkFY(){
    this.FYToyear = this.datepipe.transform(this.LeaveApplyForm.value.toDate, 'yyyy'); 
    // console.log("ToDate Year: "+this.FYToyear);
    if(this.FYFromyear!=this.FYToyear){
      this.isLoading = false;
      Swal.fire({  
        icon: 'warning',  
        title: "Calender Year should be same",  
        text: 'Please Check',
        showConfirmButton: true,  
        // timer: 2000  
      }) 
      this.LeaveApplyForm.get('fromDate').setValue('');
       this.LeaveApplyForm.get('toDate').setValue('');
       this.showNotfctn1 = false;
       this.showNotfctn = false;
    }
    else{
      this.todateAPIcall();
    }
   } 

   public todateAPIcall(){
    this.oth_flag = '';
    this.get_params();  
    this.isLoading = true;
    this.authService.applyleave(this.leaveFormData).subscribe(
      (res) => {
        if(res){
          this.isLoading = false;
          this.showNotfctn1 = true;
            this.showNotfctn = false;
            this.notifyMsg = res.leaveapply.Message;
        }
        else{
          this.isLoading = false;
        }
       
      });
   }

    public onDayTypeSelected(event){
        if(this.LeaveApplyForm.value.day_Type == 'Half Day'){
          this.showHlfDayInputs = true;
          this.halfDay = this.datepipe.transform(this.LeaveApplyForm.value.fromDate, 'yyyy-MM-dd');
          this.LeaveApplyForm.get('hlfDay_Date').setValue(this.halfDay); 
        }else{
          this.LeaveApplyForm.get('hlfDay_Date').setValue(''); 
          this.showHlfDayInputs = false;
        }

        this.LeaveApplyForm.value.day_Type = event.target['options'][event.target['options'].selectedIndex].text;  
      let x = this.datepipe.transform(this.LeaveApplyForm.value.fromDate, 'yyyy-MM-dd');
      let y = this.datepipe.transform(this.LeaveApplyForm.value.toDate, 'yyyy-MM-dd'); 
      if(x==y){
        this.halfDayDates = [x]
      }
      if(x!=y){
        this.halfDayDates = [x, y]
      }
      this.LeaveApplyForm.get('hlfDay_Type').setValue(this.halfDayType[0]);
      if(this.LeaveApplyForm.value.fromDate!=''&&this.LeaveApplyForm.value.toDate!=''){
          this.checkingFunctn();
        }
    }  
    
    public halfDayDate(event){      
      let theSelctdOption = event.target['options'][event.target['options'].selectedIndex].text;
      let DateSelctd = this.datepipe.transform(theSelctdOption, 'yyyy-MM-dd');
      this.LeaveApplyForm.get('hlfDay_Date').setValue(DateSelctd); 
       
      this.checkingFunctn();
    }

    public Half_dayType(event){
      let day = event.target['options'][event.target['options'].selectedIndex].text;
      this.LeaveApplyForm.get('hlfDay_Type').setValue(day); 
      this.half_DayType = this.LeaveApplyForm.value.hlfDay_Type;
    }
      selectEvent1(item) {
        let loctn_Val= item.name;
       this.LeaveApplyForm.get('OD_FromLocation').setValue(loctn_Val);
       this.frmLoctn = this.LeaveApplyForm.value.OD_FromLocation;
        if(this.frmLoctn != '' || this.frmLoctn != undefined){
          this.showFromLoctnError = false;
        }
      }     
      onChangeSearch1(val: string) {
        let x = [{"locationname": val}];
        this.authService.locationsearch(x[0]).subscribe(
          (res) => {
            this.data1 = res.locationsearch;
          })        
      }      
      onFocused1(e){
      
      }

      selectEvent2(item) {
       let loctn_Val= item.name;
       this.LeaveApplyForm.get('OD_ToLocation').setValue(loctn_Val);
       this.toLoctn = this.LeaveApplyForm.value.OD_ToLocation;        
        if(this.toLoctn != '' || this.toLoctn != undefined){
          this.showToLoctnError = false;
        }
      }     
      onChangeSearch2(val: string) {
        let y = [{"locationname": val}];
        this.authService.locationsearch(y[0]).subscribe(
          (res) => { 
            this.data2 = res.locationsearch;
          })        
      }      
      onFocused2(e){
      }
      omit_special_char(event)
      {   
         var k;  
         k = event.charCode;  
         return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
      }
      resetLeaveForm(){
        this.halfDayDates = [];
        // this.LeaveApplyForm.value.day_Type= this.dayTypes[0]; 
        // this.half_DayType = '';
        this.LeaveApplyForm.get('day_Type').setValue(this.dayTypes[0]);
        this.LeaveApplyForm.get('hlfDay_Date').setValue('');
        this.LeaveApplyForm.get('hlfDay_Type').setValue(this.halfDayType[0]);
        if(this.LeaveApplyForm.value.day_Type == 'Half Day'){
          this.showHlfDayInputs = true;
        }else{ 
          this.showHlfDayInputs = false;
        }
        this.LeaveApplyForm.get('OD_FromLocation').setValue('');
        this.LeaveApplyForm.get('OD_ToLocation').setValue('');
        this.frmLoctn ='';
        this.toLoctn = '';
        this.LeaveApplyForm.get('reason').setValue(''); 
       }


      get_params(){ 
        var LeaveFrom_date = this.datepipe.transform(this.LeaveApplyForm.value.fromDate, 'yyyy-MM-dd');
        var LeaveTo_date = this.datepipe.transform(this.LeaveApplyForm.value.toDate, 'yyyy-MM-dd');
        let subject= 'Request For '+ this.selected_Leave ;
         if(this.frmLoctn== undefined || this.toLoctn == undefined){
          this.frmLoctn = '';
          this.toLoctn = '';
         }
         if(this.LeaveApplyForm.value.hlfDay_Type == this.halfDayType[0]){
          this.LeaveApplyForm.value.hlfDay_Type = 'false';
         }
         else if(this.half_DayType){
          this.LeaveApplyForm.value.hlfDay_Type = this.half_DayType
         }
         if(this.LeaveApplyForm.value.hlfDay_Date == ''){
          this.LeaveApplyForm.value.hlfDay_Date = '0000-00-00';
         }

         this.oth_flag = 'Y'; 
        
       this.leaveFormData = { 
          'empID': this.emp[0].empID,
          'buid':  this.emp[1].buid,
          'othflag': this.oth_flag,
          // 'empEmail': this.userData.user.proemail,
          'empEmail':this.employeemail,
          'leave_type': this.selectedLeaveType,
          'from_date': LeaveFrom_date,
          'to_date': LeaveTo_date,
          'hal_date': this.LeaveApplyForm.value.hlfDay_Date,
          'halfday': this.LeaveApplyForm.value.hlfDay_Type,
          // 'to_mail': this.userData.Manger[0].mangeremail,
          'to_mail':this.manageremail,
          'cc_mail': '',
          'from_loc': this.frmLoctn,
          'to_loc': this.toLoctn,
          'maxleave': this.maxAvlDates, 
          'reason': this.LeaveApplyForm.value.reason,
          'subject': subject,
          'hr_att': '',
          'hr_att_user': '',
          'compoff': '',
          'comm_date': ''
          };
      };



      checkingFunctn(){
        this.get_params();  
        this.isLoading = true;
        this.authService.applyleave(this.leaveFormData).subscribe(
          (res) => {
            if(res){
              this.isLoading = false;
              // console.log(res);
              this.showNotfctn1 = true;
              this.showNotfctn = false;
              this.notifyMsg = res.leaveapply.Message;
          }       
          else{
            this.isLoading = false;
          }  
        });
      }



      apply_Leave(){
        this.isLoading = true;
        this.get_params(); 
        let x = {'othflag': 'N'}

       // let y = {'empID': 'N'}
        //error.message
        this.leaveFormData= Object.assign(this.leaveFormData,x);
        // console.log(this.leaveFormData)
        this.authService.applyleave(this.leaveFormData).subscribe(
          (res) => {
            if(res){
              this.isLoading = false;
              
              if(res.leaveapply.Flag == '1'){ 
                // alert(res.leaveapply.Message);
                Swal.fire({  
                  icon: 'success',  
                  title: res.leaveapply.Message,  
                  // text: 'Congratulations',
                  showConfirmButton: true,  
                  // timer: 2000  
                })  
                this.getApiData();

                
                this.submitted = false;
                this.showNotfctn1 = false;
                this.showNotfctn = false; 
                this.resetLeaveForm();
                this.selectedLeaveType='';
                this.ngOnInit();
              }
              else{
                this.showNotfctn1 = true;
                this.showNotfctn = false;
                this.notifyMsg = res.leaveapply.Message;
              }
            }            
          });
      }
      
      // submitLeaveForm() { 
      //   this.disableButton = true;
      //   this.submitted = true;   
      //   if(this.LeaveApplyForm.value.leaveType == this.defaultLeave) {
      //     this.showError = true;
      //   }else{
      //     this.showError = false;          
      //   }  
      //   if(this.frmLoctn == '' || this.frmLoctn == undefined){
      //     this.showFromLoctnError = true;
      //   } else{
      //     this.showFromLoctnError = false;
      //   }
      //   if(this.toLoctn == '' || this.toLoctn == undefined){
      //     this.showToLoctnError = true;
      //   } else{
      //     this.showToLoctnError = false;
      //   } 
      //   if (this.LeaveApplyForm.invalid) { 
      //     this.disableButton = false;
      //     return;
         
      //   }else{
      //     let callApi= false;
      //     if(this.selectedLeaveType == 'OD'){
      //       if(this.frmLoctn.trim().length!=0 && this.toLoctn.trim().length!=0){
      //         callApi = true;
      //       }
      //     }
      //     else{
      //       callApi= true;
      //     }
      //     if(callApi){
      //     this.apply_Leave();   
          
      //     this.disableButton = false;
      //           this.ngOnInit();
      //     // this.LeaveApplyForm.get('leaveType').setValue(this.defaultLeave);
      //     // alert("Leave Applied") 
      //   }
      //   else{
      //     // alert('please contact admin')
      //     Swal.fire({  
      //       icon: 'warning',  
      //       title: "Something Went Wrong",  
      //       text: 'Please Contact Admin',
      //       showConfirmButton: true,  
      //       // timer: 2000  
      //     }) 
      //   }
      //   }
      // }
      submitLeaveForm() { 
  this.disableButton = true;
  this.submitted = true;   

  if (this.LeaveApplyForm.value.leaveType == this.defaultLeave) {
    this.showError = true;
  } else {
    this.showError = false;          
  }

  if (!this.frmLoctn || this.frmLoctn.trim() === '') {
    this.showFromLoctnError = true;
  } else {
    this.showFromLoctnError = false;
  }

  if (!this.toLoctn || this.toLoctn.trim() === '') {
    this.showToLoctnError = true;
  } else {
    this.showToLoctnError = false;
  }

  if (this.LeaveApplyForm.invalid) { 
    this.disableButton = false;
    return;
  }

  let callApi = false;
  if (this.selectedLeaveType === 'OD') {
    if (this.frmLoctn.trim().length !== 0 && this.toLoctn.trim().length !== 0) {
      callApi = true;
    }
  } else {
    callApi = true;
  }

  if (callApi) {
    // ✅ Validate emails
   // const empEmail = this.leaveFormData.empEmail;
    const managerEmail = this.leaveFormData.to_mail;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if ( !managerEmail || !emailRegex.test(managerEmail)) {
      // Swal.fire({  
      //   icon: 'warning',  
      //   title: "Employee or Manager email doesn't exist in database",  
      //   text: 'Employee or Manager email is missing or in an incorrect format. Please contact admin.',
      //   showConfirmButton: true
      // });
      Swal.fire({  
      icon: 'warning',  
      title: "Email ID Missing",  
      text: 'Reporting Manager\'s email ID is not available or incorrect. Please update the email ID or contact the administrator.',
       confirmButtonText: 'OK, Got It!'  
});

      this.disableButton = false;
      return;
    }

    this.apply_Leave();   
    this.disableButton = false;
    //this.ngOnInit();

  } else {
    Swal.fire({  
      icon: 'warning',  
      title: "Something Went Wrong",  
      text: 'Please Contact Admin',
      showConfirmButton: true
    }); 
  }
}

}
