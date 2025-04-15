import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/es' ; 

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.sass']
})
export class AttendanceComponent implements  OnInit, OnDestroy {
  loggedUser: any = {};
  userData: any;
  emp: any;
  empObj: any; 
  myDate: any;
  bu:any[]=[];
  locations:any[]=[];
  attendanceform: FormGroup;
  dateColumns: string[] = []
attendanceData: any[] = [];
searchTerm: string = '';
currentPage: number = 1;
itemsPerPage: number = 20;
public isLoading: boolean;
 payPeriodForm: FormGroup;
 fromDate: Date | null = null;
 privileges: any = {};
 authBoolean: boolean;
today: Date = new Date();
 monthList = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

yearList = [new Date().getFullYear() - 1, new Date().getFullYear()];


  constructor(public router: Router,public fb: FormBuilder,public authService:AuthService,private renderer: Renderer2) {  
    this.attendanceform = this.fb.group({
    selectionType: ['', Validators.required],
    location: [''],
    bu: [[]],
   employeeId: [''],
    duration: ['', Validators.required],
    fromDate: [''],
    toDate: ['']
    });
    this.payPeriodForm = this.fb.group({
  isPayPeriodEnabled: [true], 
   selectedMonth: [new Date().getMonth() + 1], 
  selectedYear: [new Date().getFullYear()]   
});
  }
  get durationControl() {
  return this.attendanceform.get('duration');
}
  get isPayPeriodEnabled() {
    return this.payPeriodForm.get('isPayPeriodEnabled')?.value;
  }

  get isLocationBased() {
    return this.attendanceform.get('selectionType')?.value === 'location';
  }
  get isBuBased(){
    return this.attendanceform.get('selectionType')?.value ==='bu';
  }
get isEmpBased(){
    return this.attendanceform.get('selectionType')?.value ==='empid';
  }
  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  this.loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
 this.myDate = decodeURIComponent(window.atob(localStorage.getItem('currentDate')));
  this.userData = JSON.parse(this.loggedUser);
  let device =decodeURIComponent(window.atob(localStorage.getItem('applction'))); 
  let privileges = decodeURIComponent(window.atob(localStorage.getItem('privileges')));
  this.privileges = JSON.parse(privileges).Rights;

    this.emp = [{ 'empID': "" + this.userData.user.empID + "" }];
    this.empObj = this.emp[0];


    this.authBoolean = false;
    for (let i = 0; i < this.privileges.length; i++) {
      if (this.privileges[i].attendance_report === "true"|| this.privileges[i].parent == "1") {
        this.authBoolean = true;
        break;
      }
    }

    if (!this.authBoolean) {
      let x = 'false';
      this.router.navigate(['/errorPage', { AuthrzdUser: x }]);
      return;
    }


    moment.locale('en'); 
    if (this.loggedUser == null || this.loggedUser == undefined) {
      this.router.navigate(['/login'], { replaceUrl: true });
    }
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.getemployeeBusinessUnit();
    this.getLocations(); 
    this.submitAttendance();
    this.validation();
      this.attendanceform.get('selectionType')?.valueChanges.subscribe(value => {
    this.resetDependentFields();
  });
 this.attendanceform.get('duration')?.valueChanges.subscribe((value) => {
  const isPayPeriod = value === 'payperiod';
  this.payPeriodForm.get('isPayPeriodEnabled')?.setValue(isPayPeriod, { emitEvent: false });

  if (isPayPeriod) {
    this.attendanceform.patchValue({
      fromDate: null,
      toDate: null
    });
  } else if (value === 'inbetween') {
    // Clear pay period form fields
    this.payPeriodForm.patchValue({
      isPayPeriodEnabled: false,
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear()
    });
  }
});

this.attendanceform.get('duration')?.valueChanges.subscribe((value) => {
  const isPayPeriod = value === 'payperiod';

  this.payPeriodForm.get('isPayPeriodEnabled')?.setValue(isPayPeriod, { emitEvent: true });

  if (isPayPeriod) {
    this.attendanceform.patchValue({ fromDate: null, toDate: null });
  } else if (value === 'inbetween') {
    this.payPeriodForm.patchValue({
      isPayPeriodEnabled: false,
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear()
    });
  }
});
this.attendanceform.get('employeeId')?.valueChanges.subscribe(value => {
  if (!value || value.length <= 5) {
    this.attendanceform.patchValue({
      duration: '',
      fromDate: '',
      toDate: ''
    });

    this.payPeriodForm.reset({
      isPayPeriodEnabled: true,
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear()
    });
    this.attendanceData = [];
    this.dateColumns = [];
    this.searchTerm = '';
    this.currentPage = 1;
  }
});

}
ngOnDestroy(): void {
  this.renderer.removeStyle(document.body, 'overflow'); // Restores scrollbar when component is destroyed
}
getemployeeBusinessUnit(){
 // alert("1");
  const employeeid=new FormData();
  employeeid.append('empId',this.userData.user.empID);
  this.authService.getemployeeBusinessUnit(employeeid).subscribe(
  (res)=>{
    console.log("bu",res);
   this.bu=res;  
   
  },
  (error) => {
      console.error('Error fetching Business Unit:', error);
    }
  );
}
getLocations(){
  const payload=new FormData();
payload.append('empId',this.userData.user.empID);
  this.authService.getLocations(payload).subscribe(
    (res)=>{
      this.locations=res;
      console.log("locations",res);
    },
  (error) => {
      console.error('Error fetching Business Unit:', error);
    }
  )
}

