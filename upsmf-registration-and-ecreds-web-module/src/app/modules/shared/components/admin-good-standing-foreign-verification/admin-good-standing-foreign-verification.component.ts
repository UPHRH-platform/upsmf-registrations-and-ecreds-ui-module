import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import {Location } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { DialogBoxComponent, DialogModel } from '../dialog-box/dialog-box.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http-service/http.service';
import { ConfigService } from '../../services/config/config.service';
import { MatDialog } from '@angular/material/dialog';
import { BaseServiceService } from 'src/app/services/base-service.service';
import { Observable } from 'rxjs';
import { applabels } from 'src/app/messages/labels';
import * as QRCode from 'qrcode';
import { BreadcrumbItem } from '../../interfaces';

@Component({
  selector: 'app-admin-good-standing-foreign-verification',
  templateUrl: './admin-good-standing-foreign-verification.component.html',
  styleUrls: ['./admin-good-standing-foreign-verification.component.scss']
})
export class AdminGoodStandingForeignVerificationComponent {
  candidateDetails: boolean = true;
  links = ['Candidate Details']

  goodStandingForeignVerificationformGroup: FormGroup;
  submitted = false;
  formsReady: boolean = false;

  labels = applabels;
  form1Html: any
  resp:any;

  logo = '../../../../../assets/images/sunbird_logo.png';
  internalLogo = '../../../../../assets/images/up_smf_logo-24_x_24.png';
  listOfFiles: any[] = [];
  fileList: File[] = [];
  candidateDetailList: any[] = [];
  listOfCourseFiles: any[] = [];
  courseFileList: File[] = [];

  docsUrl: any[] = [];
  urlData: any[] = [];
  convertUrlList: string;
  urlList: any;
  updatedUrlList: any;
  userRole: any;
  userEmail: any;
  urlDataResponse: string;
  entityId: string;
  entityName: string
  filePreview:any;
  entity: string;
  id:string;
  ecStatus:string;
  osid: string;
  stateData: any;
  customData: any;
  type: string;
  endPointUrl: any;
  docsResponseUrl: string;
  paymentDetails: boolean = false;
  selectedLink: string = 'Candidate Details';
  paymentResponse: any;
  isInactive = true;
  reason:string;
  


