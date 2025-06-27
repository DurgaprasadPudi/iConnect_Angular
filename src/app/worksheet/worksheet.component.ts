import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from '../auth.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, Validators,AbstractControl, ValidationErrors, ValidatorFn  } from '@angular/forms';
import { Console } from 'console';
import Swal from 'sweetalert2'; 
import { debounceTime, distinctUntilChanged, switchMap,catchError  } from 'rxjs/operators';
import { BehaviorSubject,Observable,of  } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { RefreshService } from '../refresh.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-worksheet',
 
  templateUrl: './worksheet.component.html',
  styleUrls: ['./worksheet.component.sass'],
})
export class WorksheetComponent implements OnInit {
  loggedUser: any;
  userData: any;
  myDate: any;
  isModalOpen = false;
  isSuccessModal = false;
  privileges: any = {};
  selectedIndex: number = 0;
 categories: any[] = [];
 
 taskAlignment:any[]=[];
 priority:any[]=[];
tasktype:any[]=[];
minToDate: Date;
maxToDate: Date;
submitted = false;
workPlace:any[]=[];
module:any[]=[];
outcome:any[]=[];
activities:any[]=[];
dependentPerson: string = '';
selectedActivity: string = '';  
plannedadhoc:any[]=[];
selectedCategoryId: number | null = null;
filteredActivities: string[] = [];
isConfirmationModalVisible: boolean = false;
isTaskUpdated: boolean = false;
editIndex: number | null = null; 
scrollPosition: number;
worksheetForm: FormGroup;
worksheetFormWithValues:FormGroup;
public getdata: any = {}; 
weeksummary:any[]=[];
teams:any[]=[];
departments:any[]=[];
dependents:any[]=[];
groupedTasks = [];
currentDate: Date = new Date(); 
taskDate: string = ''; 
isVisible: boolean = false;
date:any[]=[];
workDurationCalculation:string='';
isFirstModalVisible: boolean = false; 
isSecondModalVisible: boolean = false;
employeeId: any;
reportingManager : any;
employeename: any;
isLoading:boolean;
 timeBlock: string = '';
showDropdown = false; 
 errorMessage: string = '';
  minFromDate: Date = new Date();
  @ViewChild('viewModal') viewModal!: ElementRef;
  veiwModal: any;
  
  currentYear: any;
  years: any;
  payPeriodDate:any;

  isYearWise: boolean = true;
  worksheetFormData: FormGroup;
  isUploading: boolean = false;

  startOfMonth: any;
  firstDateOfMonth:any;
  // maxToDate: Date = new Date(); 
  worksheetEmployeeById:any=[];
  selectedEmp: any;
  TeamList:any=[];
  search: string = ''; 
  employeelist: any[] = []; 
  SearchList: any[] = []; 
  filteredData: any[] = []; 
  availableMonths: { id: number; name: string }[] = [];
  colorTheme = 'theme-dark-blue';  
  months = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' }
  ];
  currentMonth: any;
results: any[] = [];
authBoolean: boolean;
Ryts: any = {};
worksheet:any;
  private dependentPerson$ = new BehaviorSubject<string>(''); // Holds latest search input
  maxDate: Date;
 
constructor(private refreshService: RefreshService,public http: HttpClient,public authservice: AuthService, private fb:FormBuilder,public router: Router,private renderer: Renderer2, private datePipe: DatePipe) {
    
 this.worksheetForm = this.fb.group({
   employeeId: [''], 
    taskDate: [this.currentDate, Validators.required],
    team: ['',[Validators.required, Validators.maxLength(150)]],
    department: ['',[Validators.required]],
    name: [''],
    timeBlock: ['', [Validators.required, this.timeBlockValidator()]],
    taskDescription: ['',[Validators.required, Validators.maxLength(500)]],
    projectName: ['',[Validators.required, Validators.maxLength(150)]],
    taskAlignmentId: ['', Validators.required],
    dependentPerson: [''],

    categoryId: ['', Validators.required],
    activityId: ['', Validators.required],
    priorityId: ['', Validators.required],
    outcomeId: ['', Validators.required],
    taskTypeId: ['', Validators.required],
    plannedAdhocId: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
     duration: [{ value: '', disabled: true }, Validators.required],
    reportingManager:[''],
    remarks: ['',[Validators.maxLength(500)]],
    module: ['',[Validators.required, Validators.maxLength(50)]],
    workPlace: ['', Validators.required],
   workPlaceId:['']
  });
  }

onKeyDown(event: KeyboardEvent): void {
  if (event.key === "Enter") {
    event.preventDefault();
  }
}

onKeyUp(event: KeyboardEvent): void {
  const dependentPerson = (event.target as HTMLInputElement).value.trim();
  if (dependentPerson.length > 0) {
    this.performSearch(dependentPerson).subscribe();
  } else {
    this.clearSearch();
  }
}

