import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';
import { AbstractControl, NgModel } from '@angular/forms';
 
@Component({
  selector: 'app-requisitionform',
  templateUrl: './requisitionform.component.html',
  styleUrls: ['./requisitionform.component.sass']
})
export class RequisitionformComponent implements OnInit {
    @ViewChildren(NgModel) formFields!: QueryList<NgModel>;
  empId: string = '';  
    employeeSearch: string = '';
  employeeData: any = {};  
  companies = [];
  submitted = false;
  designation=[];
  filteredCompanies = [];  
searchTerm: string = '';  
filteredDepartments = [];
selectedDepartment: string = '';
departmentSearchTerm: string = '';
filteredDesignations = [];
selectedDesignation: string = '';
designationSearchTerm: string = '';
experienceRequired: string = '';
location:string='';
selectedQualification:any='';
jobDescription:any='';
specialSkills:any='';
filteredBuList: any[] = [];
buSearchTerm: string = '';
department: any[] = [];
selectedCompany: number | null = null;
selectedDepartmentId: any;
selectedDesignationId: any;
unitHeadId:any;
deptHeadId:any;
deptHeadSign: string = ''; 
deptHeadName: string = ''; 
deptHeadDate: string = ''; 
unitHeadSign: string = ''; 
unitHeadName: string = ''; 
unitHeadDate: string = ''; 
hrComments: string = ''; 
deptHeadSearchResults: any[] = [];
showDeptHeadDropdown: boolean = false;
unitHeadSearchResults: any[] = [];
showUnitHeadDropdown: boolean = false;
isEmpNoFetched: boolean = false;
filteredEmployees: any[] = [];
showDropdown: boolean = false;
logoUrl:string='';
constructor(private authservice: AuthService) {}
ngOnInit(): void {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    console.log('Current Hostname:', hostname);
    // Set the link based on the hostname
    if (hostname === 'azistaindustries.com' || hostname === 'www.sso.azistaindustries.com') {
      this.logoUrl = 'assets/img/azista-logo.svg'; 
    } else if (hostname === 'heterohealthcare.com' || hostname === 'sso.heterohealthcare.com') {
      this.logoUrl = 'assets/img/logo.svg'; 
    } else if (hostname === 'iconnect.azistabst.com' || hostname === 'sso.azistabst.com') {
      this.logoUrl = 'https://www.azistabst.com/assets/img/azista-bst-logo.svg'; 
      
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
      this.logoUrl = 'assets/img/logo.svg'; 
    }
    //console.log('Link Text:', this.linkText); // Verify the value is set correctly
  }
 
  this.empId = '';  
  this.employeeData = {};
  this.filteredDepartments = this.department;
  this.filteredDesignations = this.designation;
  this.getRequisitionBu();
  this.getRequistionDepartment();
  this.getRequistionDesignation(); 
} 
getRequisitionBu(): void {
  const formdata = new FormData();

  let hostname = window.location.hostname;
  let companyCode = '';

  if (hostname === 'azistaindustries.com' || hostname === 'www.sso.azistaindustries.com') {
    companyCode = 'AZISTA';
  } else if (hostname === 'heterohealthcare.com' || hostname === 'sso.heterohealthcare.com') {
    companyCode = 'HHC';
  } else if (hostname === 'iconnect.azistabst.com' || hostname === 'sso.azistabst.com') {
    companyCode = 'AZISTA';
  } else {
    companyCode = 'HHC'; 
  }

  formdata.append('name', companyCode);

  this.authservice.getRequisitionBu(formdata).subscribe({
    next: (res) => {
      this.companies = res;
      this.filteredBuList = res;
    },
    error: (err) => console.error('Error fetching companies:', err)
  });
}

getRequistionDepartment(): void {
  this.authservice.getRequistionDepartment().subscribe({
    next: (res) => {
      this.department = res;
      this.filteredDepartments = res;
    },
    error: (err) => console.error('Error fetching departments:', err)
  });
}
 
