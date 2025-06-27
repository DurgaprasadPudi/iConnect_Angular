import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { SettingsComponent } from './settings/settings.component'; 
import { BirthdaysComponent } from './components/birthdays/birthdays.component';
import { DepartmentInfoComponent } from './components/department-info/department-info.component';
import { LeaveSummaryComponent } from './components/leave-summary/leave-summary.component';
import { AttendanceReportComponent } from './components/attendance-report/attendance-report.component';
import { ErrorComponent } from './components/error/error.component';
import { AttendanceApprovalsComponent } from './manager/attendance-approvals/attendance-approvals.component'; 
import { LeaveApprovalsComponent } from './manager/leave-approvals/leave-approvals.component';
import { ManagerApprovalsComponent } from './manager/manager-approvals/manager-approvals.component';
import { DeptAttendanceComponent } from './manager/dept-attendance/dept-attendance.component';
import { AssessmentExtendedReportComponent } from './HR/assessment-extended-report/assessment-extended-report.component';
import { AssessmentPermanentReportComponent } from './HR/assessment-permanent-report/assessment-permanent-report.component';
import { AssessmentProcessReportComponent } from './HR/assessment-process-report/assessment-process-report.component';
import { ProcessOfAssessmentComponent } from './HR/process-of-assessment/process-of-assessment.component';
import { HrmsComponent } from './HR/hrms/hrms.component';
import { AttendanceReportAssamComponent } from './components/attendance-report-assam/attendance-report-assam.component';
import { BusinessUnitAttendanceComponent } from './HR/business-unit-attendance/business-unit-attendance.component';
 
import { UnfreezeDatesComponent } from './HR/unfreeze-dates/unfreeze-dates.component';
import { FlexiPolicyComponent } from './HR/flexi-policy/flexi-policy.component';
import { AttendanceLogsComponent } from './HR/attendance-logs/attendance-logs.component';
import { AttendanceReaderComponent } from './HR/attendance-reader/attendance-reader.component';
import { CtcComponent } from './components/ctc/ctc.component';
import { ApplyLeaveComponent } from './components/apply-leave/apply-leave.component';
import { MngrAssesmentFormComponent } from './manager/mngr-assesment-form/mngr-assesment-form.component';
import { AssmntFillFormComponent } from './manager/assmnt-fill-form/assmnt-fill-form.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { ProfileRequestsComponent } from './HR/profile-requests/profile-requests.component';
import { CommnctnAddrssComponent } from './HR/commnctn-addrss/commnctn-addrss.component';
import { PermntAddrssComponent } from './HR/permnt-addrss/permnt-addrss.component';
import { IceAddressComponent } from './HR/ice-address/ice-address.component';
import { BankAddrssComponent } from './HR/bank-addrss/bank-addrss.component';
import { PanReqstsComponent } from './HR/pan-reqsts/pan-reqsts.component';
import { VaccineRegComponent } from './components/vaccine-reg/vaccine-reg.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HRpoliciesComponent } from './hrpolicies/hrpolicies.component';
import { AnnouncementsComponent } from './HR/announcements/announcements.component';
import { SaturdayPolicyComponent } from './HR/saturday-policy/saturday-policy.component';
import { EmployeeLetterComponent } from './employee-letter/employee-letter.component';
import { ReviewLetterComponent } from './HR/review-letter/review-letter.component';
import { HikeReviewLetterComponent } from './HR/hike-review-letter/hike-review-letter.component';
import { EmployeeHikeLetterComponent } from './employee-hike-letter/employee-hike-letter.component';
import { PayslipsuploadsComponent } from './HR/payslipsuploads/payslipsuploads.component';
import { FamilyDetailsComponent } from './family-details/family-details.component';
import { MastercreationComponent } from './mastercreation/mastercreation.component';
import { LeavequotaComponent } from './leavequota/leavequota.component';
import { IdcardComponent } from './idcard/idcard.component';
import { UtilitiesComponent } from './utilities/utilities.component';
import { PromotionLetterComponent } from './promotion-letter/promotion-letter.component';
import { WorksheetComponent } from './worksheet/worksheet.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { AssetmainComponent } from './assetmain/assetmain.component';
import { AssetDataComponent } from './assertdata/asset-data.component';
import { AssethistoryComponent } from './assethistory/assethistory.component';
import { EmployeeAssertModuleComponent } from './employee-assert-module/employee-assert-module.component';
import {AssetRequestFormComponent} from 'src/app/components/asset-request-form/asset-request-form.component';
import {AssetItAdminComponent} from 'src/app/components/asset-it-admin/asset-it-admin.component';
import { QRManagementComponent } from './qrmanagement/qrmanagement.component';
import { ConfirmationLetterComponent } from './HR/confirmation-letter/confirmation-letter.component';
import { PasswordcreationComponent } from './HR/passwordcreation/passwordcreation.component';
import { AttendanceComponent } from './HR/attendance/attendance.component';
import { RequisitionformComponent } from './components/requisitionform/requisitionform.component';
import { VacantpositionsComponent } from './components/vacantpositions/vacantpositions.component';
import { IdcardHistoryComponent } from './idcard-history/idcard-history.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { UploadInsuranceDetailsComponent } from './HR/upload-insurance-details/upload-insurance-details.component';
import { MasterReportComponent } from './HR/master-report/master-report.component';
  