private clearSearch(): void {
  this.dependents = [];
  this.showDropdown = false;
  this.worksheetForm.get('dependentPerson')?.setValue('', { emitEvent: false });
  this.dependentPerson='';
}



  onKeyPress(event: KeyboardEvent): void {
  const dependentPerson = (event.target as HTMLInputElement).value.trim();
  if (dependentPerson.length > 0) {
    this.performSearch(dependentPerson).subscribe();
  } else {
    this.dependents = [];
    this.showDropdown = false;
    this.worksheetForm.get('dependentPerson')?.setValue('', { emitEvent: false });
  }
}

 onInputChange(value: string): void {
    if (value !== this.dependentPerson) {
      this.dependentPerson$.next(value); 
    }
  }
   private performSearch(dependentPerson: string): Observable<any> {
  if (!dependentPerson.trim()) {
    this.clearSearch();
    return of([]); 
  }

  return this.authservice.searchByName(dependentPerson).pipe(
    switchMap((res) => {
      ////console.log(res, "call---");

      if (res && res.length > 0) {
        this.dependents = res;
       // console.log(this.dependents);
        this.showDropdown = true;
      } else {
        this.clearSearch();
      }

      return of(res);
    }),
    catchError((error) => {
      //console.error("Error fetching dependents:", error);
      this.clearSearch();
      return of([]);
    })
  );
}
  selectDependent(dep: any): void {
    const selectedValue = `${dep.name}-${dep.id}`;
    this.dependentPerson = dep.id;
    this.worksheetForm.get('dependentPerson')?.setValue(selectedValue);
    this.showDropdown = false;
    this.dependents = [];
  }
 
  onChange(): void {
  const currentValue = this.worksheetForm.get('dependentPerson')?.value;
  if (currentValue !== this.dependentPerson) {
    this.worksheetForm.get('dependentPerson')?.setValue('');
    this.dependentPerson = '';
  }
}
  

  ngOnInit(): void {
   
    this.maxDate = new Date();
    this.maxDate.setHours(0, 0, 0, 0); 
    if (this.refreshService.checkForRefresh('worksheet')) {
      this.refreshService.refreshData('worksheet');
    } else {
      //console.log('Worksheet refresh already done today');
    }

    this.loggedUser =  decodeURIComponent(window.atob(localStorage.getItem('userData')));

    this.userData = JSON.parse(this.loggedUser); 

   // this.worksheet=this.userData.user.worksheet

    //this.worksheet=this.userData.user.buid

    let worksheesublocation=this.userData.user.sublocation
    let worksheetoffice=this.userData.user.costcenter
   
  console.log(this.userData.user.buid);
    //this.worksheet=this.userData.user.buid

    if (worksheesublocation === "HYD" && worksheetoffice === "OFFICE") {
      this.worksheet = "TRUE";
    } else {
      this.worksheet = "FALSE";
    }


    let x = decodeURIComponent(window.atob(localStorage.getItem('privileges')));
    this.Ryts = JSON.parse(x).Rights;
 
   // //console.log(this.Ryts);
    ////console.log(this.worksheet);
    this.authBoolean = false; 

      if (this.worksheet== "TRUE") {     
        this.authBoolean = true;
      }
    if (this.authBoolean == false) {
      let x = 'false';
      this.router.navigate(['/errorPage', { AuthrzdUser: x }]);
    }

    // Handle search input efficiently
    this.dependentPerson$
      .pipe(
        debounceTime(500), 
        distinctUntilChanged(), 
        switchMap((dependentPerson) => this.performSearch(dependentPerson))
      )
      .subscribe();

 this.currentDate = new Date();
    
   // //console.log(this.userData);
    this.employeeId = this.userData.user.empID;
    this.reportingManager = this.userData.user.reportee;
    this.employeename=this.userData.user.name;
  this.worksheetForm.patchValue({ 
    name: this.employeename,
    employeeId: this.employeeId,
    reportee: this.reportingManager  
  });
    this.myDate = decodeURIComponent(
      window.atob(localStorage.getItem('currentDate'))
    );
    moment.locale('en');

    let privileges = decodeURIComponent(
      window.atob(localStorage.getItem('privileges'))
    );
 
    this.authservice.getTaskAlignment().subscribe((data)=>{
      this.taskAlignment=data;
    })
    this.authservice.getPriority().subscribe((data)=>{
      this.priority=data;
    })

    this.authservice.getTasktype().subscribe((data)=>{
      this.tasktype=data;
    })
    this.authservice.getWorkPlace().subscribe((data)=>{
      this.workPlace=data;
    
    })
    this.authservice.getOutcome().subscribe((data)=>{
      this.outcome=data;
    })
     this.GetTasks(this.employeeId);
      this.GetSummary(this.employeeId);
    this.authservice.getPlannedadhoc().subscribe((data)=>{
        this.plannedadhoc=data;
    })
   
    this.worksheetForm.get('team')?.valueChanges.subscribe(teamId => {
      const departmentControl = this.worksheetForm.get('department');
    
      if (Number(teamId) === 27) {
        departmentControl?.setValidators([Validators.required]);
      } else {
        departmentControl?.clearValidators();
        departmentControl?.setValue(''); 
      }
    
      departmentControl?.updateValueAndValidity();
    });
  
  this.currentYear = new Date().getFullYear();
  this.currentMonth = new Date().getMonth() + 1;
  // this.currentDate = new Date().toISOString().split('T')[0];
  this.firstDateOfMonth = new Date(this.currentYear, this.currentMonth - 1, 1).toISOString().split('T')[0];
  this.maxToDate = new Date();

  this.years = this.generateYears();
  this.availableMonths = this.getAvailableMonths(this.currentYear);

  this.worksheetFormData = this.fb.group({
    year: [this.currentYear],
    month: [this.currentMonth],
    fromDate: [null],
    toDate: [null],
    teamS: [0]
  });

this.worksheetFormData.get('year')?.valueChanges.subscribe((year: number) => {
  this.availableMonths = this.getAvailableMonths(year);

  const selectedMonth = this.worksheetFormData.get('month')?.value;
  const validMonth = this.availableMonths.find(m => m.id === selectedMonth);
  if (!validMonth) {
    this.worksheetFormData.get('month')?.setValue(null);
  }
});
this.worksheetFormData.get('fromDate')?.valueChanges.subscribe((val: string) => {
  if (!val) return;
  this.minToDate = new Date(val);
  const newFromDate = new Date(val);
  this.worksheetFormData.get('toDate')?.setValue(null);
  const allowedMaxToDate = new Date(newFromDate);
  allowedMaxToDate.setMonth(newFromDate.getMonth() + 3);

  const today = new Date();
  const finalMaxToDate = allowedMaxToDate > today ? today : allowedMaxToDate;
  this.maxToDate = finalMaxToDate;

  const selectedToDateRaw = this.worksheetFormData.get('toDate')?.value;
  if (selectedToDateRaw) {
    const selectedToDate = new Date(selectedToDateRaw);
    if (selectedToDate < newFromDate || selectedToDate > finalMaxToDate) {
      this.worksheetFormData.get('toDate')?.setValue(finalMaxToDate.toISOString().split('T')[0]);
    }
  }

  this.validateDateRange();
 // this.getEmployeesWorksheetData();
});

// Watch toDate changes
this.worksheetFormData.get('toDate')?.valueChanges.subscribe(() => {
  this.validateDateRange();
  this.getEmployeesWorksheetData();
});

// React to month change
this.worksheetFormData.get('month')?.valueChanges.subscribe(() => {
  this.getEmployeesWorksheetData();
});

this.getTeams();
this.getEmployeesWorksheetData();
this.worksheetForm.get('team')?.valueChanges.subscribe((teamVal) => {
  if (teamVal == 27) {
    this.loadDepartmentsByReportingId();
  } else {
    this.departments = []; // Clear if team changes to something else
  }
});

  this.loadCategories();
}