getRequistionDesignation(): void {
  this.authservice.getRequistionDesignation().subscribe({
    next: (res) => {
      this.designation = res;
      this.filteredDesignations = res;
    },
    error: (err) => console.error('Error fetching designations:', err)
  });
}
onBuSelect(bu: any): void {
  this.buSearchTerm = bu.name;  
  this.selectedCompany = bu.id; 
  this.filteredBuList = [];    
}
 onDesignationSelect(des: any): void {
  this.designationSearchTerm = des.name;  
  this.selectedDesignationId = des.id;  
  this.filteredDesignations = [];
 }
onDepartmentSelect(dept: any): void {
    this.selectedDepartmentId = dept.id;
    this.departmentSearchTerm = dept.name;
    this.filteredDepartments = [];
  }
onBuSearchChange(): void {
  const term = this.buSearchTerm.toLowerCase().trim();  

  this.selectedCompany = null; 

  if (!term) {
    this.filteredBuList = [...this.companies];  
  } else {
    this.filteredBuList = this.companies.filter((c) =>
      c.name.toLowerCase().includes(term)  
    );
  }

  if (this.filteredBuList.length === 0 && term.length > 0) {
    this.buSearchTerm = '';
  }
}

onDesignationSearchChange(): void {
  const term = this.designationSearchTerm.toLowerCase().trim();  
  this.selectedDesignationId=null;
  if (!term) {
    this.filteredDesignations = [...this.designation];  
  } else {
    this.filteredDesignations = this.designation.filter((d) =>
      d.name.toLowerCase().includes(term)  
    );
  }
  if (this.filteredDesignations.length === 0 && term.length > 0) {
    this.designationSearchTerm = '';
  }
}

  onDepartmentSearchChange(): void {
    const term = this.departmentSearchTerm.toLowerCase().trim();
    this.selectedDepartmentId=null;
    if (!term) {
      this.filteredDepartments = [...this.department];
    } else {
      this.filteredDepartments = this.department.filter((d) =>
        d.name.toLowerCase().includes(term)
      );
    }
    if (this.filteredDepartments.length === 0 && term.length > 0) {
      this.departmentSearchTerm = '';
    }
  }
  

 onEmpNoChange(input: string): void {
  this.employeeSearch = input;
 
  // Clear and reset if input is empty or not a valid number
  if (!input || input.trim().length < 2 || !/^\d+$/.test(input.trim())) {
    this.employeeData = {
      empNo: '', 
      employeeName: '',
      designation: '',
      qualification: '',
      experience: '',
      dateOfResignation: '',
      dateOfRelieving: '',
    };
    this.filteredEmployees = [];
    this.showDropdown = false;
    return;
  }
 
  // Proceed to search and show dropdown if input is valid enough
  const formdata = new FormData();
  formdata.append('name', input.trim());
 
  this.authservice.getUnitNames(formdata).subscribe((res: any[]) => {
    this.filteredEmployees = res || [];
    this.showDropdown = true;
  });
}
selectEmployee(emp: any): void {
  if (emp && emp.id) {
    this.employeeData.empNo = emp.id;  
    this.employeeSearch = `${emp.id}`;
  } else {
    console.error('Employee not selected or ID is missing');
  }
  this.filteredEmployees = [];
  this.showDropdown = false;
  this.getRequisitionEmpData(emp.id);
}

hideDropdownWithDelay(): void {
  setTimeout(() => (this.showDropdown = false), 200); 
}
allowOnlyNumbers(event: KeyboardEvent): void {
  const charCode = event.which ? event.which : event.keyCode;
  if (
    (charCode >= 48 && charCode <= 57) || 
    charCode === 8 || 
    charCode === 9 || 
    charCode === 37 || 
    charCode === 39 || 
    charCode === 46 ||
    charCode === 45
  ) {
    return;
  } else {
    event.preventDefault();
  }
}

