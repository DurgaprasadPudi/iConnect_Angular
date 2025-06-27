import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth.service';
import * as moment from 'moment';
 
@Component({
  selector: 'app-master-report',
  templateUrl: './master-report.component.html',
  styleUrls: ['./master-report.component.sass']
})
export class MasterReportComponent implements OnInit {
  loggedUser: any = {};
  userData: any;
  myDate:any;
  empObj:any;
  Ryts:any= {};
  selectedLocation: string = '';
  employees: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  searchEmpId: string = '';
  searchName: string = '';
 
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  isLoading:boolean= false;
  statusCodes: any[] = [];
selectedStatusCodes: number[] = [];
BUNames: any[] = []; 
selectedBUName: number[] = []; 
sublocation:any;
  constructor(private http: HttpClient,private authservice:AuthService) {}
 
  ngOnInit(): void {
    this.loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(this.loggedUser);
   this.sublocation=this.userData.user.sublocation;
    //this.fetchEmployees();
   this.getStatusCodes();
   this.getBUNames();
  }

  getBUNames(): void {
    const formData = new FormData();
    formData.append('empId', String(this.userData.user.empID));

  //console.log("empid",this.userData.user.empID)
    this.authservice.getemployeeBusinessUnit(formData).subscribe({
      next: (res) => {
        this.BUNames = res || [];
    //    console.log("bunames",this.BUNames)
      },
      error: (err) => {
        console.error('Failed to load business units', err);
      }
    });
  }
  
  getStatusCodes() {
    this.authservice.getStatusCodes().subscribe(
      (res) => {
        this.statusCodes = res;
      },
      (err) => {
        console.error('Failed to load status codes', err);
      }
    );
  }

  isAllStatusSelected(): boolean {
    return this.statusCodes.length > 0 && this.selectedStatusCodes.length === this.statusCodes.length;
  }
  
  toggleSelectAllStatus(event: any): void {
    if (event.target.checked) {
      this.selectedStatusCodes = this.statusCodes.map(s => s.id);
    } else {
      this.selectedStatusCodes = [];
    }
  }
  
  onStatusCheckboxChange(event: any): void {
    const id = +event.target.value;
    if (event.target.checked) {
      if (!this.selectedStatusCodes.includes(id)) {
        this.selectedStatusCodes.push(id);
      }
    } else {
      this.selectedStatusCodes = this.selectedStatusCodes.filter(code => code !== id);
    }
  }
  isAllBUSelected(): boolean {
    return this.BUNames.length > 0 && this.selectedBUName.length === this.BUNames.length;
  }
  
  toggleSelectAllBU(event: any): void {
    this.selectedLocation = '';
  
    if (event.target.checked) {
      this.selectedBUName = this.BUNames.map(bu => bu.id);
    } else {
      this.selectedBUName = [];
    }
  }
  
  onBUCheckboxChange(event: any): void {
    const id = +event.target.value;
    this.selectedLocation = '';
  
    if (event.target.checked) {
      if (!this.selectedBUName.includes(id)) {
        this.selectedBUName.push(id);
      }
    } else {
      this.selectedBUName = this.selectedBUName.filter(buId => buId !== id);
    }
  }
  fetchEmployees(): void {
    const payload: any = {};

    if (this.selectedLocation) {
      payload.location = this.selectedLocation;
    }
    else if (this.selectedBUName.length > 0) {
      payload.bu = this.selectedBUName; 
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Please select a Location or Businessunit',
        // toast: true,
        // position: 'top-end',
        // timer: 2000,
        showConfirmButton: false
      });
      return;
    }
  
    // Add status filters if present
    if (this.selectedStatusCodes.length > 0) {
      payload.status = this.selectedStatusCodes;
    }
  
    this.isLoading = true;
  
    this.authservice.getMasterDetails(payload).subscribe(
      (res) => {
        this.employees = res || [];
        this.filteredData = [...this.employees];
        this.updatePaginatedData();
        this.isLoading = false;
      },
      (err) => {
        console.error('Error fetching data:', err);
        this.isLoading = false;
      }
    );
  }
  
  // fetchEmployees(): void {
  //   const payload: any = {
  //     location: this.selectedLocation || '',
  //     bu: this.selectedBUName.length > 0 ? this.selectedBUName.map(id => id.toString()) : [],
  //     status: this.selectedStatusCodes.length > 0 ? this.selectedStatusCodes.map(id => id.toString()) : []
  //   };
  
  //   // Validate at least one of location or BU is selected
  //   if (!payload.location && payload.bu.length === 0) {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'Please select a Location or BU',
  //       toast: true,
  //       position: 'top-end',
  //       timer: 2000,
  //       showConfirmButton: false
  //     });
  //     return;
  //   }
  
  //   this.isLoading = true;
  
  //   this.authservice.getMasterDetails(payload).subscribe(
  //     (res) => {
  //       this.employees = res || [];
  //       this.filteredData = [...this.employees];
  //       this.updatePaginatedData();
  //       this.isLoading = false;
  //     },
  //     (err) => {
  //       console.error('Error fetching data:', err);
  //       this.isLoading = false;
  //     }
  //   );
  // }
  
 
  onLocationChange(): void {
    this.selectedStatusCodes = [];
    this.searchTerm = '';
    this.employees = [];
    this.filteredData = [];
    this.paginatedData = [];
    this.currentPage = 1;
    this.selectedBUName = [];
  }
  
 
  updatePaginatedData() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize) || 1;
 
    // Ensure currentPage is in valid range
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
 
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }
  safeChangePage(page: number | string) {
    if (this.isNumber(page)) this.changePage(page);
  }
