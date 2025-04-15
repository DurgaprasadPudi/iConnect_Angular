
import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jobcode',
  templateUrl: './jobcode.component.html',
  styleUrls: ['./jobcode.component.sass']
})
export class JobcodeComponent implements OnInit {
loggedUser:any;
userData:any;
myDate:any;
isModalOpen = false; 
isSuccessModal=false;
privileges: any = {};
sortDir: number = 1;
  constructor() { this.sortArr('name'); }

  ngOnInit(): void {
    this.loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(this.loggedUser);
    this.myDate = decodeURIComponent(window.atob(localStorage.getItem('currentDate')));
    moment.locale('en');

    let privileges = decodeURIComponent(window.atob(localStorage.getItem('privileges')));
    this.privileges = JSON.parse(privileges).Rights;
}
  
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }

 openSuccessModal(): void {
    this.isModalOpen = false;
    this.isSuccessModal = true;
  }
  closeSuccessModal(): void {
    this.isSuccessModal = false;
  }
  submitForm(event: Event): void {
    event.preventDefault(); 
    this.openSuccessModal();
  }
  selected: string = ''; 

  showText(button: string) {
    this.selected = button; 
  }
   exportToExcel(): void {
    // Data for the sheet
    const data = [
      ['Name', 'Age', 'Location'],  // Header row
      ['John Doe', 25, 'New York'],
      ['Jane Smith', 30, 'Los Angeles'],
      ['Sam Johnson', 22, 'Chicago']
    ];

    // Create a worksheet from the data
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    // Apply styles to the header row (row index 0)
    const headerStyle = {
      fill: {
        patternType: 'solid',
        fgColor: { rgb: 'FFFF00' }  // Yellow background
      },
      font: {
        bold: true,
        color: { rgb: '000000' }  // Black text
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      }
    };

    // Apply the style to the header cells (first row, index 0)
    const range = XLSX.utils.decode_range(ws['!ref']); // Get sheet range (i.e., A1:C4)
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = { r: 0, c: col };  // Target the first row (header row)
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      if (!ws[cellRef]) {
        ws[cellRef] = {}; // Create the cell if it doesn't exist
      }
      Object.assign(ws[cellRef], headerStyle); // Apply the style to the header
    }

    // Create the workbook
    const wb: XLSX.WorkBook = {
      Sheets: { 'Sheet1': ws },
      SheetNames: ['Sheet1']
    };

    // Generate Excel file from the workbook
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob and trigger download
    const excelFile = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelFile, 'styled-header-excel.xlsx');
  }

isarrow:boolean=false;
homeIcon: string = 'fa fa-chevron-up';
toggle(){
 this.isarrow=!this.isarrow;
  this.homeIcon=this.isarrow? 'fa fa-chevron-down':'fa fa-chevron-up';
}
// displaytext:string='';
// clicktext(val:string){
//   console.warn(val);
// this.displaytext=val;
// }
 lastKey: string = '';
  eventType: string = '';

  onKeyDown(event: KeyboardEvent) {
    this.lastKey = event.key;
    this.eventType = 'keydown';
    console.log('Key Down:', event.key);
  }

  onKeyPress(event: KeyboardEvent) {
    this.lastKey = event.key;
    this.eventType = 'keypress';
    console.log('Key Press:', event.key);
  }

  onKeyUp(event: KeyboardEvent) {
    this.lastKey = event.key;
    this.eventType = 'keyup';
    console.log('Key Up:', event.key);
  }
   finalValue: string = '';

  onChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.finalValue = inputElement.value;
    console.log('Change Event Triggered:', this.finalValue);
  }
   currentValue: string = '';

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.currentValue = inputElement.value;
    console.log('Input Event Triggered:', this.currentValue);
  }
  clicktext(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.currentValue = inputElement.value;
    console.log('Input Event Triggered:', this.currentValue);
  }
employees=[{
  id:'2', name:'sneha',department:'it'},
  {id:'1',name:'swathi', department:'abc'},
  {id:'3',name:'anu', department:'xyz'}

]
onSortClick(event: Event) {
    const target = event.currentTarget as HTMLElement;
    const classList = target.classList;

    // Toggle sorting direction
    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }

    // Sort the array
    this.sortArr('fname');
  }

  sortArr(colName: string) {
    this.employees.sort((a, b) => {
      const valA = a[colName].toLowerCase();
      const valB = b[colName].toLowerCase();
      return valA.localeCompare(valB) * this.sortDir;
    });
  }
}


