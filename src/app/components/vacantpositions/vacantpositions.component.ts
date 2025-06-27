import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vacantpositions',
  templateUrl: './vacantpositions.component.html',
  styleUrls: ['./vacantpositions.component.sass']
})
export class VacantpositionsComponent implements OnInit {
 tableForm: FormGroup;
  departmentSearchControl: FormControl;
  filteredDepartments: any[] = [];
  department: any[] = [];
  selectedDepartmentId: number;
unitHeadName: string = '';
selectedHodId: number | null = null;
unitHeadSearchResults: any[] = [];
showUnitHeadDropdown: boolean = false;
lastSelectedHeadName: string = ''; 
logoUrl:string='';
  constructor(private fb: FormBuilder, private authservice: AuthService) {}

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
    this.tableForm = this.fb.group({
    unitHeadName: ['', Validators.required],
    departmentId: [null, Validators.required],
    location: ['', Validators.required],
    date: ['', Validators.required],
    rows: this.fb.array([this.createRow()])
  });
    this.departmentSearchControl = new FormControl('');
    this.getRequistionDepartment();
  }

  get rows(): FormArray {
    return this.tableForm.get('rows') as FormArray;
  }

 createRow(): FormGroup {
  return this.fb.group({
    designation: [''],
    presentStrength: [null],
    approvedVacancies: [0], 
    q1: [0],
    q2: [0],
    q3: [0],
    q4: [0],
    remarks: ['']
  });
}

addRow(): void {
  const lastRow = this.rows.at(this.rows.length - 1);
  const designation = lastRow.get('designation')?.value?.trim();
  const presentStrength = lastRow.get('presentStrength')?.value;

  if (designation && presentStrength != null) {
    this.rows.push(this.createRow());
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Row',
      text: 'Please fill in the details of the current row before adding a new one.',
      confirmButtonText: 'OK'
    });
  }
}

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

 
  getRequistionDepartment(): void {
    this.authservice.getRequistionDepartment().subscribe({
      next: (res) => {

        this.department = res;
        this.filteredDepartments = res;
       // console.log("data", res);
      },
      error: (err) => console.error('Error fetching departments:', err)
    });
  }
onDepartmentSearchChange(): void {
  const term = this.departmentSearchControl.value.toLowerCase().trim();

  if (term) {
    this.filteredDepartments = this.department.filter((d) =>
      d.name.toLowerCase().includes(term)
    );
  } else {
    this.filteredDepartments = [];
  }
  if (this.filteredDepartments.length === 0 && term !== '') {
    this.departmentSearchControl.setValue(''); 
  }
}

onDepartmentSelect(dept: any): void {
  this.departmentSearchControl.setValue(dept.name);
  this.selectedDepartmentId = dept.id;
  this.tableForm.patchValue({ departmentId: dept.id }); 
  this.filteredDepartments = []; 
  if (!this.departmentSearchControl.value.trim()) {
    this.selectedDepartmentId = null;
    this.tableForm.patchValue({ departmentId: null });
  }
}

onDepartmentInputBlur(): void {
  const selectedDept = this.department.find(
    (d) => d.name.toLowerCase() === this.departmentSearchControl.value.toLowerCase().trim()
  );

  if (!selectedDept) {
    // Clear input and reset selected department only if no match is found
    this.departmentSearchControl.setValue('');  // Clear the input
    this.selectedDepartmentId = null;  // Reset the department ID
    this.tableForm.patchValue({ departmentId: null });  // Reset form control value
  } else {
    // If a match is found, set the department ID in form and keep the input value
    this.selectedDepartmentId = selectedDept.id;
    this.tableForm.patchValue({ departmentId: selectedDept.id });
  }
}


