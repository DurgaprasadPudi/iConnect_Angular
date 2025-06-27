import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.sass']
})
export class InsuranceDetailsComponent implements OnInit {
  insuranceData: any;
  loggedUser: any = {};
  userData: any;
  myDate: any;

 fileName = ''; // ✅ safe & simple

  currentFileTitle: string = '';
  currentFileContent: string = '';
  currentFileName: string = '';
  sanitizedPdfUrl!: SafeResourceUrl;
  isModalVisible: boolean = false;
  manualFiles: { [filename: string]: string } = {};


  constructor(private sanitizer: DomSanitizer,private authservice:AuthService) {}

  ngOnInit(): void {
    
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    this.userData = this.loggedUser.userData;
    this.myDate = new Date();

    const data = localStorage.getItem('insuranceData');
    if (data) {
      this.insuranceData = JSON.parse(data);
    }
    document.body.style.backgroundColor = '#ffffff';
    this.fetchManuals();
  }
  fetchManuals(): void {
    this.authservice.getInsuranceInfo().subscribe({
      next: (res) => {
        this.manualFiles = res || {};
        console.log("manual files",this.manualFiles);
      },
      error: (err) => {
        console.error('Failed to fetch manuals', err);
      }
    });
  }
  ngOnDestroy(): void {
    document.body.style.backgroundColor = '';
  }
  openModal(type: 'self' | 'family'): void {
    const isSelf = type === 'self';

    const base64 = isSelf ? this.insuranceData?.fileContent : this.insuranceData?.familyFileContent;
    const fileName = isSelf ? this.insuranceData?.fileName : this.insuranceData?.familyFileName;

    if (base64 && base64 !== 'NA') {
      this.currentFileContent = base64;
      this.currentFileName = fileName || (isSelf ? 'Self_Insurance.pdf' : 'Family_Insurance.pdf');
      this.currentFileTitle = isSelf ? 'Self Insurance' : 'Family Insurance';
      this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + base64);
      this.isModalVisible = true;
    } else {
      alert(`${isSelf ? 'Self' : 'Family'} insurance file not available`);
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.currentFileContent = '';
  }
  
  openModal1(type: string): void {
    let fileName = '';
  
    if (type === 'claim') {
      fileName = 'SELF_CLAIM_DOC.pdf';
      this.currentFileTitle = 'Claim Documents';
    } else if (type === 'policy') {
      fileName = 'SELF_POLICY_BENIFITS_DOC.pdf';
      this.currentFileTitle = 'Policy Benefits Document';
    }
  
    const fileContent = this.manualFiles[fileName];
  
    if (fileContent && fileContent !== 'NA') {
      this.currentFileName = fileName;
      this.currentFileContent = fileContent;
      const pdfUrl = 'data:application/pdf;base64,' + fileContent;
      this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      this.isModalVisible = true;
    } else {
      console.warn('File not found or invalid:', fileName);
    }
  }
  hasManualFile(fileName: string): boolean {
    return !!this.manualFiles[fileName] && this.manualFiles[fileName] !== 'NA';
  }
  
  openManualPdf(fileName: string, title: string): void {
    const fileContent = this.manualFiles[fileName];
  
    if (fileContent && fileContent !== 'NA') {
      this.currentFileName = fileName;
      this.currentFileTitle = title;
      this.currentFileContent = fileContent;
  
      const pdfUrl = 'data:application/pdf;base64,' + fileContent;
      this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      this.isModalVisible = true;
    } else {
      console.warn('Manual PDF not available:', fileName);
    }
  }
  
  downloadBase64Pdf(base64Str: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,' + base64Str;
    link.download = fileName;
    link.click();
  }
}