selectedTaskId: number | null = null; 

onSubmit() {
 
  
    this.worksheetForm?.markAllAsTouched();
   
    if (this.worksheetForm.valid) {
      const formData = this.worksheetForm.value;
      const employeeId = this.userData.user.empID;
      const reportingManagerId = this.userData.user.reportee.split('-')[0] || "NA";

      const formattedStartTime = moment(formData.startTime, 'HH:mm').format('HH:mm:ss');
      const formattedEndTime = moment(formData.endTime, 'HH:mm').format('HH:mm:ss');

      let duration = '';
      if (formattedStartTime && formattedEndTime) {
        const start = moment(formattedStartTime, 'HH:mm:ss');
        const end = moment(formattedEndTime, 'HH:mm:ss');
        const durationObj = moment.duration(end.diff(start));
        duration = moment.utc(durationObj.asMilliseconds()).format('HH:mm:ss');
      }

      const mappedData = {
        ...formData,
        categoryId: Number(formData.categoryId),
        activityId: Number(formData.activityId),
        priorityId: Number(formData.priorityId),
        outcomeId: Number(formData.outcomeId),
        taskTypeId: Number(formData.taskTypeId),
        plannedAdhocId: Number(formData.plannedAdhocId),
        taskAlignmentId: Number(formData.taskAlignmentId),
        workPlaceId: Number(formData.workPlace),
        team: formData.team,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        duration: duration,
        reportingManager: reportingManagerId,
        dependentPerson: this.dependentPerson,
      };
      if (Number(formData.team) === 27) {
        mappedData.department = formData.department;
      }
      console.log("mapped data",mappedData);
      this.isLoading = true;

    if (this.selectedTaskId) {
        mappedData['sno'] = this.selectedTaskId;
        this.isTaskUpdated = true;
      } else {
        this.isTaskUpdated = false;
      }
      //console.log("mappeddata", mappedData);
      this.authservice.saveWorksheet(mappedData).subscribe(
        (response) => {
          console.log('Task Created:', response);
          this.taskDate = formData.taskDate ? moment(formData.taskDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
          this.resetForm();
          this.isVisible = false;
          this.isLoading = false;
          setTimeout(() => {
            this.isConfirmationModalVisible = true;
          }, 100);

          this.GetTasks(employeeId);
        },
        (error) => this.handleError(error)
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill out all required fields before submitting.',
      });
    }
  }

handleError(error: any) {
  this.isLoading = false;

  const userMessage = error?.error?.message;

  Swal.fire({
    icon: 'error',
    title: 'Oops!',
    text: userMessage,
  });
}


GetTasks(employeeId: any) {
  this.isLoading = true;
  this.authservice.getWorksheet(employeeId).subscribe((data: any) => {
    console.log('API Response:', data); 

    if (Array.isArray(data)) {
      this.getdata = { list: data, workDurationCalculation: '' }; // Ensure structure
    } else {
      this.getdata = {
        list: data.list || [],
        workDurationCalculation: data.workDurationCalculation || ''
      };
    }
    this.isLoading = false;
  }, error => {
    console.error("Error fetching tasks:", error);
    this.isLoading = false;
    this.getdata = { list: [], workDurationCalculation: '' };
  });
}

