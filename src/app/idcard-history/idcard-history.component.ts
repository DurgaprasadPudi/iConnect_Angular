import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-idcard-history',
  templateUrl: './idcard-history.component.html',
  styleUrls: ['./idcard-history.component.sass']
})
export class IdcardHistoryComponent implements OnInit {

  loggedUser: any = {};   
  userData: any;
  myDate: any;
  empObj: any;
  idcardissuedate: FormGroup;
  displaydata: any[] = [];
  filteredData: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  searchTerm: string = '';
  isLoading: boolean = false;
  selectedRow: any = null;
  showEditModal: boolean = false;
  editForm!: FormGroup;


  private hasShownNoEmployeeAlert = false;
  isResignedEmployee: boolean;
  hasShownResignedAlert: boolean;

  authBoolean: boolean;
  privileges: any = {};

  constructor(private fb: FormBuilder, private authservice: AuthService,public router: Router) { }

  ngOnInit(): void {
    this.loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData') || ''));
    this.userData = JSON.parse(this.loggedUser);

    let x = decodeURIComponent(window.atob(localStorage.getItem('privileges')));
    this.privileges = JSON.parse(x).Rights;

    this.authBoolean=false;
    for (let i = 0; i < this.privileges.length; i++) {   
      if(this.privileges[i].idcardhistory == "true"){ 
        this.authBoolean=true;
      }
    }
    if(this.authBoolean== false){
      let x = 'false'; 
      this.router.navigate(['/errorPage', {AuthrzdUser: x}]); 
    }



    this.myDate = decodeURIComponent(window.atob(localStorage.getItem('currentDate') || ''));
    moment.locale('en');

    this.idcardissuedate = this.fb.group({
      empid: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(5), Validators.maxLength(8)]],
      employeename: [{ value: '', disabled: true }],
      division: [{ value: '', disabled: true }],
      department: [{ value: '', disabled: true }],
      designation: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }],
      employmenttype: [{ value: '', disabled: true }],
      cardType: ['', Validators.required],
      date: ['', Validators.required],
      comments: ['', [Validators.maxLength(300)]]

    });
    this.idcardissuedate.get('empid')?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(val => {
        if (val && val.length >= 5) {
          this.userData.userid = val;
          this.getApiData();
        } else if (!val) {
          const cardType = this.idcardissuedate.get('cardType')?.value || 'New-issue';
          this.idcardissuedate.reset();
          // this.idcardissuedate.patchValue({ cardType });
          this.idcardissuedate.reset({ cardType: '' });
          // Clear employee-related fields when empid is cleared
          // this.clearEmployeeFields();
        }
      });

    this.idcardissuedate.get('empid')?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(val => {
        this.hasShownResignedAlert = false; // Reset alert every time empid changes

        if (val && val.length >= 5) {
          this.userData.userid = val;
          this.getApiData();
        } else if (!val) {
          this.idcardissuedate.reset({ cardType: '' });
          this.clearEmployeeFields();
        }
      });


    this.editForm = this.fb.group({
      employeeid: [''],
      cardType: [''],
      idcardissueddate: [''],
      comment: [''],
    });

    this.editForm.patchValue(this.selectedRow);
    this.getIdCardHistory(this.selectedStatus);
  }

  clearEmployeeFields() {
    this.idcardissuedate.patchValue({
      employeename: '',
      division: '',
      department: '',
      date: '',
      comments: '',
      designation: '',
      status: '',
      employmenttype: ''
    });
  }

  disableTyping(event: KeyboardEvent) {
    event.preventDefault();
  }

  // getApiData() {
  //   this.isLoading = true;
  //   const payload = { userid: this.userData.userid };
  //   //alert(payload.userid);

  //   this.authservice.unfreeze_empinfo(payload).subscribe(res => {
  //     this.isLoading = false;
  //   console.log(res);
  //     if (res?.info?.length > 0) {
  //       this.hasShownNoEmployeeAlert = false;
  //       this.empObj = res.info[0];
  //       this.idcardissuedate.patchValue({
  //         employeename: this.empObj.Fullname,
  //         division: this.empObj.DIVISION,
  //         department: this.empObj.DEPT,
  //         designation: this.empObj.DESIGNATION,
  //         status: this.empObj.EMPSTATUS,
  //         employmenttype: this.empObj.EmploymentType
  //       });
  //     } else if (!this.hasShownNoEmployeeAlert) {
  //       this.hasShownNoEmployeeAlert = true;
  //       this.idcardissuedate.reset();
  //       Swal.fire('Error', 'No employee info found', 'error');
  //     }
  //   });
  // }

  getApiData() {
    this.isLoading = true;

    const payload = { userid: this.userData.userid };


    this.authservice.unfreeze_empinfo(payload).subscribe(res => {
      this.isLoading = false;

      if (res && res.info && res.info.length > 0) {
        this.hasShownNoEmployeeAlert = false; // reset the flag in case of valid data


        this.empObj = res.info[0];
        this.idcardissuedate.patchValue({
          employeename: this.empObj.Fullname,
          division: this.empObj.DIVISION,
          department: this.empObj.DEPT,
          designation: this.empObj.DESIGNATION,
          status: this.empObj.EMPSTATUS,
          employmenttype: this.empObj.EmploymentType,
        });

        console.log("data", res);
      } else {
        // Prevent repeated alert display
        if (!this.hasShownNoEmployeeAlert) {
          this.hasShownNoEmployeeAlert = true;
          this.idcardissuedate.reset();
          Swal.fire('Error', 'Employee not found', 'error');
        }
        return;
      }

      if (this.empObj.STATUS === 1061) {
        this.isResignedEmployee = true;

        if (!this.hasShownResignedAlert) {
          this.hasShownResignedAlert = true;

          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Employee resigned, ID cannot be issued.'
          }).then(() => {
            // After clicking OK, clear empid and form fields
            this.idcardissuedate.patchValue({ empid: '' });
            this.clearEmployeeFields();
          });
        }

        return;

      }



    });
  }

  onSubmit() {
    if (this.idcardissuedate.invalid) {
      this.idcardissuedate.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.idcardissuedate.getRawValue();

    console.log('Form Values:', formValue);

    const payload = {
      employeeid: Number(formValue.empid),
      idcardissueddate: moment(formValue.date).format('YYYY-MM-DD'),
      comment: formValue.comments || '',
      cardType: formValue.cardType,
      createdby: Number(this.userData.user.empID),
      idSubmittedBy: Number(this.userData.user.empID),
      submittedByName: this.userData.user.empName
    };

    this.authservice.saveIdcardHistory(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res?.status === 1001) {
          // if (res?.isFirstTime) {
          //   Swal.fire(
          //     'Warning',
          //     'No active ID card found. Change the "Issued Type" to "Issue New ID" to proceed.',
          //     'warning'
          //   );
          // } else {
          Swal.fire(
            'Warning',
            'ID card already exists for this employee. To issue ID again, select  Issued Type as "Re-Issue ID".',
            'warning'
          );

        } else if (res?.status === 1002) {
          Swal.fire('Success', 'ID card added successfully.', 'success');
          this.resetFormAndRefresh();
        } else if (res?.status === 1003) {
          Swal.fire('Success', 'ID card reissued successfully.', 'success');
          this.resetFormAndRefresh();
        } else if (res?.status === 1004) {
          Swal.fire('Warning', 'No active ID found. To continue, change the "Issued Type" to "Issue New ID"', 'warning');
        } else {
          Swal.fire('Info', 'Unexpected response received.', 'info');
        }
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 422) {
          Swal.fire('Error', 'Failed to submit data. Please try again.', 'error');
        } else {
          Swal.fire('Error', 'Failed to submit data. Please try again.', 'error');
        }

        console.error(err);
      }
    });
  }

  private resetFormAndRefresh(): void {
    this.idcardissuedate.reset({
      empid: '',
      employeename: '',
      division: '',
      department: '',
      designation: '',
      status: '',
      employmenttype: '',
      cardType: '',
      date: null,
      comments: ''
    });

    this.getIdCardHistory(this.selectedStatus); // Refresh table
  }


  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Home',
      'End'
    ];

    if (
      allowedKeys.includes(event.key) ||
      (event.ctrlKey || event.metaKey) // Allow Ctrl/Cmd + A/C/V/X/Z etc.
    ) {
      return; // Allow the key
    }

    const isNumberKey = /^[0-9]$/.test(event.key);
    if (!isNumberKey) {
      event.preventDefault(); // Block non-numeric key
    }
  }



  onEmpIdFocus() {
    const val = this.idcardissuedate.get('empid')?.value;
    if (val) {
      this.userData.userid = val;
      this.getApiData();
    }
  }

  search(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (this.selectedStatus === '1001') {
      this.filteredData = this.allDataActive.filter(item =>
        item.employeeid.toString().toLowerCase().includes(term)
      );
    } else if (this.selectedStatus === '1002') {
      this.filteredData = this.allDataInactive.filter(item =>
        item.employeeid.toString().toLowerCase().includes(term)
      );
    }

    this.currentPage = 1;
    this.calculateTotalPages();
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(start, start + this.itemsPerPage);
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  get paginationRange() {
    const range: (number | string)[] = [];
    const visiblePages = 10;

    if (this.totalPages <= visiblePages) {
      for (let i = 1; i <= this.totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (this.currentPage > visiblePages) range.push("...");
      let startPage = Math.max(2, this.currentPage - Math.floor(visiblePages / 2));
      let endPage = Math.min(this.totalPages, startPage + visiblePages - 2);
      if (endPage - startPage < visiblePages - 2)
        startPage = Math.max(2, endPage - visiblePages + 2);
      for (let i = startPage; i <= endPage; i++) range.push(i);
      if (endPage < this.totalPages) range.push("...");
    }

    return range;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToPage(page: number | string) {
    if (typeof page === "number") this.currentPage = page;
  }
  displayDataActive: any[] = [];
  displayDataInactive: any[] = [];

  allDataActive: any[] = [];     // holds original unfiltered data
  allDataInactive: any[] = [];   // holds original unfiltered data

  selectedStatus: string = '1001';  // default

  // Pagination and other props for active and inactive, if needed
  // Or reuse same pagination for simplicity

  getIdCardHistory(status: string): void {
    this.isLoading = true;

    this.authservice.getIdcardHistory(status).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log("dfdfdfd", res);

        if (status === '1001') {
          this.allDataActive = res;
          this.displayDataActive = [...res];
          this.filteredData = [...res];
        } else if (status === '1002') {
          this.allDataInactive = res;
          this.displayDataInactive = [...res];
          this.filteredData = [...res];
        }
        this.calculateTotalPages();
        this.search(); // call search after loading data
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching ID card history:', err);
      }
    });
  }


  // getIdCardHistory(status: string) {
  //   this.isLoading = true;
  //   this.authservice.getIdcardHistory(status).subscribe({
  //     next: (res) => {
  //       console.log('Fetched History:', res);
  //       this.displaydata = res;
  //       this.filteredData = [...res];
  //       this.calculateTotalPages();
  //       this.isLoading = false;
  //     },
  //     error: () => {
  //       Swal.fire('Error', 'Failed to fetch ID card history', 'error');
  //       this.displaydata = [];
  //       this.filteredData = [];
  //       this.calculateTotalPages();
  //       this.isLoading = false;
  //     }
  //   });
  // }

  openEditModal(row: any) {
    // Deep copy so editing doesn't affect original before update
    this.selectedRow = {
      ...row,
      submittedDate: row.idSubmittedDate,
      submittedComments: row.submittedComment
    };
    this.showEditModal = true;
  }

  closeModal() {
    this.selectedRow = null;
    this.showEditModal = false;
  }

  updateRow() {
    const index = this.paginatedData.findIndex(item => item.employeeid === this.selectedRow.employeeid);
    if (index !== -1) {
      // Update the row with new data
      this.paginatedData[index] = { ...this.selectedRow };
    }

    this.closeModal();
  }
  update(): void {
    const payload = {
      employeeid: this.selectedRow.employeeid,
      idcardissueddate: moment(this.selectedRow.idcardissueddate).format('YYYY-MM-DD'),
      comment: this.selectedRow.comment,
      createdby: Number(this.userData.user.empID),
      idSubmittedBy: Number(this.userData.user.empID),
      submittedByName: String(this.userData.user.empName)
    };
    console.log("📦 Payload Sent:", JSON.stringify(payload, null, 2));

    console.log("📦 Payload for updateIdcardHistory API:", payload);
    this.isLoading = true;

    this.authservice.updateIdcardHistory(payload).subscribe({
      next: (res: any) => {
        console.log('Updated history:', res);
        this.isLoading = false;
        Swal.fire('Success', res?.message || 'ID card history updated successfully', 'success');
        this.getIdCardHistory(this.selectedStatus);
        this.closeModal();
      },
      error: (err) => {
        this.isLoading = false;
        const errorBody = err?.error;

        if (errorBody?.status === 200) {
          Swal.fire('Success', errorBody.message || 'Updated successfully', 'success');
          this.getIdCardHistory(this.selectedStatus);
          this.closeModal();
        } else {
          Swal.fire('Error', errorBody?.message || 'Failed to update record', 'error');
        }

        console.error('Full error:', err);
      }
    });
  }


  allowOnly8Digits(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    // If current length is already 8, prevent input
    if (input.value.length >= 8) {
      event.preventDefault();
      return;
    }

    const charCode = event.key.charCodeAt(0);

    // Allow only digits (char code 48-57)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  viewData: any[] = [];
  showViewPopup: boolean = false;
  openViewPopup(trackingId: any): void {
    this.authservice.viewIssueDetails(trackingId).subscribe(
      (res: any[]) => {
        this.viewData = res;
        this.showViewPopup = true;
      },
      (err) => {
        console.error('Error fetching view details', err);
      }
    );
  }

  limitCommentLength(): void {
    const control = this.idcardissuedate.get('comments');
    if (control) {
      const value = control.value || '';
      if (value.length > 300) {
        control.setValue(value.slice(0, 300), { emitEvent: false });
      }
    }
  }




}
