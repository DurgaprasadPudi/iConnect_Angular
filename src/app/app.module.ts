import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { NavComponent } from './nav/nav.component';
import { SettingsComponent } from './settings/settings.component';
import { OwlModule } from 'ngx-owl-carousel';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { TrackCapslockDirective } from './directives/track-capslock.directive';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { DatePipe } from '@angular/common'; 
import { BirthdaysComponent } from './components/birthdays/birthdays.component';
import { DepartmentInfoComponent } from './components/department-info/department-info.component';
import { LeaveSummaryComponent } from './components/leave-summary/leave-summary.component';
import { AttendanceReportComponent } from './components/attendance-report/attendance-report.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NoDoubleClickBtnDirective } from './directives/no-double-click-btn.directive';
import { ErrorComponent } from './components/error/error.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AttendanceApprovalsComponent } from './manager/attendance-approvals/attendance-approvals.component';
import { NgIdleService } from './services/ng-idle-service.service'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LeaveApprovalsComponent } from './manager/leave-approvals/leave-approvals.component';
import { ManagerApprovalsComponent } from './manager/manager-approvals/manager-approvals.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DeptAttendanceComponent } from './manager/dept-attendance/dept-attendance.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DateSuffixPipe } from './pipes/date-suffix.pipe';
import { AssessmentExtendedReportComponent } from './HR/assessment-extended-report/assessment-extended-report.component';
import { AssessmentPermanentReportComponent } from './HR/assessment-permanent-report/assessment-permanent-report.component';
import { AssessmentProcessReportComponent } from './HR/assessment-process-report/assessment-process-report.component';
import { ProcessOfAssessmentComponent } from './HR/process-of-assessment/process-of-assessment.component';
import { HrmsComponent } from './HR/hrms/hrms.component';
import { AttendanceReportAssamComponent } from './components/attendance-report-assam/attendance-report-assam.component';
import { FooterComponent } from './footer/footer.component';
import { BusinessUnitAttendanceComponent } from './HR/business-unit-attendance/business-unit-attendance.component';
 