  profQualificationArray = ['A.N.M', 'Midwife', 'H.W', 'Nurse', 'B.SC.Nursing'];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  monthMap: { [key: string]: string } = {
    "January": "01",
    "February": "02",
    "March": "03",
    "April": "04",
    "May": "05",
    "June": "06",
    "July": "07",
    "August": "08",
    "September": "09",
    "October":"10",
    "November":"11",
    "December":"12"
  }

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Workspace', url: '/admin' },
    { label: 'Claim Manage', url: '/admin/manage-claim' },
    // { label: 'Claim Certificate', url: '/admin/view-claim' },
    { label: 'View Claim ', url: '/admin/goodStanding-foreign-claim' },


  ];

  activity: Observable<any>;

  constructor(private formBuilder: FormBuilder, private baseService: BaseServiceService,
    private router: Router,
    public dialog: MatDialog,
    private location: Location,
    private configService: ConfigService,
    private http: HttpService,
    private route: ActivatedRoute,
  ) {
    this.userEmail = this.baseService.getUserRole()[0]
    console.log(this.userEmail)
    this.stateData = this.router?.getCurrentNavigation()?.extras.state;

    console.log("stateData:", this.stateData.body)
  }

  ngOnInit() {
    this.initForm();

    this.route.queryParams.subscribe((param) => {
      if (param['resData']) {
        this.paymentResponse = JSON.parse(param['resData'])
        this.paymentDetails = this.paymentResponse.isPayment
      }
    })
    console.log(this.osid)
  }

  getCandidatePersonalDetails() {
    console.log("getting getCandidatePersonalDetails")
    this.osid = this.stateData.body.entityId
    this.entity = this.stateData.body.entity
    this.id=this.stateData?.body.id
    this.ecStatus=this.stateData.body.outsideStudentStatus
    console.log("status",this.ecStatus)
    console.log("entity", this.entity)
    if (this.entity === "StudentGoodstanding" && this.userEmail === "Regulator") {
      this.baseService.getCandidatePersonalDetailsRegulator$(this.entity,this.osid)
        .subscribe(
          (response: any) => {
            console.log("data", response)
            this.getRejectReasonAdmin();
            this.urlDataResponse = response.responseData.docproof;
            this.entityId=response.responseData.studentGoodstandingVerification[0].entityId
            this.entityName=response.responseData.studentGoodstandingVerification[0].entityName
            if (!!this.urlDataResponse) {
              this.urlData = this.urlDataResponse?.split(",").filter(url => url.trim() !== "");
              console.log('urlDaaaa', this.urlData)
              this.filePreview= response.responseData.candidatePic;
              if(!!this.filePreview){
                const fileName = this.filePreview.split('/').pop();
                const extractLastPart = fileName?.split('_').pop();
                const getuploadObject = {
                  name: extractLastPart,
                  url: this.filePreview
                }
                this.filePreview = getuploadObject
              }
              if (this.urlData.length) {
                this.listOfFiles = this.urlData?.map(url => {
                  // const parts = url.split('=');
                  const fileNameWithQueryParams = url;
                  const fileName = fileNameWithQueryParams.split('/').pop();
                  const extractLastPart = fileName?.split('_').pop();
                  const getuploadObject = {
                    name: extractLastPart,
                    url: url
                  }
                  return getuploadObject;
                });
              }
            }
            const joinM = response.responseData.joiningMonth;
            const jm = this.monthMap[joinM]
            const passM = response.responseData.passingMonth;
            const pm = this.monthMap[passM]
            console.log("pass",passM)
            this.goodStandingForeignVerificationformGroup.patchValue({
              maidenName: response.responseData.name,
              mrdName: response.responseData.marriedName,
              email: response.responseData.email,
              mobNumber: response.responseData.phoneNumber,
              applicantName: response.responseData.name,
              adhr: response.responseData.aadhaarNo,
              fatherName: response.responseData.fathersName,
              dob: response.responseData.dob,
              gender: response.responseData.gender,
              al1: response.responseData.presentAddress,
              // al2: response.responseData.presentAddress,
              state: response.responseData.state,
              pin: response.responseData.pincode,
              district: response.responseData.district,
              country: response.responseData.country,
              placeOfWork: response.responseData.workPlace,
              tcName: response.responseData.trainingCenter,
              regnNum: response.responseData.registrationNumber,
              proQual: response.responseData.professionalQualification,
              joinDate: response.responseData.joiningDate,
              passDate: response.responseData.courseDate,
              council: response.responseData.council
            });
          });
    }

  }
  getCandidatePersonalDetailsForeign() {
    console.log("getting getCandidatePersonalDetails")
    console.log("getting getCandidatePersonalDetails")
    this.osid = this.stateData.body.entityId
    this.entity = this.stateData.body.entity
    this.id=this.stateData?.body.id
    this.ecStatus=this.stateData.body.outsideStudentStatus
    if (this.entity === "StudentForeignVerification" && this.userEmail === "Regulator") {
      this.baseService.getCandidatePersonalDetailsRegulator$(this.entity,this.osid)
        .subscribe(
          (response: any) => {
            this.getRejectReasonAdmin();
            this.urlDataResponse = response.responseData.docproof;
            this.entityId=response.responseData.StudentForeignVerify[0].entityId
            this.entityName=response.responseData.StudentForeignVerify[0].entityName
            if (!!this.urlDataResponse) {
              this.urlData = this.urlDataResponse?.split(",").filter(url => url.trim() !== "");
              console.log('urlDaaaa', this.urlData)
              this.filePreview= response.responseData.candidatePic;
              if(!!this.filePreview){
                const fileName = this.filePreview.split('/').pop();
                const extractLastPart = fileName?.split('_').pop();
                const getuploadObject = {
                  name: extractLastPart,
                  url: this.filePreview
                }
                this.filePreview = getuploadObject
              }
              if (this.urlData.length) {
                this.listOfFiles = this.urlData?.map(url => {
                  // const parts = url.split('=');
                  const fileNameWithQueryParams = url;
                  const fileName = fileNameWithQueryParams.split('/').pop();
                  const extractLastPart = fileName?.split('_').pop();
                  const getuploadObject = {
                    name: extractLastPart,
                    url: url
                  }
                  return getuploadObject;
                });
              }
            }
            const month = (new Date(Date.parse(response.responseData.joiningMonth + " 1, 2012")).getMonth() + 1 < 10) ?
              "0" + (new Date(Date.parse(response.responseData.joiningMonth + " 1, 2012")).getMonth() + 1) :
              new Date(Date.parse(response.responseData.joiningMonth + " 1, 2012")).getMonth() + 1
            const joinM = response.responseData.joiningMonth;
            const jm = this.monthMap[joinM]
            const passM = response.responseData.passingMonth;
            const pm = this.monthMap[passM]
            
            this.goodStandingForeignVerificationformGroup.patchValue({
              maidenName: response.responseData.name,
              mrdName: response.responseData.marriedName,
              email: response.responseData.email,
              mobNumber: response.responseData.phoneNumber,
              applicantName: response.responseData.name,
              adhr: response.responseData.aadhaarNo,
              fatherName: response.responseData.fathersName,
              dob: response.responseData.dob,
              gender: response.responseData.gender,
              al1: response.responseData.address,
              // al2: response.responseData.address,
              state: response.responseData.state,
              pin: response.responseData.pincode,
              district: response.responseData.district,
              country: response.responseData.country,
              placeOfWork: response.responseData.workPlace,
              tcName: response.responseData.trainingCenter,
              regnNum: response.responseData.registrationNumber,
              proQual: response.responseData.professionalQualification,
              joinDate: response.responseData.joiningYear + "-" + jm + "-01",
              passDate: response.responseData.passingYear + "-" + pm + "-01",
              council: response.responseData.council

            });
          });

    }




  }

  initForm() {
    this.goodStandingForeignVerificationformGroup = this.formBuilder.group({
      maidenName: new FormControl('', [
        Validators.required]),
      mrdName: new FormControl('', [
        Validators.required]),
      fatherName: new FormControl('', [
        Validators.required]),
      dob: new FormControl('', [
        Validators.required]),
      al1: new FormControl('', [
        Validators.required]),
      // al2: new FormControl('', [
      //   Validators.required]),
      district: new FormControl('', [
        Validators.required]),
      state: new FormControl('', [
        Validators.required]),
      pin: new FormControl('', [
        Validators.required]),
      country: new FormControl('', [
        Validators.required]),
      adhr: new FormControl('', [
        Validators.required]),
      proQual: new FormControl('', [
        Validators.required]),
      regnNum: new FormControl('', [
        Validators.required]),
        joinDate: new FormControl('', [
          Validators.required]),
        passDate: new FormControl('', [
          Validators.required]),
      tcName: new FormControl('', [
        Validators.required]),
      placeOfWork: new FormControl('', [
        Validators.required]),
        
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      mobNumber: new FormControl('', [
        Validators.required,
        Validators.pattern("^(0|91)?[6-9][0-9]{9}$")]),
      council: new FormControl('', [Validators.required])
    });
    this.goodStandingForeignVerificationformGroup.disable();
    { { (this.stateData.body.entity === "StudentForeignVerification" ? this.getCandidatePersonalDetailsForeign() : this.getCandidatePersonalDetails()) } }



  }
  navigateToUrl(item: any) {
    window.open(item, "_blank");
  }
  getStatusColorClass(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'open';
      case 'CLOSED':
        return 'closed';
      case 'REJECTED':
        return 'rejected';
      default:
        return '';
    }
  }

  onGoodStandingForeignVerificationformSubmit(value: any) {
    this.submitted = true;
    const osid = this.stateData.body.id
    if (this.ecStatus === "APPROVED") {
      const approveBody = {
        action: "GRANT_CLAIM",
        notes: "Registration Certificate"
      }
      this.baseService.approveClaim$(osid, approveBody)
        .subscribe((response) => {
          this.navToPreviousPage();
        })
    }
    else {

      console.log("value....", value)

      if(this.userEmail==="Regulator" && !this.ecStatus){
      const message = `Enter the email`;
      const message1 = `Upload Document`;

      const shouldShowFileUpload = true;
      const resDialog = new DialogModel(message, message1);

      let dialogRef = this.dialog.open(DialogBoxComponent, {
        disableClose: true,

        data: { message, message1, shouldShowFileUpload }
      });
      dialogRef.afterClosed().subscribe(result => {

        if (result) {
          this.urlList = this.updatedUrlList ? this.updatedUrlList : [...this.docsUrl, ...this.urlData]
          this.urlData = this.urlDataResponse?.split(",").filter(url => url.trim() !== "");
          if (this.urlData.length) {
            this.listOfFiles = this.urlData?.map(url => {

              return decodeURIComponent(url);

              return null;
            });

          }
          const details = JSON.parse(this.stateData.body.propertyData);
          //convert to string with commaa separated
          // this.convertUrlList = this.listOfFiles.join(',')
          const mailBody = {
            entityId: this.entityId,
            entityName: this.entityName,
            outsideEntityMailId: result.reason,
            name: this.goodStandingForeignVerificationformGroup.value.maidenName,
            gender: "NA",
            council: details.council,
            email: this.goodStandingForeignVerificationformGroup.value.email,
            examBody: "UPSMF",
            docProofs: this.urlData,
            diplomaNumber: "",
            nursingCollage: value.tcName,
            courseState: "aaaaa",
            courseCouncil: "BBB",
            state: this.goodStandingForeignVerificationformGroup.value.state,
            country: this.goodStandingForeignVerificationformGroup.value.country,
            // state: this.goodStandingForeignVerificationformGroup.value.state,
            attachment: result.file,

          }
          this.baseService.sendMailOutsideUp$(mailBody).subscribe((response) => {
            this.navToPreviousPage();
          })

        }

      });
    }
    }
  }
  navToPreviousPage() {
    this.location.back()
  }
  // onReset() {
  //   this.createQRCode().then((qrCodeURL: any) => {
  //     this.generatePDF(qrCodeURL.toString())
  //   })

  // }
  doFormReset() {
    this.submitted = false;
    this.goodStandingForeignVerificationformGroup.reset();
    this.listOfFiles = [];
  }
  takeAcceptRejectAction(entity: string) {
    if (this.ecStatus==="REJECTED") {
      const message = `Reason For Rejection`;
      // const resDialog = new DialogModel( message);
      const shouldShowFileUpload = false;


      let dialogRef = this.dialog.open(DialogBoxComponent, {
        disableClose: true,
        width: '40rem',
        height: '25rem',
        data: { message, shouldShowFileUpload }
      });

      dialogRef.afterClosed().subscribe(result => {
        const reason = result;
        console.log(reason.value)

        if (result) {
          const approveBody = {
            action: "REJECT_CLAIM",
            notes: reason.reason
          }
          const osid = this.stateData?.body.id
          this.baseService.approveClaim$(osid, approveBody)
            .subscribe((response) => {
              this.navToPreviousPage();

            })

        }


      });


    } else { //studentoutside UP Regulator role
      if(!this.ecStatus){
        this.createQRCode().then((qrCodeURL: any) => {
          this.generatePDF(qrCodeURL.toString())
        })
      }
    }
  }

  onReset(entity: string) {
    this.userEmail === "Regulator" ? this.takeAcceptRejectAction(entity) : this.doFormReset();
  }
  async createQRCode() {
    this.baseService.getQRCode$(this.entityName, this.entityId).subscribe
      ((response) => {
        this.resp = response.responseData.verifyLink
        console.log(this.resp)
      })
    const qrCodeData = this.resp.toString(); // Replace with your QR code data
    return await QRCode.toDataURL(qrCodeData);
  }
  generatePDF(qrCodeString: string) {
    const doc = new jsPDF()
    autoTable(doc, {
      margin: { top: 50 },
      rowPageBreak: 'auto',
      bodyStyles: { valign: 'top' },

      head: [],
      body: [
        [this.labels.maidenName, this.goodStandingForeignVerificationformGroup.controls['maidenName'].value],
        [this.labels.mrdName, this.goodStandingForeignVerificationformGroup.controls['mrdName'].value],
        [this.labels.fatherName, this.goodStandingForeignVerificationformGroup.controls['fatherName'].value],
        [this.labels.dob, this.goodStandingForeignVerificationformGroup.controls['dob'].value],
        ["Address", this.goodStandingForeignVerificationformGroup.controls['al1'].value],
        // [this.labels.al2, this.goodStandingForeignVerificationformGroup.controls['al2'].value],
        [this.labels.district, this.goodStandingForeignVerificationformGroup.controls['district'].value],
        [this.labels.state, this.goodStandingForeignVerificationformGroup.controls['state'].value],
        [this.labels.pin, this.goodStandingForeignVerificationformGroup.controls['pin'].value],
        [this.labels.country, this.goodStandingForeignVerificationformGroup.controls['country'].value],
        [this.labels.mobNumber, this.goodStandingForeignVerificationformGroup.controls['mobNumber'].value],
        [this.labels.email, this.goodStandingForeignVerificationformGroup.controls['email'].value],
        [this.labels.proQual, this.goodStandingForeignVerificationformGroup.controls['proQual'].value],
        [this.labels.tcName, this.goodStandingForeignVerificationformGroup.controls['tcName'].value],
        [this.labels.regnNum, this.goodStandingForeignVerificationformGroup.controls['regnNum'].value],
        // [this.labels.attach,this.newRegCertDetailsformGroup.controls['attach'].value ],  
        [this.labels.placeOfWork, this.goodStandingForeignVerificationformGroup.controls['placeOfWork'].value],
        [this.labels.joinDate, this.goodStandingForeignVerificationformGroup.controls['joinDate'].value],
        [this.labels.passDate, this.goodStandingForeignVerificationformGroup.controls['passDate'].value],


      ],
      didDrawPage: (data) => {
        doc.text(this.labels.header, 14, 40);
        doc.addImage(this.logo, 10, 8, 80, 20);
        doc.addImage(qrCodeString, 160, 10, 30, 30);
        doc.addImage(this.internalLogo, 173, 23, 5, 5);
        const text = 'Please scan this QR code to approve / reject the claim'; // Replace with your desired text
        doc.setFontSize(7)
        doc.text(text, 145, 40);
      }

    });
    doc.save(`Application_${this.goodStandingForeignVerificationformGroup.controls['regnNum'].value}_.pdf`)
    this.navToPreviousPage();
  }
  getRejectReasonAdmin(){
    this.baseService.getReasonAdmin$(this.id).subscribe((response)=>{
      this.reason=response.responseData.notes[1].notes
      console.log("reason",response.responseData.notes[0].notes)
    })
  }

}