editTask(task: any) {
  this.openModal();
  this.selectedTaskId = task.sno;
// Convert time from HH:mm:ss to HH:mm
  const formattedStartTime = task.startTime ? moment(task.startTime, 'HH:mm:ss').format('HH:mm') : '';
  const formattedEndTime = task.endTime ? moment(task.endTime, 'HH:mm:ss').format('HH:mm') : '';
   const formattedDuration = task.duration ? moment(task.duration, 'HH:mm:ss').format('HH:mm') : '';

  this.worksheetForm.patchValue({
    ...task,
    sno: task.sno || null,
    workPlace: task.workPlaceId || '',
    dependentPerson: task.dependentPerson ? `${task.dependentPerson} - ${task.dependentPersonName}` : '',
    reportingManager: this.userData.user.reportee || '',
     startTime: formattedStartTime, 
    endTime: formattedEndTime, 
    //department: task.departmentId || '',
   // departmentId: task.departmentId || '',
   department: task.departmentId || '', 
  
    duration: formattedDuration, 
  });
  console.log('Form Values After Patch:', this.worksheetForm.value);
  if (task.categoryId) {
    this.loadActivities(task.categoryId);
  }
}

  GetSummary(employeeId:any){
      this.authservice.getWeekSummary(employeeId).subscribe((data)=>{
      this.weeksummary=data;
     this.groupTasksByDate();
    })
  }
  loadActivities(categoryId: number): void {
  if (categoryId) {
    this.authservice.getActivity(categoryId).subscribe(
      (data) => {
        this.activities = data || [];
        //console.log('Fetched Activities:', this.activities);

        if (this.activities.length === 0) {
        //  console.warn('No activities found for categoryId:', categoryId);
        }
        setTimeout(() => {
          this.worksheetForm.patchValue({
            activityId: this.selectedTaskId ? this.worksheetForm.value.activityId : null,
          });
          this.worksheetForm.get('activityId')?.updateValueAndValidity();
        });
      },
      (error) => {
        //console.error('Error fetching activities', error);
        this.activities = [];
      }
    );
  }
}

 loadCategories(){
    this.authservice.getCategory().subscribe(
      (data)=>{
        this.categories=data;
      }
    )
 }

onCategoryChange() {
  const selectedCategoryId = this.worksheetForm.get('categoryId')?.value;

  if (selectedCategoryId) {
    this.authservice.getActivity(selectedCategoryId).subscribe(
      (data) => {
        this.activities = [...data]; 
        if (this.activities.length > 0) {
          this.worksheetForm.patchValue({ activityId: this.activities[0].id });
        } else {
          this.worksheetForm.patchValue({ activityId: null });
        }
      },
      (error) => {
       // console.error('Error fetching activities', error);
      }
    );
  } else {
    this.activities = [];
    this.worksheetForm.patchValue({ activityId: null });
  }
}

//  selectTab(index: number): void {
//     this.selectedIndex = index;
//      ////console.log('Selected index:', this.selectedIndex); 
//      this.GetTasks(this.employeeId);
//      this.GetSummary(this.employeeId);
//   }
selectTab(index: number): void {
  this.selectedIndex = index;
  this.isYearWise = true;
  this.worksheetFormData.setValue({
    year: this.currentYear,
    month: this.currentMonth,
    fromDate: '',
    toDate: '',
    teamS: 0
  });
  this.GetTasks(this.employeeId);
  this.GetSummary(this.employeeId);
  this.getEmployeesWorksheetData(); // ensure data loads on tab change
}

 onReset(): void {
  this.showDropdown = false;
  ////console.log('Resetting the form...');
  this.worksheetForm.reset({
    taskDate: this.currentDate = new Date(),
    team: '',
    department:'',
    timeBlock: '',
    taskDescription: '',
    projectName: '',
    taskAlignmentId: '',
    dependentPerson: '',
    categoryId: '',
    activityId: '',
    priorityId: '',
    outcomeId: '',
    taskTypeId: '',
    plannedAdhocId: '',
    startTime: '',
    endTime: '',
    duration: '',
    reportingManager: '',
    remarks: '',
    workPlace: '',
    module: ''
  });

 // console.log('Form after reset:', this.worksheetForm.value);

  // Then, patch the necessary values
  this.worksheetForm.patchValue({
    name: this.employeename,
    employeeId: this.employeeId,
    reportee: this.reportingManager
  });

  ////console.log('Form after patch:', this.worksheetForm.value);
}

onTimeChange(): void {
  const startTime = this.worksheetForm.get('startTime')?.value;
  let endTime = this.worksheetForm.get('endTime')?.value;

  if (!startTime) return;

  const start = moment(startTime, 'HH:mm');
  const end = moment(endTime, 'HH:mm');
if (!startTime || !endTime) {
    this.worksheetForm.patchValue({ duration: '' }); 
    return;
  }
  const minDuration = moment.duration(1, 'minute');
  if (end.isBefore(start) || end.diff(start) < minDuration.asMilliseconds()) {
    
    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: `The end time (${endTime}) must be greater than the start time (${startTime}).`,
    });
    
    this.worksheetForm.patchValue({ duration: '' });
    this.worksheetForm.patchValue({ endTime: '' }); 
    return;
  }
  const duration = moment.duration(end.diff(start));
  const formattedDuration = moment.utc(duration.asMilliseconds()).format('HH:mm');
  this.worksheetForm.patchValue({ duration: formattedDuration });
}
openModal() {
  const reportingManagerId = this.userData.user.reportee.split('-')[0] || "NA";

  this.authservice.TeamsDisplay(reportingManagerId,this.userData.user.empID).subscribe(
    (teamData) => {
      this.teams = teamData; 
      this.isVisible = true; 
    },
    (error) => {
      Swal.fire('Error', 'Failed to fetch team data', 'error');
    }
  );
}
loadDepartmentsByReportingId(): void {
  // Don't redeclare parameter or variable with same name!
  const reportingManagerId = this.userData?.user?.reportee?.split('-')[0] || 'NA';

  if (reportingManagerId !== 'NA') {
    this.authservice.getDepartmentDisplay(reportingManagerId).subscribe({
      next: (res) => {
        this.departments = res || [];
        console.log("Departments loaded:", this.departments);
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        this.departments = [];
      }
    });
  }
}