onSubmit(): void {
  if (this.tableForm.invalid) {
    this.tableForm.markAllAsTouched();
    return;
  }
  const formValue = this.tableForm.value;
  const formattedDate = formValue.date
    ? new Date(formValue.date).toISOString().split('T')[0]
    : null;

  const payload = {
    hodId: this.selectedHodId,
    department: this.selectedDepartmentId,
    location: formValue.location,
    effectiveDate: formattedDate,
    employeeStrengthAndVacanciesDTO: formValue.rows.map((row: any) => ({
      designation: row.designation,
      presentStrength: row.presentStrength?.toString() ?? '',
      approvedVacancies: row.approvedVacancies?.toString() ?? '',
      vacancyA: row.q1?.toString() ?? '',
      vacancyB: row.q2?.toString() ?? '',
      vacancyC: row.q3?.toString() ?? '',
      vacancyD: row.q4?.toString() ?? '',
      remarks: row.remarks,
    })),
  };

  this.authservice.submitVacantPositions(payload).subscribe({
    next: (res) => {
    //  console.log('Submitted successfully', res);

      Swal.fire({
        icon: 'success',
        title: 'Submitted!',
        text: 'The form has been submitted successfully.',
        confirmButtonText: 'OK'
      }).then(() => {
  
        this.tableForm.reset();
        this.selectedHodId = null;
        this.selectedDepartmentId = null;
        this.unitHeadSearchResults = [];
        this.departmentSearchControl.setValue('');
        this.unitHeadName = '';
        this.lastSelectedHeadName = '';
      });
    },
    error: (err) => {
      console.error('Submission error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Something went wrong while submitting the form.',
        confirmButtonText: 'Retry'
      });
    },
  });
}
isFormValid(): boolean {
  if (!this.tableForm.valid) return false;

  const rows = this.rows.controls;
  for (const row of rows) {
    if (
      row.get('designation')?.value &&
      row.get('presentStrength')?.value != null &&
      row.get('approvedVacancies')?.value != null
    ) {
      return true; 
    }
  }
  return false;
}

  onDateKeypress(event: KeyboardEvent): void {
  const charCode = event.charCode || event.keyCode;
 
  if (
    !(charCode >= 48 && charCode <= 57) && 
    charCode !== 47 && 
    charCode !== 45 
  ) {
    event.preventDefault(); 
  }
}

onUnitHeadNameInput(): void {
  const control = this.tableForm.get('unitHeadName');
  const trimmedValue = control?.value?.trim() || '';

  const formData = new FormData();
  formData.append('name', trimmedValue.toLowerCase());

  this.authservice.getUnitNames(formData).subscribe({
    next: (res) => {
      this.unitHeadSearchResults = res;
      this.showUnitHeadDropdown = res.length > 0;
    },
    error: () => {
      this.unitHeadSearchResults = [];
      this.showUnitHeadDropdown = false;
    }
  });
}

selectUnitHead(head: any): void {
  this.tableForm.patchValue({ unitHeadName: head.name });
  this.selectedHodId = head.id;
  this.lastSelectedHeadName = head.name;
  this.showUnitHeadDropdown = false;
}
onUnitHeadBlur(): void {
  const inputValue = this.tableForm.get('unitHeadName')?.value?.trim().toLowerCase() || '';
  const matched = this.unitHeadSearchResults.some(
    h => h.name.toLowerCase() === inputValue
  );

  if (!matched) {
    this.tableForm.patchValue({ unitHeadName: '' });
    this.selectedHodId = null;
    this.lastSelectedHeadName = '';
  }
}
allowOnlyNumbers(event: KeyboardEvent): void {
  const charCode = event.which ? event.which : event.keyCode;
  // Allow: 0-9, Backspace, Tab, Arrow keys, Delete, Dash (-)
  if (
    (charCode >= 48 && charCode <= 57) || // 0-9
    charCode === 8 || // Backspace
    charCode === 9 || // Tab
    charCode === 37 || // Left arrow
    charCode === 39 || // Right arrow
    charCode === 46 || // Delete
    charCode === 45 // Dash (-)
  ) {
    return;
  } else {
    event.preventDefault();
  }
}


}