get filteredMonthList() {
  const selectedYear = +this.payPeriodForm.get('selectedYear')?.value; 
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); 

  if (selectedYear < currentYear) {
    return this.monthList;
  } else if (selectedYear === currentYear) {
    return this.monthList.slice(0, currentMonth + 1);
  } else {
    return [];
  }
}


validation() {
  this.attendanceform.get('selectionType')?.valueChanges.subscribe(val => {
    this.attendanceform.get('location')?.clearValidators();
    this.attendanceform.get('bu')?.clearValidators();
    this.attendanceform.get('employeeId')?.clearValidators();

    if (val === 'location') {
      this.attendanceform.get('location')?.setValidators(Validators.required);
    } else if (val === 'bu') {
      this.attendanceform.get('bu')?.setValidators(Validators.required);
    } else if (val === 'empid') {
      this.attendanceform.get('employeeId')?.setValidators([
    Validators.pattern('^[0-9]{5,7}$')
  ]);
    }

    this.attendanceform.get('location')?.updateValueAndValidity();
    this.attendanceform.get('bu')?.updateValueAndValidity();
    this.attendanceform.get('employeeId')?.updateValueAndValidity();
  });

  this.attendanceform.get('duration')?.valueChanges.subscribe(val => {
    if (val === 'inbetween') {
      this.attendanceform.get('fromDate')?.setValidators(Validators.required);
      this.attendanceform.get('toDate')?.setValidators(Validators.required);
    } else {
      this.attendanceform.get('fromDate')?.clearValidators();
      this.attendanceform.get('toDate')?.clearValidators();
    }

    this.attendanceform.get('fromDate')?.updateValueAndValidity();
    this.attendanceform.get('toDate')?.updateValueAndValidity();
  });
}

submitAttendance() {
  if (this.attendanceform.invalid) {
    this.attendanceform.markAllAsTouched();
    return;
  }
const formValue = this.attendanceform.value;
const payPeriodValue = this.payPeriodForm.value;

const isInBetween = formValue.duration === 'inbetween';
const isPayPeriod = formValue.duration === 'payperiod';

const payload: any = {
  isDataBetween: isInBetween,
  isPayPeriod: isPayPeriod && payPeriodValue.isPayPeriodEnabled,
  callName:this.userData.user.sublocation
};
this.searchTerm = '';
  this.currentPage = 1;
// Add selectionType-based value
if (formValue.selectionType === 'location') {
  payload.location = formValue.location;
}
if (formValue.selectionType === 'bu') {
  payload.bu = formValue.bu;
}
if (formValue.selectionType === 'empid') {
  payload.empId = +formValue.employeeId;
}

if (isPayPeriod) {
  payload.year = payPeriodValue.selectedYear;
  payload.month = payPeriodValue.selectedMonth;
}

if (isInBetween) {
  const from = moment(formValue.fromDate);
  const to = moment(formValue.toDate);

  if (from.isAfter(to)) {
  Swal.fire({
    icon: 'warning',
    title: 'Invalid Date Range',
    text: `'From Date' cannot be after 'To Date'. Please correct the range.`,
    confirmButtonColor: '#0072bc'
  });
  return;
}


  payload.fromDate = from.format('YYYY-MM-DD');
  payload.toDate = to.format('YYYY-MM-DD');
}

// console.log("Final Payload:", payload);
//   console.log('Form Value:', formValue);
//   console.log('Pay Period Value:', payPeriodValue);
//   console.log('Final Attendance Payload:', payload);
//   console.log('Payload Types:', {
//     year: typeof payload.year,
//     month: typeof payload.month,
//     empId: typeof payload.empId
//   });
this.isLoading = true;
// this.authService.getAttendance(payload).subscribe({
//   next: (res) => {
//     if (res.length === 0) {
//       this.isLoading = false;
//       Swal.fire({
//         icon: 'warning',
//         title: 'No Attendance Data',
//         text: 'No attendance data found for the selected filters.',
//         confirmButtonText: 'Ok'
//       });
//     } else {
//       this.attendanceData = res;
//       const keys = Object.keys(res[0]);
//       this.dateColumns = keys.filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k));
//       this.isLoading = false;
//       console.log(res);
//     }
//   },
//   error: (err) => {
//     this.isLoading = false;
//      Swal.fire({
//         icon: 'warning',
//         title: 'No Attendance Data',
//         text: 'No attendance data found for the selected filters.',
//         confirmButtonText: 'Ok'
//       });
//   }
// });

// }
this.authService.getAttendance(payload).subscribe({
  next: (response) => {
    this.isLoading = false;

    if (response.status === 200) {
      const res = response.body;

      if (!res || res.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No Attendance Data',
          text: 'No attendance data found for the selected filters.',
          confirmButtonText: 'Ok'
        });
      } else {
        this.attendanceData = res;
        const keys = Object.keys(res[0]);
        this.dateColumns = keys.filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k));
        console.log(res);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Response',
        text: `Unexpected status code: ${response.status}`,
        confirmButtonText: 'Ok'
      });
    }
  },
  error: (err) => {
    this.isLoading = false;

    const backendMessage =
      err?.error?.message || `Server Error (${err.status}): Something went wrong.`;

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: backendMessage,
      confirmButtonText: 'Ok'
    });
  }
});

}
get filteredData() {
  let filtered = this.attendanceData;

  if (this.searchTerm.trim()) {
    filtered = filtered.filter(item =>
      item.NAME.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.ID.toString().includes(this.searchTerm)
    );
  }
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return filtered.slice(start, start + this.itemsPerPage);
}
get totalRecords(): number {
  return this.attendanceData.filter(item =>
    item.NAME.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    item.ID.toString().includes(this.searchTerm)
  ).length;
}