getRequisitionEmpData(employeeId: string): void {
  this.authservice.getRequisitionEmpData(employeeId).subscribe(
    (res) => {
      this.employeeData = res;
    //  console.log("Employee Data:", this.employeeData);
      if (res.dateOfResignation === '0000-00-00') {
        this.employeeData.dateOfResignation = 'Invalid Date';
      } else if (res.dateOfResignation) {
        this.employeeData.dateOfResignation = new Date(res.dateOfResignation);
      }
      if (res.dateOfRelieving) {
        this.employeeData.dateOfRelieving = new Date(res.dateOfRelieving);
      }
      if (this.isEmpNoFetched) {
        this.employeeData.empNo = this.empId;
      }
    },
    (err) => {
      console.error('Error fetching employee data:', err);
      this.isEmpNoFetched = false;
      this.employeeData = {
        empNo: '',
        employeeName: '',
        designation: '',
        qualification: '',
        experience: '',
        dateOfResignation: '',
        dateOfRelieving: '',
      };
    }
  );
}
  formValid(): boolean {
    // console.log('Qualification:', this.selectedQualification);
    // console.log('Date of Resignation:', this.employeeData.dateOfResignation);
    return (
      this.buSearchTerm &&
      this.departmentSearchTerm &&
      this.location &&
      this.experienceRequired &&
      this.designationSearchTerm &&
      this.selectedQualification &&
      this.jobDescription &&
      this.specialSkills &&
      !!this.hrComments
    );
  }
 
resetForm() {
  this.employeeSearch = '';
  this.selectedCompany = null;
  this.selectedDepartment = '';
  this.selectedDepartmentId = '';
  this.location = '';
  this.experienceRequired = '';
  this.selectedDesignationId = '';
  this.selectedDesignation = '';
  this.selectedQualification = '';
  this.jobDescription = '';
  this.specialSkills = '';
  this.deptHeadSign = '';
  this.deptHeadName = '';
  this.deptHeadDate = '';
  this.unitHeadSign = '';
  this.unitHeadName = '';
  this.unitHeadDate = '';
  this.hrComments = '';
  this.employeeData = {
    empNo: '',
    employeeName: '',
    qualification: '',
    experience: '',
    dateOfRelieving: '',
    dateOfResignation: '',
    designation: ''
  };
  this.buSearchTerm = '';
  this.departmentSearchTerm = '';
  this.designationSearchTerm = '';
  this.employeeSearch = '';
  this.formFields.forEach(field => {
      field.control.setErrors(null);
      field.control.markAsPristine();
      field.control.markAsUntouched();
    });
  }