closeModal() {
  this.isVisible = false;
  this.resetForm(); 
  this.selectedTaskId = null; 
}

closeConfirmationModal() {
  this.isConfirmationModalVisible = false;
}
openSubmitModal() {
  this.isFirstModalVisible = true;
}
closeModal1() {
  this.isFirstModalVisible = false;
  this.isSecondModalVisible = false;
  this.isConfirmationModalVisible = false;
}
proceedToNextModal() {
  this.isFirstModalVisible = false;
  this.isSecondModalVisible = true; 
  this.isLoading=true;
  if (this.userData.user.empID) {
    
    this.authservice.userApproval(this.userData.user.empID).subscribe({
  next: (response:any) => {
     // //console.log('Approval submitted successfully:', response);
      //this.GetTasks(this.userData.user.empID); // Fetch updated tasks
    this.selectTab(1);
    this.isLoading=false;
   // this.GetSummary(this.userData.user.empID);   
    
  },
  error: (error) => {
    //console.error(`Approval submission returned an unexpected status: ${error.status}`);
  }
});

  } else {
    //console.warn('No employeeId provided for approval.');
  }
  }
    groupTasksByDate(): void {
    const grouped = {};
    for (let task of this.weeksummary) {
      if (!grouped[task.taskDate]) {
        grouped[task.taskDate] = [];
      }
      grouped[task.taskDate].push(task);
    }

   this.groupedTasks = Object.keys(grouped)
    .sort((a, b) => moment(b, 'YYYY-MM-DD').valueOf() - moment(a, 'YYYY-MM-DD').valueOf()) // Sort by date in descending order
    .map(date => ({
      taskDate: date,
      tasks: grouped[date],
    }));
  }
  
  preventFutureDates(event: any) {
    const selectedDate = new Date(event.target.value);
    const today = new Date();
    if (selectedDate > today) {
      event.target.value = this.currentDate;  // Reset the input to today's date
       Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Future dates are not allowed!',
        confirmButtonText: 'OK'
      });
    }
  }

deleteTask(sno: number): void {
    
Swal.fire({
  title: 'Are you sure?',
  text: 'Do you want to delete this task?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#d33',
  cancelButtonColor: '#3085d6',
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'Cancel',
 reverseButtons: true,
}).then((result) => {
      
    if (result.isConfirmed) {
      this.isLoading=true;
      this.authservice.deleteTask(sno).subscribe({
        next: (response) => {
          Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
          this.isLoading=false;
        },
    error: (error) => {
    if (error.status === 200) {
    //   //console.log("Error condition met!");  // Confirm condition is met
    Swal.fire('success', 'Task deleted successfully.', 'success');
      this.GetTasks(this.userData.user.empID); 
        this.isLoading=false;
    } else {
      //console.warn(`Approval submission returned an unexpected status: ${error.status}`);
        this.isLoading=false;
    }
  }
  });
}
});
}

bsConfig = {
    dateInputFormat: 'YYYY-MM-DD',
    isAnimated: true,
    adaptivePosition: true,
    showWeekNumbers: false,
    containerClass: 'theme-blue',
    minDate: new Date(2024, 0, 1), // Minimum allowed date (e.g., 1900)
    maxDate: new Date() // Prevents selecting future dates
  };

  onDateChange(selectedDate: Date) {
    const today = new Date();

    if (selectedDate > today) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Future dates are not allowed!',
        confirmButtonText: 'OK'
      });
      this.currentDate = new Date();
    }
  
  }restrictInvalidCharacters(event: KeyboardEvent): void {
  // Allow only digits (0-9) and dash ('-')
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  if (!allowedKeys.includes(event.key)) {
    event.preventDefault(); 
  }
}
KeyPress(event: KeyboardEvent): void {
  const inputChar = event.key;
  if (!/^[0-9]$/.test(inputChar)) {
    event.preventDefault();
  }
}
 generateTimeOptions(): void {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) { // Change step if needed
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        this.allTimes.push(`${formattedHour}:${formattedMinute}`);
      }
    }
  }
 allTimes: string[] = [];
  selectedTime: string = '';
  selectTime(time: string): void {
    this.selectedTime = time;
    this.showDropdown = false;
  }
validateTimeBlock(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  if (value.length > 2) {
    input.value = value.slice(0, 2);
  }
  const numValue = Number(input.value);
  if (!input.value || numValue < 1 || numValue > 24) {
     Swal.fire({
      icon: 'error',
      title: 'Invalid Input!',
      text: 'Please enter a TimeBlock between 1 and 24 only.',
    });
    input.value = ''; 
  }
}


KeyValidation(event: KeyboardEvent): void {
  const charCode = event.charCode;
  // Allow only digits, a single dot for decimals, colon for time format, and control keys (Backspace, Tab, etc.)
  if (
    (charCode >= 48 && charCode <= 57) ||  // Digits
    charCode === 46 ||  // Period (.)
    charCode === 58 ||  // Colon (:)
    charCode === 8 ||   // Backspace
    charCode === 9      // Tab
  ) {
    return;
  } else {
    event.preventDefault(); // Block invalid input
  }
}  