import { NgOtpInputModule } from 'ng-otp-input';
import { LeaveQuotaComponent } from './HR/leave-quota/leave-quota.component';
import { UnfreezeDatesComponent } from './HR/unfreeze-dates/unfreeze-dates.component';
import { FlexiPolicyComponent } from './HR/flexi-policy/flexi-policy.component';
import { AttendanceLogsComponent } from './HR/attendance-logs/attendance-logs.component';
import { AttendanceReaderComponent } from './HR/attendance-reader/attendance-reader.component';
import { CtcComponent } from './components/ctc/ctc.component';
import { ApplyLeaveComponent } from './components/apply-leave/apply-leave.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DebounceClickDirective } from './directives/debounce-click.directive';
import { MngrAssesmentFormComponent } from './manager/mngr-assesment-form/mngr-assesment-form.component';
import { AssmntFillFormComponent } from './manager/assmnt-fill-form/assmnt-fill-form.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { KeysPipe } from './pipes/keys.pipe';
import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';
import { SafePipe } from './pipes/safe.pipe';
import { NoCommaPipe } from './pipes/no-comma.pipe';
import { ProfileRequestsComponent } from './HR/profile-requests/profile-requests.component';
import { CommnctnAddrssComponent } from './HR/commnctn-addrss/commnctn-addrss.component';
import { PermntAddrssComponent } from './HR/permnt-addrss/permnt-addrss.component';
import { RestrictWhiteSpaceDirective } from './directives/restrict-white-space.directive';
import { IceAddressComponent } from './HR/ice-address/ice-address.component';
import { BankAddrssComponent } from './HR/bank-addrss/bank-addrss.component';
import { PanReqstsComponent } from './HR/pan-reqsts/pan-reqsts.component';
import { VaccineRegComponent } from './components/vaccine-reg/vaccine-reg.component';
import { MomentDatePipe } from './pipes/moment-date.pipe';
import { InOutTimeBarComponent } from './in-out-time-bar/in-out-time-bar.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HomepageComponent } from './homepage/homepage.component';
import { HRpoliciesComponent } from './hrpolicies/hrpolicies.component';
import { NoRightClickDirective } from './directives/no-right-click.directive';
import { AnnouncementsComponent } from './HR/announcements/announcements.component';
import { SaturdayPolicyComponent } from './HR/saturday-policy/saturday-policy.component';
import { EmployeeLetterComponent } from './employee-letter/employee-letter.component';
import { ReviewLetterComponent } from './HR/review-letter/review-letter.component';
import { EmployeeHikeLetterComponent } from './employee-hike-letter/employee-hike-letter.component';
import { HikeReviewLetterComponent } from './HR/hike-review-letter/hike-review-letter.component';
import { PayslipsuploadsComponent } from './HR/payslipsuploads/payslipsuploads.component';
import { FamilyDetailsComponent } from './family-details/family-details.component';
import { MastercreationComponent } from './mastercreation/mastercreation.component';
import { LeavequotaComponent } from './leavequota/leavequota.component';
import { IdcardComponent } from './idcard/idcard.component';
import { UtilitiesComponent } from './utilities/utilities.component';
import { PromotionLetterComponent } from './promotion-letter/promotion-letter.component';
import { WorksheetComponent } from './worksheet/worksheet.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { AssethistoryComponent } from './assethistory/assethistory.component';
import { AssetDataComponent } from './assertdata/asset-data.component';
import { AssetmainComponent } from './assetmain/assetmain.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EmployeeAssertModuleComponent } from './employee-assert-module/employee-assert-module.component';
import { AssetRequestFormComponent } from './components/asset-request-form/asset-request-form.component';
import { AssetItAdminComponent } from './components/asset-it-admin/asset-it-admin.component';
import { QRManagementComponent } from './qrmanagement/qrmanagement.component';
import { ConfirmationLetterComponent } from './HR/confirmation-letter/confirmation-letter.component';
import { PasswordcreationComponent } from './HR/passwordcreation/passwordcreation.component';
import { AttendanceComponent } from './HR/attendance/attendance.component';
import { VacantpositionsComponent } from './components/vacantpositions/vacantpositions.component';
import { RequisitionformComponent } from './components/requisitionform/requisitionform.component';
import { IdcardHistoryComponent } from './idcard-history/idcard-history.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { UploadInsuranceDetailsComponent } from './HR/upload-insurance-details/upload-insurance-details.component';
import { MasterReportComponent } from './HR/master-report/master-report.component';
 
  
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavComponent,
    SettingsComponent,
    NumbersOnlyDirective,
    TrackCapslockDirective,
    ProgressBarComponent, 
    BirthdaysComponent,
    DepartmentInfoComponent,
    LeaveSummaryComponent,
    AttendanceReportComponent,
    NoDoubleClickBtnDirective,
    ErrorComponent,
    AttendanceApprovalsComponent, 
    LeaveApprovalsComponent,
    ManagerApprovalsComponent,
    DeptAttendanceComponent,
    DateSuffixPipe,
    AssessmentExtendedReportComponent,
    AssessmentPermanentReportComponent,
    AssessmentProcessReportComponent, 
    ProcessOfAssessmentComponent, HrmsComponent, 
    AttendanceReportAssamComponent, FooterComponent, 
    BusinessUnitAttendanceComponent, LeaveQuotaComponent, 
    UnfreezeDatesComponent, FlexiPolicyComponent, 
    AttendanceLogsComponent, AttendanceReaderComponent, 
    CtcComponent, ApplyLeaveComponent, 
    DebounceClickDirective, 
    MngrAssesmentFormComponent, 
    AssmntFillFormComponent, ProfilePageComponent, KeysPipe,
     BlockCopyPasteDirective, SafePipe, NoCommaPipe,
     ProfileRequestsComponent, 
     CommnctnAddrssComponent, 
     PermntAddrssComponent, 
     RestrictWhiteSpaceDirective, 
     IceAddressComponent, 
     BankAddrssComponent, 
     PanReqstsComponent, 
     VaccineRegComponent, 
     MomentDatePipe,
     InOutTimeBarComponent, 
     HomepageComponent, HRpoliciesComponent, NoRightClickDirective, AnnouncementsComponent, SaturdayPolicyComponent, EmployeeLetterComponent, ReviewLetterComponent, EmployeeHikeLetterComponent, HikeReviewLetterComponent, PayslipsuploadsComponent, FamilyDetailsComponent, MastercreationComponent, LeavequotaComponent, IdcardComponent, UtilitiesComponent, PromotionLetterComponent,WorksheetComponent, BulkUploadComponent, AssethistoryComponent, AssetDataComponent, AssetmainComponent, SidebarComponent, EmployeeAssertModuleComponent, AssetRequestFormComponent, AssetItAdminComponent, QRManagementComponent, ConfirmationLetterComponent, PasswordcreationComponent, AttendanceComponent, VacantpositionsComponent, RequisitionformComponent, IdcardHistoryComponent, InsuranceDetailsComponent, UploadInsuranceDetailsComponent, MasterReportComponent 
  ],
  imports: [   
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule, 
    ChartsModule,
    OwlModule, 
    TooltipModule,
    Ng2SearchPipeModule, 
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}), 
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    AutocompleteLibModule,
    ImageCropperModule,
    NgOtpInputModule,
    TimepickerModule.forRoot(),
  ],
  providers: [DatePipe, NgIdleService,{provide: LocationStrategy, useClass: HashLocationStrategy}, NgxImageCompressService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
 