onSubmit(): void {
 const formatDate = (dateInput: any): string => {
  const date = new Date(dateInput);
  if (!dateInput || isNaN(date.getTime())) {
    return ''; 
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  this.employeeData.dateOfRelieving = formatDate(this.employeeData.dateOfRelieving);
  this.employeeData.dateOfResignation = formatDate(this.employeeData.dateOfResignation);

  if (this.deptHeadDate && typeof this.deptHeadDate === 'string') {
    this.deptHeadDate = new Date(this.deptHeadDate).toISOString(); 
  }

  if (this.unitHeadDate && typeof this.unitHeadDate === 'string') {
    this.unitHeadDate = new Date(this.unitHeadDate).toISOString(); 
  }

  if (this.deptHeadDate && this.deptHeadDate !== '') {
    this.deptHeadDate = formatDate(new Date(this.deptHeadDate));
  }
  if (this.unitHeadDate && this.unitHeadDate !== '') {
    this.unitHeadDate = formatDate(new Date(this.unitHeadDate));
  }
  const payload = {
    companyId: this.selectedCompany,
    department: this.selectedDepartmentId,
    location: this.location,
    experienceRequired: this.experienceRequired,
    jobTitle: this.selectedDesignationId,
    qualification: this.selectedQualification,
    reqJobDescription: this.jobDescription,
    skills: this.specialSkills,
    deptHeadSign: this.deptHeadSign,
    deptHeadName: this.deptHeadId,
    deptHeadDate: this.deptHeadDate,
    unitHeadSign: this.unitHeadSign,
    unitHeadName: this.unitHeadId,
    unitHeadDate: this.unitHeadDate,
    hrComments: this.hrComments,
    employeeId: this.employeeSearch,
    replacedQualification: this.employeeData.qualification,
    dateOfResignation: this.employeeData.dateOfResignation,
    designation: this.employeeData.designation,
    experience: this.employeeData.experience,
    dateOfRelieving: this.employeeData.dateOfRelieving,
  };

  //console.log("Payload:", payload);

  this.authservice.submitRequistion(payload).subscribe({
    next: (res) => {
      //alert('Requisition submitted successfully!');
      Swal.fire({
        title: 'Success!',
        text: 'Successfully Submitted!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
        this.resetForm();
    },
    error: (err) => {
      console.error('Submission failed', err);
      //alert('Something went wrong. Please try again.');
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    },
  });
}
selectDeptHead(head: any): void {
    this.deptHeadId=head.id;
  this.deptHeadName = head.name; 
  this.deptHeadSearchResults = [];  
  this.showDeptHeadDropdown = false; 
}

onDeptHeadNameInput(): void {
  const trimmedName = this.deptHeadName.trim();
  this.deptHeadId=null;
  if (trimmedName.length < 2) {
    this.deptHeadSearchResults = [];
    this.showDeptHeadDropdown = false;
    return;
  }

  const formData = new FormData();
  formData.append('name', trimmedName);
  this.authservice.getUnitNames(formData).subscribe({
    next: (res) => {
      this.deptHeadSearchResults = res;
      this.showDeptHeadDropdown = res.length > 0;
      const foundInResults = res.some(item => item.name.toLowerCase().includes(trimmedName.toLowerCase()));
      if (!foundInResults) {
        this.deptHeadName = ''; 
      }
    },
    error: (err) => {
      console.error('Error fetching dept head names:', err);
      this.deptHeadSearchResults = [];
      this.showDeptHeadDropdown = false;
    }
  });
}

selectUnitHead(head: any): void {
  this.unitHeadId=head.id;
  this.unitHeadName = head.name;  
  this.unitHeadSearchResults = [];  
  this.showUnitHeadDropdown = false; 
}
onUnitHeadNameInput(): void {
  const trimmedName = this.unitHeadName.trim();
this.unitHeadId=null;
  if (trimmedName.length < 2) {
    this.unitHeadSearchResults = [];
    this.showUnitHeadDropdown = false;
    return;
  }

  const formData = new FormData();
  formData.append('name', trimmedName);
  this.authservice.getUnitNames(formData).subscribe({
    next: (res) => {
      this.unitHeadSearchResults = res;
      this.showUnitHeadDropdown = res.length > 0;
      const foundInResults = res.some(item => item.name.toLowerCase().includes(trimmedName.toLowerCase()));
      if (!foundInResults) {
        this.unitHeadName = ''; 
      }
    },
    error: (err) => {
      console.error('Error fetching unit head names:', err);
      this.unitHeadSearchResults = [];
      this.showUnitHeadDropdown = false;
    }
  });
}

onKey(event: KeyboardEvent): void {
  const key = event.key;
  if (
    key === 'Backspace' || 
    key === 'Delete' || 
    key === 'ArrowLeft' || 
    key === 'ArrowRight' || 
    key === 'Tab'
  ) {
    return; 
  }
  if (!/^[0-9.]$/.test(key)) {
    event.preventDefault(); 
  }
  if (key === '.' && event.target && (event.target as HTMLInputElement).value.includes('.')) {
    event.preventDefault();
  }
}
onKeyPress(event: KeyboardEvent): void {
  const charCode = event.charCode;  
  if (charCode >= 48 && charCode <= 57) {
    event.preventDefault();
  }
}

}
 