DecimalInput(event: KeyboardEvent): void {
  const inputChar = event.key;
  const currentValue = (event.target as HTMLInputElement).value;
  if (!/[\d\.]/.test(inputChar)) {
    event.preventDefault();
  }
  if (inputChar === '.' && currentValue === '') {
    event.preventDefault();
    return;
  }
  const parts = currentValue.split('.'); 

  if (parts[0].length >= 2 && /\d/.test(inputChar) && !currentValue.includes('.')) {
    event.preventDefault();
    return;
  }
  if (parts.length === 2 && parts[1].length >= 2 && /\d/.test(inputChar)) {
    event.preventDefault();
    return;
  }

  // Prevent "00.00"
  if ((currentValue === '00.0') && inputChar === '0') {
    event.preventDefault(); // Prevent entering "0" after "00.0"
    return;
  }

  // Prevent second period (.) in the input.
  if (inputChar === '.' && currentValue.includes('.')) {
    event.preventDefault(); // Prevent second period.
    return;
  }

  // Clear input if just a period (.) is entered alone
  if (currentValue === '.') {
    (event.target as HTMLInputElement).value = ''; // Clear the input field
    return;
  }
}

 
preventPaste(event: ClipboardEvent): void {
  event.preventDefault(); // Disable paste action.
 // alert("Pasting is not allowed!");
}

validationsTimeBlock(event: Event): void {
  const input = (event.target as HTMLInputElement).value;

  // Regular expression for:
  // 1. Preventing leading zeroes or improper decimal input like "0.00", "00.00"
  // 2. Preventing invalid time-like input formats such as "00:00", "0:00", "00:0"
  const regex = /^(?!0(\.0{1,2})?$|\d{1,2}(:\d{2})?$)\d{1,2}(\.\d{1,2})?$/;

  if (input && !regex.test(input)) {
    // If invalid input, provide feedback and set a custom validity message
    (event.target as HTMLInputElement).setCustomValidity('Please enter a valid number or time format (1-24 hours, e.g., 2.5 or 2:30)');
  } else {
    // Reset custom validity if the input is valid
    (event.target as HTMLInputElement).setCustomValidity('');
  }
}
 
 
validateDecimalInput(event: KeyboardEvent): void {
  const inputChar = event.key;
  const currentValue = (event.target as HTMLInputElement).value;
 
  // Allow numbers (0-9), period (.), and colon (:)
  if (!/[\d\.\:]/.test(inputChar)) {
    event.preventDefault(); // Prevent anything other than numbers, period, or colon.
  }
 
  // Prevent period (.) or colon (:) at the start of the input.
  if ((inputChar === '.' || inputChar === ':') && currentValue === '') {
    event.preventDefault(); // Prevent period or colon at the start.
    return;
  }
  const parts = currentValue.split(/[\.:]/); 
  if (parts[0].length >= 2 && /\d/.test(inputChar) && !currentValue.includes('.') && !currentValue.includes(':')) {
    event.preventDefault(); 
    return;
  }
 
  if (parts.length === 2 && parts[1].length >= 2 && /\d/.test(inputChar)) {
    event.preventDefault(); 
    return;
  }
 if ((currentValue === '00.0' || currentValue === '00:0') && inputChar === '0') {
    event.preventDefault(); 
    return;
  }
   if ((currentValue === '00.0' || currentValue === '00:0') && /[1-9]/.test(inputChar)) {
    return;
  }
  if ((inputChar === '.' || inputChar === ':') && currentValue.includes(inputChar)) {
    event.preventDefault(); 
    return;
  }
  if (currentValue === '.' || currentValue === ':') {
    (event.target as HTMLInputElement).value = ''; 
    return;
  }
}
  validateInput(): boolean  {
  const input = <HTMLInputElement>document.getElementById('timeblock');
  // Regular expression to reject invalid formats and allow time-like input like 0:01:
  // Disallows:
  // Numeric formats like 0.00, 00.0, 00., 0., .00, .0, 00.00, 00, etc.
  // Time-like formats such as 0:00, 00:0, 00:00, 0:, :00, etc.
  const regex = /^(?!0(\.0+)?$)(?!00(\.0+)?$)(?!0:|:0|00:|0:0|00:0|00:00$)(?!\.0$)(?!\.00$)(\d+(\.\d+)?|\.\d+|(\d{1,2}:\d{2}))$/;

  // Check the input against the regex pattern
  if (!regex.test(input.value)) {
      //alert('Invalid input. Please enter a valid number or time (no leading zeros, invalid decimals, or time-like formats).');
  
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input!',
        text: 'Time Block (Duration)* Invalid input. Please enter a valid number or time (no leading zeros, invalid decimals, or time-like formats).',
      });
      return false; 
    }

    return true; 
}
      timeBlockValidator(): ValidatorFn {
    const regex = /^(?!0(\.0+)?$)(?!00(\.0+)?$)(?!0:|:0|00:|0:0|00:0|00:00$)(?!\.0$)(?!\.00$)(\d+(\.\d+)?|\.\d+|(\d{1,2}:\d{2}))$/;
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && !regex.test(control.value)) {
        return { invalidTimeBlock: 'Time Block (Duration) format should be valid(hh.mm). Please enter a valid number or time (e.g., 1:30, 0.5, or 2.00) without leading zeros, invalid decimals, or time-like formats like 00.00, 0.00' };
      }
      return null; 
    };
  }
  getOutcomeClass(outcomeName: string): string {
    switch (outcomeName) {
      case 'InProgress':
        return 'in-progress';
      case 'Completed':
        return 'completed';
      case 'Issues':
        return 'issues';
      case 'Need Guidance':
        return 'need-guidance';
      case 'Hold':
        return 'hold';
      default:
        return '';
    }
}

  validateDateRange() {
    const fromDateValue = this.worksheetFormData.get('fromDate')?.value;
    const toDateValue = this.worksheetFormData.get('toDate')?.value;
    if (fromDateValue && toDateValue) {
      const fromDate = new Date(fromDateValue);
      const toDate = new Date(toDateValue);
      if (toDate < fromDate) { 
        alert('To Date cannot be earlier than From Date.');
        this.worksheetFormData.get('toDate')?.setValue(null);
      }
    }
  }
  generateYears(): number[] {
    let yearsArray: number[] = [];
    let currentYear = new Date().getFullYear();
    let startYear = 2025;
    for (let year = startYear; year <= currentYear; year++) {
      yearsArray.push(year);
    }
    return yearsArray;
  }

  getAvailableMonths(selectedYear: number): { id: number; name: string }[] {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (selectedYear < currentYear) {
      return this.months;
    } else if (selectedYear === currentYear) {
      return this.months.filter(month => month.id <= currentMonth);
    } else {
      return [];
    }
  }

