import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-upload-insurance-details',
  templateUrl: './upload-insurance-details.component.html',
  styleUrls: ['./upload-insurance-details.component.sass']
})
export class UploadInsuranceDetailsComponent implements OnInit {
  insuranceForm!: FormGroup;
  selectedFiles: File[] = [];
  fileErrors: string[] = [];
  loggedUser: any = {};
  userData: any;
  myDate: any;
  empObj: any;
  insuranceData: any[] = [];
  pagedData: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  showModal = false;
  pdfUrlSafe: SafeResourceUrl | null = null;
  selectedFileName: string = '';
isLoading: boolean = false;
selectedType: number = 1;
  constructor(private fb: FormBuilder, private authserive: AuthService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    this.userData = this.loggedUser.userData;
    this.myDate = new Date();
    this.insuranceForm = this.fb.group({
      category: ['', Validators.required]
    });
    this.getInsuranceFilesByType();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileErrors = [];
  
    if (!input.files) return;
  
    const files = Array.from(input.files);
    const allowedTypes = ['pdf'];
    const filenamePattern = /^\d+$/;
  
    this.selectedFiles = [];
  
    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
  
      if (!allowedTypes.includes(ext)) {
        this.fileErrors.push(`${ext} is not a supported file type.`);
      } else if (file.size > 1 * 1024 * 1024) {
        this.fileErrors.push(`${file.name} exceeds 1MB.`);
      } else if (!filenamePattern.test(nameWithoutExt)) {
        this.fileErrors.push(`Filename must contain only numbers.`);
      } else {
        this.selectedFiles.push(file);
      }
    }
  }
  

  onSubmit(): void {
    if (this.insuranceForm.invalid || this.selectedFiles.length === 0) {
      return;
    }
  
    const category = this.insuranceForm.get('category')?.value;
    const type = category === 'self' ? 1 : 2;
  
    const formData = new FormData();
    formData.append('type', type.toString());
  
    for (const file of this.selectedFiles) {
      formData.append('files', file);
    }
  
    // Show SweetAlert only if more than 500 files are being uploaded
    if (this.selectedFiles.length > 500) {
      Swal.fire({
        title: 'Uploading many files...',
        text: 'This may take a few seconds. Please wait.',
        showConfirmButton: false,
        allowOutsideClick: false,
        // didOpen: () => {
        //   Swal.showLoading();
        // }
      });
    }
  
    this.isLoading = true;
  
    this.authserive.saveInsuranceData(formData).subscribe({
      next: () => {
        Swal.close(); // Close loading alert if shown
        Swal.fire('Success', 'Files uploaded successfully', 'success');
        this.isLoading = false;
  
        this.insuranceForm.reset({ category: '' });
        this.selectedFiles = [];
        this.fileErrors = [];
  
        const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
          this.getInsuranceFilesByType();
        }
      },
      error: err => {
        console.error(err);
        Swal.close(); // Close loading alert
        Swal.fire('Error', 'File upload failed', 'error');
        this.isLoading = false;
      }
    });
  }
  

  getInsuranceFilesByType(): void {
    this.isLoading = true;
    this.searchTerm = '';
    this.filteredData = [];
    this.authserive.getInsuranceFiles(this.selectedType).subscribe({
      next: (res) => {
        this.insuranceData = res;
        this.currentPage = 1;
        if (this.searchTerm && this.searchTerm.trim() !== '') {
          this.onSearch();
        } else {
          this.updatePagination();
        }
  
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch insurance files by type', err);
        this.isLoading = false;
      }
    });
  }
  
  downloadFile(item: any): void {
    this.authserive.getEmployeeInsurance(item.employeeId).subscribe({
      next: (res) => {
        const base64 = this.selectedType === 1 ? res.fileContent : res.familyFileContent;
        const fileName = this.selectedType === 1 ? (res.fileName || 'download.pdf') : (res.familyFileName || 'download.pdf');

        if (!base64 || base64 === 'NA') {
          Swal.fire('Not Found', 'No file content found to download.', 'warning');
          return;
        }
  
        const byteCharacters = atob(base64);
        const byteArray = new Uint8Array([...byteCharacters].map(c => c.charCodeAt(0)));
        const blob = new Blob([byteArray], { type: 'application/pdf' });
  
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
  
        Swal.fire('Downloaded', `${fileName} has been downloaded.`, 'success');
      },
      error: () => {
        Swal.fire('Error', 'Failed to download the file.', 'error');
      }
    });
  }
  
  get start(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get end(): number {
    return Math.min(this.start + this.pageSize, this.insuranceData.length);
  }

  get totalPages(): number {
    return Math.ceil(this.insuranceData.length / this.pageSize);
  }

  get totalPagesArray(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const range: number[] = [];
  
    if (total <= 7) {
      for (let i = 1; i <= total; i++) range.push(i);
    } else {
      range.push(1);
  
      if (current > 4) {
        range.push(-1); // represents "..."
      }
  
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
  
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
  
      if (current < total - 3) {
        range.push(-1); // represents "..."
      }
  
      range.push(total);
    }
  
    return range;
  }
  
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }
  updatePagination(): void {
    const term = this.searchTerm.trim();
  
    if (term) {
      // Only show filteredData, even if it's empty
      this.pagedData = this.filteredData.slice(this.start, this.end);
    } else {
      // If no search term, show all
      this.pagedData = this.insuranceData.slice(this.start, this.end);
    }
  }
  
  openModal(item: any): void {
    this.authserive.getEmployeeInsurance(item.employeeId).subscribe({
      next: (res) => {
        const base64 = this.selectedType === 1 ? res.fileContent : res.familyFileContent;
        const fileName = this.selectedType === 1 ? (res.fileName || 'download.pdf') : (res.familyFileName || 'download.pdf');

        if (!base64 || base64 === 'NA') {
          Swal.fire('Not Found', 'No file content available to view.', 'warning');
          return;
        }
  
        const pdfDataUrl = 'data:application/pdf;base64,' + base64;
        this.pdfUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(pdfDataUrl);
        this.selectedFileName = fileName;
        this.showModal = true;
      },
      error: () => {
        Swal.fire('Error', 'Failed to fetch the file.', 'error');
      }
    });
  }
  
  // openModal(item: any): void {
  //   const base64 = item.fileContent;
  //   if (!base64) {
  //     alert('No file content to view.');
  //     return;
  //   }

  //   const pdfDataUrl = 'data:application/pdf;base64,' + base64;
  //   this.pdfUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(pdfDataUrl);
  //   this.selectedFileName = this.getFileName(item.fileName);
  //   this.showModal = true;
  // }

  closeModal(): void {
    this.showModal = false;
    this.pdfUrlSafe = null;
  }
  searchTerm: string = '';
  filteredData: any[] = [];

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
  
    if (!term) {
      this.filteredData = [];
    } else {
      this.filteredData = this.insuranceData.filter(item =>
        item.employeeId?.toString().toLowerCase().includes(term) ||
        item.empName?.toLowerCase().includes(term)
      );
    }
  
    this.currentPage = 1;
    this.updatePagination();
  }
  
  
}