const routes: Routes = [ 
  { path: '', pathMatch: 'full', redirectTo: 'login'},
  { path: 'login', component: LoginComponent }, 
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard]  },
  { path: 'home', component: HomepageComponent,canActivate: [AuthGuard]  },

  { path: 'settings', component: SettingsComponent,canActivate: [AuthGuard]  }, 
  { path: 'profilePage', component: ProfilePageComponent,canActivate: [AuthGuard]  }, 

  
  { path: 'birthdays', component: BirthdaysComponent,canActivate: [AuthGuard] },
  { path: 'deptInfo', component: DepartmentInfoComponent,canActivate: [AuthGuard] },
  { path: 'leaveSummary', component: LeaveSummaryComponent,canActivate: [AuthGuard] },
  { path: 'attendanceReport', component: AttendanceReportComponent,canActivate: [AuthGuard]},
  { path: 'attendance', component: AttendanceComponent,canActivate: [AuthGuard]},
  { path: 'attendanceReportAssam', component: AttendanceReportAssamComponent,canActivate: [AuthGuard]}, 
  { path: 'applyLeave', component: ApplyLeaveComponent,canActivate: [AuthGuard]},

  { path: 'ctcInfo', component: CtcComponent,canActivate: [AuthGuard]},
  { path: 'vaccination', component: VaccineRegComponent,canActivate: [AuthGuard]},
  { path: 'HR-Policies', component: HRpoliciesComponent,canActivate: [AuthGuard]},

  { path: 'employeeletter', component: EmployeeLetterComponent,canActivate: [AuthGuard]},

  { path: 'reviewletter', component: ReviewLetterComponent,canActivate: [AuthGuard]},

  { path: 'employeehikeletter', component: EmployeeHikeLetterComponent,canActivate: [AuthGuard]},
  { path: 'hikereviewletter', component: HikeReviewLetterComponent,canActivate: [AuthGuard]},
  { path: 'Payslipupload', component: PayslipsuploadsComponent,canActivate: [AuthGuard]},
  


  // HRMS 
  { path: 'hrms', component: HrmsComponent,canActivate: [AuthGuard]  },
  { path: 'assessmentProcess', component: ProcessOfAssessmentComponent,canActivate: [AuthGuard]  },
  { path: 'assessmentExtendedReport', component: AssessmentExtendedReportComponent,canActivate: [AuthGuard]  },
  { path: 'assessmentPermanentReport', component: AssessmentPermanentReportComponent,canActivate: [AuthGuard]  },
  { path: 'assessmentProcessReport', component: AssessmentProcessReportComponent,canActivate: [AuthGuard]  },
  { path: 'buAttendance', component: BusinessUnitAttendanceComponent,canActivate: [AuthGuard]  },
  { path: 'unfreezeDates', component: UnfreezeDatesComponent,canActivate: [AuthGuard] },
  { path: 'flexiPolicy', component: FlexiPolicyComponent,canActivate: [AuthGuard] },
  { path: 'attendanceLogs', component: AttendanceLogsComponent,canActivate: [AuthGuard] },
  { path: 'attendanceReader', component: AttendanceReaderComponent,canActivate: [AuthGuard] },
  { path: 'profileRequests', component: ProfileRequestsComponent,canActivate: [AuthGuard]},
  { path: 'commnctnAddrssReqsts', component: CommnctnAddrssComponent,canActivate: [AuthGuard]},
  { path: 'permntAddrssReqsts', component: PermntAddrssComponent,canActivate: [AuthGuard]},
  { path: 'iceAddressReqsts', component: IceAddressComponent,canActivate: [AuthGuard]},
  { path: 'bankAddrssReqsts', component: BankAddrssComponent,canActivate: [AuthGuard]},
  { path: 'panReqsts', component: PanReqstsComponent,canActivate: [AuthGuard]},
  { path: 'postAnnouncement', component: AnnouncementsComponent,canActivate: [AuthGuard]},
  {path: 'saturdayPolicy', component: SaturdayPolicyComponent,canActivate: [AuthGuard]},
      

  // Manager 
  { path: 'managerApprovals', component: ManagerApprovalsComponent,canActivate: [AuthGuard]},    
  { path: 'attendanceApprovals', component: AttendanceApprovalsComponent,canActivate: [AuthGuard]},  
  { path: 'leaveApprovals', component: LeaveApprovalsComponent,canActivate: [AuthGuard]},
  { path: 'deptAttendance/:id', component: DeptAttendanceComponent,canActivate: [AuthGuard]},
  { path: 'assesmentForm', component: MngrAssesmentFormComponent,canActivate: [AuthGuard]},
  { path: 'assesmentFillForm', component: AssmntFillFormComponent,canActivate: [AuthGuard]},
  { path: 'errorPage', component: ErrorComponent},
  {path:'familydetails',component:FamilyDetailsComponent, canActivate: [AuthGuard]},
  {
    path: 'mastercreation',
    component: MastercreationComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'create-university' }, // Default redirect
      { path: 'create-university', component: MastercreationComponent },
      { path: 'create-department', component: MastercreationComponent },
      { path: 'assign-department', component: MastercreationComponent },
      { path: 'create-designation', component: MastercreationComponent },
      { path: 'assign-designation', component: MastercreationComponent },
      { path: 'create-qualification', component: MastercreationComponent },
    ], canActivate: [AuthGuard]
  },   
   
  {path:'LeaveQuota',component:LeavequotaComponent, canActivate: [AuthGuard]},
  { path: 'idcard', component: IdcardComponent, canActivate: [AuthGuard] },
{path:'utilities',component:UtilitiesComponent, canActivate: [AuthGuard]},
{path:'promotionletter',component:PromotionLetterComponent, canActivate: [AuthGuard]},
{path:'worksheet',component:WorksheetComponent, canActivate: [AuthGuard]},
{path:'bulkupload',component:BulkUploadComponent, canActivate: [AuthGuard]},
 
  {path: 'assetamain',component:AssetmainComponent, canActivate: [AuthGuard]},
  { path: 'asset', component: AssetDataComponent, canActivate: [AuthGuard] },
  { path: 'assethistory', component: AssethistoryComponent, canActivate: [AuthGuard] },
  //{path:'employeeasset',component:EmployeeAssertModuleComponent},
   {
    path: 'employeeasset',
    component: EmployeeAssertModuleComponent,
    children: [
      // Redirect to /employeeasset/employeehistory when no child path is specified
      { path: '', pathMatch: 'full', redirectTo: 'employeeassets' },
      { path: 'employeetable', component: EmployeeAssertModuleComponent } ,
      { path: 'employeeassets', component: EmployeeAssertModuleComponent }
      // { path: 'employeehistory', component: EmployeeAssertModuleComponent }  // Ensure this points to the correct component
    ], canActivate: [AuthGuard]
  },{ path: 'AssetAllocationRequest', component: AssetRequestFormComponent,canActivate: [AuthGuard] },
  { path: 'AssetITAdmin', component: AssetItAdminComponent,canActivate: [AuthGuard] },
  
  { path: 'qr-management', component: QRManagementComponent,canActivate: [AuthGuard] },
  { path: 'confirmationletter', component: ConfirmationLetterComponent,canActivate: [AuthGuard] },
  { path: 'passswordcreation', component: PasswordcreationComponent,canActivate: [AuthGuard] },
  
  {path:'requisitionform', component:RequisitionformComponent},
  {path:'vacantposition',component:VacantpositionsComponent},
  { path: 'idcardhistory', component: IdcardHistoryComponent,canActivate: [AuthGuard] },
  {path:'insurance-details',component:InsuranceDetailsComponent,canActivate:[AuthGuard]},  
  {path:'upload-insurance-details',component:UploadInsuranceDetailsComponent,canActivate:[AuthGuard]},
  {path:'master-report',component:MasterReportComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