getWorksheetDownload(): void {
  let fromDate = this.worksheetFormData.get('fromDate')?.value;
  let toDate = this.worksheetFormData.get('toDate')?.value;
  const selectedTeam = this.worksheetFormData.get('teamS')?.value;
  //alert(selectedTeam)
  const formData = new FormData();
  if (this.isYearWise) {
    formData.append('employeeid', this.userData.user.empID);
    formData.append('year', this.worksheetFormData.value.year);
    formData.append('month', this.worksheetFormData.value.month);
    formData.append('formDate', null);
    formData.append('toDate', null);
    formData.append('teamS', selectedTeam);
    this. payPeriodDate = `${ this.worksheetFormData.value.year}Y-${this.worksheetFormData.value.month}M`;
  } else {
    fromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    toDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');
    formData.append('employeeid', this.userData.user.empID);
    formData.append('year', '0');
    formData.append('month', '0');
    formData.append('formDate',fromDate);
    formData.append('toDate', toDate);
    formData.append('teamS', selectedTeam);
    //alert(this.worksheetForm.value.fromDate); 
    //alert(this.worksheetForm.value.toDate);  
    this. payPeriodDate = `${fromDate} & ${toDate}`;
  }

  this.isUploading = true;
  this.authservice.getWorksheetDownload(formData).subscribe(
    (res: Blob) => {
      const fileURL = window.URL.createObjectURL(res);
      const link = document.createElement('a');
       link.href = fileURL;
      link.download = `${this.payPeriodDate}_worksheet_report.xlsx`;
      link.click();
      this.isUploading = false;
      window.URL.revokeObjectURL(fileURL);
      Swal.fire({
        title: 'Success!',
        text: 'Successfully Downloaded!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    
     
      this.resetForm();
   
    },
    (error) => {
      this.isUploading = false;
      if (error.status === 404) {
        Swal.fire({
          title: 'No Data Found',
          text: 'No data found for the given dates '+ this. payPeriodDate,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else if (error.status === 403) {
        Swal.fire({
          title: 'Access Denied',
          text: 'You do not have permission to access this data.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while downloading the file.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  );
}
resetForms(){
  this.filteredData=[];
  this.getEmployeesWorksheetData();

}
onReportTypeChange(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const selectedTeam = this.worksheetFormData.get('teamS')?.value;
  this.errorMessage = '';
  this.submitted = false;
  this.isYearWise = selectElement.value === 'yearwise';
  this.worksheetFormData.setValue({
    year: this.currentYear,
    month: this.currentMonth,
    fromDate: '',
    toDate: '',
    teamS: selectedTeam
  });
  this.worksheetFormData.get('fromDate')?.markAsUntouched();
  this.worksheetFormData.get('fromDate')?.markAsPristine();
  this.worksheetFormData.get('toDate')?.markAsUntouched();
  this.worksheetFormData.get('toDate')?.markAsPristine();
  if (this.isYearWise) {
    this.worksheetFormData.get('year')?.markAsTouched();
    this.worksheetFormData.get('month')?.markAsTouched();
  }

  this.getEmployeesWorksheetData();
}

getEmployeesWorksheetData() {
  const fromDateControl = this.worksheetFormData.get('fromDate');
  const toDateControl = this.worksheetFormData.get('toDate');
 if (fromDateControl?.value && !toDateControl?.value) {
  this.errorMessage = 'Please provide To Date.';
  this.submitted = true;
  return;
}
  const fromDate = fromDateControl?.value;
  const toDate = toDateControl?.value;
  if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
    this.errorMessage = 'From Date should not be greater than To Date.';
    return;
  }
  this.isLoading = true;
  const selectedMonth = this.worksheetFormData.get('month')?.value;
  const selectedTeam = this.worksheetFormData.get('teamS')?.value;
  const formData = new FormData();
  if (this.isYearWise) {
    formData.append('employeeid', this.userData.user.empID);
    formData.append('year', this.worksheetFormData.value.year);
    formData.append('month', selectedMonth);
    formData.append('formDate', null);
    formData.append('toDate', null);
    formData.append('teamS', selectedTeam);
    //this.payPeriodDate = `${this.worksheetFormData.value.year}Y-${selectedMonth}M`;
  } else {
    const transformedFromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    const transformedToDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');
    formData.append('employeeid', this.userData.user.empID);
    formData.append('year', '0');
    formData.append('month', '0');
    formData.append('formDate', transformedFromDate);
    formData.append('toDate', transformedToDate);
    formData.append('teamS', selectedTeam);
    //this.payPeriodDate = `${transformedFromDate}-${transformedToDate}`;
  }
  this.authservice.getWorksheetEmployees(formData).subscribe(
    (res: any) => {
      this.employeelist = res;
      console.log(  this.employeelist)
      this.SearchList = res;
      this.filteredData = [...this.employeelist];
      this.isLoading = false;
    },
    (error) => {
      this.isLoading = false;
      if (error.status === 404) {
        this.errorMessage = error.error.message
          ? error.error.message + ' '
          : 'No Data Found.';
      } else if (error.status === 500) {
        this.errorMessage = 'Internal Server Error. Please try again later.';
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
      this.filteredData = [];
    }
  );
}


showmyModal() {
  this.scrollPosition = window.pageYOffset;
  this.veiwModal = !this.veiwModal;
  this.renderer.addClass(document.body, 'modal-open');
  setTimeout(() => {
    const modalElement = document.getElementById('veiwModal');
    if (modalElement) {
      modalElement.focus();
      const scrollableDiv = modalElement.querySelector('.table-responsive');
      if (scrollableDiv) {
        scrollableDiv.scrollTop = 0;
        scrollableDiv.scrollLeft = 0;
      }
    }
  }, 0); 
  window.scrollTo(0, 0);
}
View(emp:any)
{
  this.selectedEmp = emp;
  this.veiwModal = true;
  let fromDate = this.worksheetFormData.get('fromDate')?.value;
  let toDate = this.worksheetFormData.get('toDate')?.value;
  const formData = new FormData();
  if (this.isYearWise) {
    formData.append('employeeid',this.selectedEmp?.employeeId );
    formData.append('year', this.worksheetFormData.value.year);
    formData.append('month', this.worksheetFormData.value.month);
    formData.append('formDate', null);
    formData.append('toDate', null);
  } else {
    fromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    toDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');
    formData.append('employeeid', this.selectedEmp?.employeeId );
    formData.append('year', '0');
    formData.append('month', '0');
    formData.append('formDate', fromDate ?? '');
    formData.append('toDate', toDate ?? '');  
  }
  this.authservice.getWorksheetDataByEmployeeId(formData).subscribe((res:any)=>{
    //console.log("worksheetbyid",res);
    this.worksheetEmployeeById=res;
    this.isLoading = false;
  })
  //alert(this.experience);
}

closeVeiwModal() {
  this.veiwModal = false;
    document.body.style.overflow = 'auto'; 
    window.scrollTo(0, 0);
  this.renderer.removeClass(document.body, 'modal-open');
}

applySearchFilter(): void {
 // console.log('Search input:', this.search);
  if (!this.search) {
    this.filteredData = [...this.SearchList]; 
  } else {
    const searchTermLowerCase = this.search.toLowerCase().trim(); 

    this.filteredData = this.SearchList.filter((item: any) => {
      return (
        item.employeeId.toString().includes(searchTermLowerCase) || 
        item.callName.trim().toLowerCase().includes(searchTermLowerCase)||
        item.teamName.trim().toLowerCase().includes(searchTermLowerCase)
      );
    });
   
  }
 this. errorMessage = '';
 
}
preventFirstSpace(event: KeyboardEvent) {
  if (!this.search && event.code === 'Space') {
    event.preventDefault();
  }
}

getTeams(){
  const formData = new FormData();
  formData.append('employeeid', this.userData.user.empID);
  this.authservice.getTeamsByEmployeeid(formData).subscribe((res:any)=>{
    this.TeamList=res;
  })
}
employeeDownload(empid:any) {
//alert(empid)
  let fromDate = this.worksheetFormData.get('fromDate')?.value;
  let toDate = this.worksheetFormData.get('toDate')?.value;
  const formData = new FormData();

  if (this.isYearWise) {
    formData.append('employeeid', empid);
    formData.append('year', this.worksheetFormData.value.year);
    formData.append('month', this.worksheetFormData.value.month);
    formData.append('formDate', '');
    formData.append('toDate', '');
  } else {
    fromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    toDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');
    formData.append('employeeid',empid);
    formData.append('year', '0');
    formData.append('month', '0');
    formData.append('formDate', fromDate ?? '');
    formData.append('toDate', toDate ?? '');
  }

  this.isUploading = true;

  this.authservice.getSelfDownload(formData).subscribe(
    (res: Blob) => {
      const fileURL = window.URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `${empid}_worksheet_report.xlsx`;
      link.click();
      window.URL.revokeObjectURL(fileURL);
      this.isUploading = false;

      Swal.fire({
        title: 'Success!',
        text: 'Successfully Downloaded!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      this.resetForm();
    },
    (error) => {
      this.isUploading = false;
      if (error.status === 404) {
        Swal.fire({
          title: 'No Data Found',
          text: 'No data found for the given year and month.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else if (error.status === 403) {
        Swal.fire({
          title: 'Access Denied',
          text: 'You do not have permission to access this data.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while downloading the file.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  );
}
handleViewClick(emp: any): void {
  if (!this.worksheetFormData.get('toDate')?.value) return;

  this.showmyModal();
  this.View(emp);
}

resetForm() {
  const selectedTeam = this.worksheetFormData.get('teamS')?.value;

  this.onReset();
  this.selectedTaskId = null; 
  this.worksheetFormData.reset({
    year:this.currentYear,
    month: this.currentMonth,
    fromDate:null,
    toDate:null,
    teamS:selectedTeam,
    department: '',
  });
 this.getEmployeesWorksheetData();
  
}

}