get totalPages() {
  return Math.ceil(
    (this.attendanceData.filter(item =>
      item.NAME.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.ID.toString().includes(this.searchTerm)
    )).length / this.itemsPerPage
  );
}
get paginationRange(): number[] {
  const total = this.totalPages; 
  const current = this.currentPage;
  const maxVisible = 5;

  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;

  if (end > total) {
    end = total;
    start = Math.max(1, end - maxVisible + 1);
  }

  const range: number[] = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
}

get startRecord(): number {
  return (this.currentPage - 1) * this.itemsPerPage + 1;
}

get endRecord(): number {
  const end = this.currentPage * this.itemsPerPage;
  return end > this.totalRecords ? this.totalRecords : end;
}

get currentPageCount(): number {
  return this.endRecord - this.startRecord + 1;
}
changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}


downloadExcel(): void {
  const selectionType = this.attendanceform.get('selectionType')?.value;
  let selectionLabel = 'Attendance';

  if (selectionType === 'location') {
    const selectedId = this.attendanceform.get('location')?.value;
    const location = this.locations.find(loc => loc.id == selectedId); 
    selectionLabel = location?.name || 'Location';
  } else if (selectionType === 'bu') {
    const selectedId = this.attendanceform.get('bu')?.value;
   
    const buItem = this.bu.find(b => b.id == selectedId);
    selectionLabel = buItem?.NAME || 'BU';
  } else if (selectionType === 'empid') {
    const empId = this.attendanceform.get('employeeId')?.value;
    selectionLabel = empId || 'EmpID';
  }

  const fileName = `${selectionLabel}_Attendance.xlsx`;

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.attendanceData);

  const workbook: XLSX.WorkBook = {
    Sheets: { 'Attendance Report': worksheet },
    SheetNames: ['Attendance Report']
  };

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blobData = new Blob([excelBuffer], { type: 'application/octet-stream' });

  FileSaver.saveAs(blobData, fileName);
}

resetDependentFields() {
  // Reset main form fields
  this.attendanceform.patchValue({
    location: '',
    employeeId: '',
    duration: ''
  });

  // Reset the 'bu' array control to an empty array
  this.attendanceform.controls['bu'].patchValue([]);

  this.payPeriodForm.reset({
    isPayPeriodEnabled: true,
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear()
  });

  this.attendanceform.patchValue({
    fromDate: '',
    toDate: ''
  });
}

bsConfig = {
  adaptivePosition: true,
  showWeekNumbers: false,
  isAnimated: true,
  containerClass: 'theme-green',
  customTodayClass: 'custom-today-class',
  dateInputFormat: 'DD-MMM-YYYY'
};

selectedBu: string[] = [];

// onBuChange(event: any, buId: string) {
//   if (event.target.checked) {
//     this.selectedBu.push(buId);
//   } else {
//     this.selectedBu = this.selectedBu.filter(id => id !== buId);
//   }

//   // Update form control value
//   this.attendanceform.get('bu')?.setValue(this.selectedBu);
// }
onBuChange(event: any, buId: string): void {
    if (event.target.checked) {
      if (!this.selectedBu.includes(buId)) {
        this.selectedBu.push(buId);
      }
    } else {
      const index = this.selectedBu.indexOf(buId);
      if (index > -1) {
        this.selectedBu.splice(index, 1);
      }
    }
    this.attendanceform.get('bu')?.setValue([...this.selectedBu]); // Update FormControl
  }

  isAllSelected(): boolean {
    return this.bu.length > 0 && this.selectedBu.length === this.bu.length;
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      this.selectedBu = this.bu.map(item => item.id.toString());
    } else {
      this.selectedBu = [];
    }
    this.attendanceform.get('bu')?.setValue([...this.selectedBu]);
  }
  
  onSelectionTypeChange(value: string): void {
  if (value !== 'bu') {
    this.selectedBu = [];
    this.attendanceform.get('bu')?.setValue([]);
  }
}
  onNumericInput(event: any): void {
  const value = event.target.value;
  event.target.value = value.replace(/\D/g, ''); // Remove non-digit characters
  this.attendanceform.get('employeeId')?.setValue(event.target.value);
}

}