isNumber(value: number | string): value is number {
  return typeof value === 'number';
}
 
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedData();
  }
 
  totalPagesArray(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
 
    if (total <= 10) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
 
    pages.push(1);
 
    if (current > 4) {
      pages.push('...');
    }
 
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
 
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
 
    if (current < total - 3) {
      pages.push('...');
    }
 
    pages.push(total);
 
    return pages;
  }
 
 
  allColumns: string[] = [
    'empId',
    'name',
    'status',
    'costCenter',
    'gender',
    'employmentType',
    'incrementType',
    'lastWorkingDay',
    'dob',
    'doj',
    'division',
    'designation',
    'department',
    'reportee',
    'reporteeStatus',
    'bankName',
    'ifsc',
    'accountNo',
    'proEmail',
    'pEmail',
    'pfNo',
    'esiNo',
    'pfUan',
    'state',
    'hq',
    'region',
    'professionalMobile',
    'personalMobile',
    'personalPhone',
    'communicationAddress',
    'communicationAddress2',
    'communicationAddress3',
    'communicationAddress4',
    'commCity',
    'commState',
    'commZip',
    'permanentAddress',
    'permanentAddress2',
    'permanentAddress3',
    'permanentAddress4',
    'pCity',
    'pState',
    'pZipCode',
    'passportNo',
    'aadhaarCardNo',
    'aadhaarUid',
    'aadhaarName',
    'pan',
    'imprestAmt',
    'educationDetails',
    'prevExp',
    'curExp',
    'effectiveDate',
    'gross',
    'basic',
    'vda',
    'hra',
    'ca',
    'medical',
    'education',
    'splAllow',
    'travelAllowance',
    'kitAllowance',
    'lta',
    'otherAllowance',
    'bonus',
    'eGross',
    'ptState',
    'ptD',
    'pfD',
    'esiD',
    'ltaAnnualBenefits',
    'pfAnnualBenefits',
    'esiAnnualBenefits',
    'bonusAnnualBenefits',
    'gratuityAnnualBenefits',
    'annualBonus',
    'retentionBonus',
    'medicalPremium',
    'fuelAndMaintenance',
    'otherComponents',
    'mobile',
    'internet',
    'houseRent',
    'driverSalary',
    'variablePay',
    'performanceLinkedBonus',
    'ctc'
  ];
  columnDisplayNames: { [key: string]: string } = {
    empId: 'EMP ID',
    name: 'NAME',
    status: 'STATUS',
    costCenter: 'COST CENTER',
    gender: 'GENDER',
    employmentType: 'EMPLOYMENT TYPE',
    incrementType: 'INCREMENT TYPE',
    lastWorkingDay: 'LWD',
    dob: 'DOB',
    doj: 'DOJ',
    division: 'DIVISION',
    designation: 'DESIGNATION',
    department: 'DEPARTMENT',
    reportee: 'Reportee',
    reporteeStatus: 'Reportee_Status',
    bankName: 'BANKNAME',
    ifsc: 'IFSC',
    accountNo: 'ACCOUNTNO',
    proEmail: 'PROEMAIL',
    pEmail: 'PEMAIL',
    pfNo: 'PFNO',
    esiNo: 'ESINO',
    pfUan: 'PFUAN',
    state: 'STATE',
    hq: 'HQ',
    region: 'REGION',
    professionalMobile: 'PROFESSIONAL_MOBILE',
    personalMobile: 'PERSONAL_MOBILE',
    personalPhone: 'PERSONAL PHONE',
    communicationAddress: 'COMMUNICATIONADDRESS',
    communicationAddress2: 'COMMUNICATIONADDRESS2',
    communicationAddress3: 'COMMUNICATIONADDRESS3',
    communicationAddress4: 'COMMUNICATIONADDRESS4',
    commCity: 'COMMCITY',
    commState: 'COMMSTATE',
    commZip: 'COMM_ZIP',
    permanentAddress: 'PERMANENTADDRESS',
    permanentAddress2: 'PERMANENTADDRESS2',
    permanentAddress3: 'PERMANENTADDRESS3',
    permanentAddress4: 'PERMANENTADDRESS4',
    pCity: 'PCITY',
    pState: 'PSTATE',
    pZipCode: 'PZIPCODE',
    passportNo: 'PASSPORTNO',
    aadhaarCardNo: 'AADHAARCARDNO',
    aadhaarUid: 'AADHAARUID',
    aadhaarName: 'AADHAARNAME',
    pan: 'PAN',
    imprestAmt: 'IMPRESTAMT',
    educationDetails: 'Education Details',
    prevExp: 'Prev.Exp',
    curExp: 'Cur.Exp',
    effectiveDate: 'EFFECTIVEDATE',
    gross: 'GROSS',
    basic: 'BASIC',
    vda: 'VDA',
    hra: 'HRA',
    ca: 'CA',
    medical: 'MEDICAL',
    education: 'EDUCATION',
    splAllow: 'SPL ALLOW',
    travelAllowance: 'TRAVEL ALLOWANCE',
    kitAllowance: 'KIT ALLOWANCE-E',
    lta: 'LTA-E',
    otherAllowance: 'Other ALLOWANCE-E',
    bonus: 'BONUS-E',
    eGross: 'E Gross',
    ptState: 'PTSTATE',
    ptD: 'PT-D',
    pfD: 'PF-D',
    esiD: 'ESI-D',
    ltaAnnualBenefits: 'LTA-ANNUAL BENIFITS',
    pfAnnualBenefits: 'PF-ANNUAL BENIFITS',
    esiAnnualBenefits: 'ESI-ANNUAL BENIFITS',
    bonusAnnualBenefits: 'BONUS-ANNUAL BENIFITS',
    gratuityAnnualBenefits: 'GRATUITY-ANNUAL BENIFITS',
    annualBonus: 'ANNUAL BONUS-ANNUAL BENIFITS',
    retentionBonus: 'RETENTION BONUS',
    medicalPremium: 'MEDICAL PREMIUM-ANNUAL BENIFITS',
    fuelAndMaintenance: 'FUELANDMAINTENANCE',
    otherComponents: 'OTHERCOMPONENTS',
    mobile: 'MOBILE',
    internet: 'INTERNET',
    houseRent: 'HOUSERENT',
    driverSalary: 'DRIVERSALARY',
    variablePay: 'VARIABLE PAY',
    performanceLinkedBonus: 'Performance Linked Bonus (KRA)',
    ctc: 'CTC'
  };
  
  downloadExcel(): void {
    if (!this.filteredData || this.filteredData.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No data to export',
        showConfirmButton: false
      });
      return;
    }
  
    this.isLoading = true;
  
    Swal.fire({
      title: 'Exporting...',
      text: 'Please wait while we generate the Excel file.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      // didOpen: () => {
      //   Swal.showLoading();
      // }
    });
  
    setTimeout(() => {
      const exportData = this.filteredData.map((item: any) => {
        const row: any = {};
        this.allColumns.forEach(col => {
          row[this.columnDisplayNames[col] || col] = item[col] || '-';
        });
        return row;
      });
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Employees': worksheet },
        SheetNames: ['Employees']
      };
  
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        compression: true
      });
  
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
  
      FileSaver.saveAs(data, `Employee_${this.selectedLocation}.xlsx`);
  
      this.isLoading = false;
  
      Swal.fire({
        icon: 'success',
        title: 'Exported!',
        text: 'The Excel file has been downloaded.',
        timer: 2000,
        showConfirmButton: false
      });
    }, 300); // slight delay to allow loading animation to appear
  }
  
  searchTerm: string = '';

onSearch(): void {
  const term = this.searchTerm.toLowerCase();

  this.filteredData = this.employees.filter(emp =>
    emp.empId?.toString().toLowerCase().includes(term) ||
    emp.name?.toLowerCase().includes(term)
  );

  this.currentPage = 1;
  this.updatePaginatedData();
}
}
 