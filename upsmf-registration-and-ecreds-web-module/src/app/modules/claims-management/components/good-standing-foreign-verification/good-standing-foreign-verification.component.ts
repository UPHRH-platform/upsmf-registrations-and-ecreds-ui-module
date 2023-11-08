import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { BaseServiceService } from '../../../../services/base-service.service';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { mergeMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent, DialogModel } from 'src/app/modules/shared/components/dialog-box/dialog-box.component';
import { BreadcrumbItem, ConfigService } from 'src/app/modules/shared';
import { HttpService } from 'src/app/core/services/http-service/http.service';
import html2canvas from 'html2canvas';
import jspdf, { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { applabels } from 'src/app/messages/labels';
import { allStateList } from 'src/models/statemodel';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-good-standing-foreign-verification',
  templateUrl: './good-standing-foreign-verification.component.html',
  styleUrls: ['./good-standing-foreign-verification.component.scss']
})
export class GoodStandingForeignVerificationComponent {
  candidateDetails: boolean = true;
  links = ['Candidate Details', 'Payment Details']
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

  goodStandingForeignVerificationformGroup: FormGroup;
  submitted = false;
  formsReady: boolean = false;

  labels = applabels;
  form1Html: any

  stateList: any[] = []
  listOfFiles: any[] = [];
  fileList: File[] = [];
  candidateDetailList: any[] = [];
  listOfCourseFiles: any[] = [];
  courseFileList: File[] = [];

  docsUrl: any[] = [];
  urlData: any[] = [];
  convertUrlList: string;
  urlList: any;
  updatedUrlList:any[]=[];
  userRole: any;
  userEmail: any;
  urlDataResponse: string;
  entity: string;
  entityId: string;
  attestationName: string;
  attestationId: string;
  osid: string;
  stateData: any;
  customData: any;
  type: string;
  endPointUrl: any;
  docsResponseUrl: string;
  paymentDetails: boolean = false;
  selectedLink: string = 'Candidate Details';
  paymentResponse: any;
  profileFileName:any;
  uplaodedFiles:any;
  filePreview:any;
  todayDate=new Date();
  maxDate=this.todayDate;
  endPointUrls:any;
  studentOsId:any;
  reason:string;
  id:string;
  applicantUserName:string = ''

  profQualificationArray = ['A.N.M', 'Midwife', 'H.W', 'Nurse', 'B.SC.Nursing'];
  councilList:any[]=[];
  isGoodStanding:boolean = false;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Claim Registration Certificate', url: '/claims/new' },
    { label: 'Claim Details', url: '/claims/good-stand-frgn-cert' },

  ];

  activity: Observable<any>;

  constructor(private formBuilder: FormBuilder, private baseService: BaseServiceService,
    private router: Router,
    private location: Location,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private configService: ConfigService,
    private http: HttpService,
    private route: ActivatedRoute,
  ) {
    this.stateList = allStateList;
    this.userEmail = this.baseService.getUserRole()[0]
    console.log(this.userEmail)
    this.stateData = this.router?.getCurrentNavigation()?.extras.state;
    console.log("stateData:", this.stateData)
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
    this.getStudentFormOsid()
  }

  getStudentFormOsid(){
    this.endPointUrls = this.configService.urlConFig.URLS.STUDENT.GET_STUDENT_DETAILS
    this.baseService.getCandidatePersonalDetails$(this.endPointUrls).subscribe({
      next:(res)=>{
         console.log(res)
         this.studentOsId =res.responseData[0].osid 
         console.log('sss',this.studentOsId)
      },
      error:(err)=>{
     console.log(err)
      }
    })
  }

  getCandidatePersonalDetails() {
    console.log("getting getCandidatePersonalDetails")
    this.osid = this.stateData.body.id
    this.entity = this.stateData.body.entity
    console.log("entity", this.entity)
    if (this.entity === "StudentGoodstanding" && this.userEmail === "Regulator") {
      this.baseService.getCandidatePersonalDetailsRegulator$(this.entity, this.osid)
        .subscribe(
          (response: any) => {
            console.log("data", response)
            const candidateDetailList = JSON.parse(response.responseData.claim.propertyData)
            console.log("...", candidateDetailList)
            this.urlDataResponse = candidateDetailList.docproof;
            if (!!this.urlDataResponse) {
              this.urlData = this.urlDataResponse?.split(",").filter(url => url.trim() !== "");
              this.updatedUrlList = this.updatedUrlList.concat(this.urlData)
              console.log('urlDaaaa', this.urlData)
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
            console.log(".....", candidateDetailList.name)
            this.goodStandingForeignVerificationformGroup.patchValue({
              maidenName: candidateDetailList.name,
              mrdName: candidateDetailList.marriedName,
              email: candidateDetailList.email,
              mobNumber: candidateDetailList.phoneNumber,
              applicantName: candidateDetailList.name,
              adhr: candidateDetailList.aadhaarNo,
              fatherName: candidateDetailList.fathersName,
              dob: candidateDetailList.dob,
              gender: candidateDetailList.gender,
              al1: candidateDetailList.presentAddress,
              // al2: candidateDetailList.presentAddress,
              state: candidateDetailList.state,
              pin: candidateDetailList.pincode,
              district: candidateDetailList.district,
              country: candidateDetailList.country,
              placeOfWork: candidateDetailList.workPlace,
              tcName: candidateDetailList.trainingCenter,
              regnNum: candidateDetailList.registrationNumber,
              proQual: candidateDetailList.professionalQualification,
              council: candidateDetailList.council,
              registrationIssueDate: candidateDetailList.registrationIssueDate

            });
          });
    }
    else {

      this.baseService.getCandidatePersonalDetailsGoodstanding$()
        .subscribe(
          (response: any) => {
            this.id=this.stateData?.body.id
            this.getRejectReasonStudent()
            this.candidateDetailList = response.responseData
            this.councilList = ['UPNC','UPMC','UPDC']
            this.isGoodStanding = true;
            this.getGoodStandingValidators()
            console.log("det", this.candidateDetailList[0])
            this.osid = this.candidateDetailList[0].osid;
            this.urlDataResponse = this.candidateDetailList[0].docproof;
            const joinM = this.candidateDetailList[0].joiningMonth;
            const jm = this.monthMap[joinM]
            const passM = this.candidateDetailList[0].passingMonth;
            const pm = this.monthMap[passM]
            if (!!this.urlDataResponse) {
              this.urlData = this.urlDataResponse?.split(",").filter(url => url.trim() !== "");
              this.updatedUrlList = this.updatedUrlList.concat(this.urlData)
              console.log('urlDaaaa', this.urlData)
              this.filePreview= this.candidateDetailList[0].candidatePic;
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

            this.goodStandingForeignVerificationformGroup.patchValue({
              maidenName: this.candidateDetailList[0]?.name,
              mrdName: this.candidateDetailList[0]?.marriedName,
              email: this.candidateDetailList[0]?.email,
              mobNumber: this.candidateDetailList[0]?.phoneNumber,
              applicantName: this.candidateDetailList[0]?.name,
              adhr: this.candidateDetailList[0]?.aadhaarNo,
              motherName: this.candidateDetailList[0]?.mothersName,
              fatherName: this.candidateDetailList[0]?.fathersName,
              dob: this.candidateDetailList[0]?.dob,
              gender: this.candidateDetailList[0]?.gender,
              al1: this.candidateDetailList[0]?.presentAddress,
              // al2: this.candidateDetailList[0]?.presentAddress,
              state: this.candidateDetailList[0].state,
              pin: this.candidateDetailList[0]?.pincode,
              district: this.candidateDetailList[0]?.district,
              country: this.candidateDetailList[0]?.country,
              regnNum: this.candidateDetailList[0]?.registrationNumber,
              placeOfWork: this.candidateDetailList[0]?.workPlace,
              tcName: this.candidateDetailList[0]?.trainingCenter,
              proQual: this.candidateDetailList[0]?.professionalQualification,
              joinDate: this.candidateDetailList[0].joiningDate,
              passDate: this.candidateDetailList[0].courseDate,
              council: this.candidateDetailList[0].council,
              registrationIssueDate: this.candidateDetailList[0].registrationIssueDate,
              universityName:this.candidateDetailList[0].universityName,
              instituteName: this.candidateDetailList[0].instituteName,
              courseName: this.candidateDetailList[0].courseName

              

            });


          }
        );
    }
  }
  getGoodStandingValidators() {
    this.goodStandingForeignVerificationformGroup.get('foreignCouncilName')?.clearValidators();
    this.goodStandingForeignVerificationformGroup.get('councilAddress')?.clearValidators();
    this.goodStandingForeignVerificationformGroup.get('councilCountry')?.clearValidators();
    this.goodStandingForeignVerificationformGroup.get('universityName')?.setValidators(Validators.required)
    this.goodStandingForeignVerificationformGroup.get('instituteName')?.setValidators(Validators.required)
    this.goodStandingForeignVerificationformGroup.get('courseName')?.setValidators(Validators.required)
  }
  getForeignVerificationValidators() {
    this.goodStandingForeignVerificationformGroup.get('foreignCouncilName')?.setValidators(Validators.required)
    this.goodStandingForeignVerificationformGroup.get('councilAddress')?.setValidators(Validators.required)
    this.goodStandingForeignVerificationformGroup.get('councilCountry')?.setValidators(Validators.required)
    this.goodStandingForeignVerificationformGroup.get('universityName')?.clearValidators()
    this.goodStandingForeignVerificationformGroup.get('instituteName')?.clearValidators()
    this.goodStandingForeignVerificationformGroup.get('courseName')?.clearValidators()
  }
  getCandidatePersonalDetailsForeign() {
    console.log("getting getCandidatePersonalDetails")
    console.log("getting getCandidatePersonalDetails")
    this.osid = this.stateData.body.id
    this.entity = this.stateData.body.entity
    console.log("entity", this.entity)
    if (this.entity === "StudentForeignVerification" && this.userEmail === "Regulator") {
      this.baseService.getCandidatePersonalDetailsRegulator$(this.entity, this.osid)
        .subscribe(
          (response: any) => {
            console.log("data", response)
            const candidateDetailList = JSON.parse(response.responseData.claim.propertyData)
            console.log("...", candidateDetailList)
            this.urlDataResponse = candidateDetailList.docproof;
            if (!!this.urlDataResponse) {
              this.urlData = this.urlDataResponse?.split(",").filter(url => url.trim() !== "");
              this.updatedUrlList = this.updatedUrlList.concat(this.urlData)
              console.log('urlDaaaa', this.urlData)
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
            console.log(".....", candidateDetailList.name)
            this.goodStandingForeignVerificationformGroup.patchValue({
              maidenName: candidateDetailList.name,
              mrdName: candidateDetailList.marriedName,
              email: candidateDetailList.email,
              mobNumber: candidateDetailList.phoneNumber,
              applicantName: candidateDetailList.name,
              adhr: candidateDetailList.aadhaarNo,
              fatherName: candidateDetailList.fathersName,
              dob: candidateDetailList.dob,
              gender: candidateDetailList.gender,
              al1: candidateDetailList.presentAddress,
              // al2: candidateDetailList.presentAddress,
              state: candidateDetailList.state,
              pin: candidateDetailList.pincode,
              district: candidateDetailList.district,
              country: candidateDetailList.country,
              placeOfWork: candidateDetailList.workPlace,
              tcName: candidateDetailList.trainingCenter,
              regnNum: candidateDetailList.registrationNumber,
              proQual: candidateDetailList.professionalQualification,
              council: candidateDetailList.council,
              registrationIssueDate: candidateDetailList.registrationIssueDate,
              foreignCouncilName: candidateDetailList.foreignCouncilName,
              councilAddress: candidateDetailList.foreignCouncilAddress,
              councilCountry:candidateDetailList.foreignCouncilCountry



            });
          });

    }


    else {
     
      this.baseService.getCandidatePersonalDetailsForeignVerification$()
        .subscribe(
          (response: any) => {
            this.id=this.stateData?.body.id

            this.getRejectReasonStudent()
            this.candidateDetailList = response.responseData
            this.councilList = ['UPNC']
            this.getForeignVerificationValidators()
            console.log("det", this.candidateDetailList[0])
            this.osid = this.candidateDetailList[0].osid;
            this.urlDataResponse = this.candidateDetailList[0].docproof;
            const month = (new Date(Date.parse(this.candidateDetailList[0].joiningMonth + " 1, 2012")).getMonth() + 1 < 10) ?
            "0" + (new Date(Date.parse(this.candidateDetailList[0].joiningMonth + " 1, 2012")).getMonth() + 1) :
            new Date(Date.parse(this.candidateDetailList[0].joiningMonth + " 1, 2012")).getMonth() + 1
            
            if (!!this.urlDataResponse) {
              this.urlData = this.urlDataResponse?.split(",").filter(url => url.trim() !== "");
              this.updatedUrlList = this.updatedUrlList.concat(this.urlData)
              console.log('urlDaaaa',this.urlData)
              this.filePreview= this.candidateDetailList[0].candidatePic;
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
              const joinM = this.candidateDetailList[0].joiningMonth;
              const jm = this.monthMap[joinM]
              const passM = this.candidateDetailList[0].passingMonth;
              const pm = this.monthMap[passM]
            this.goodStandingForeignVerificationformGroup.patchValue({
              maidenName: this.candidateDetailList[0]?.name,
              mrdName: this.candidateDetailList[0]?.marriedName,
              email: this.candidateDetailList[0]?.email,
              mobNumber: this.candidateDetailList[0]?.phoneNumber,
              applicantName: this.candidateDetailList[0]?.name,
              adhr: this.candidateDetailList[0]?.aadhaarNo,
              motherName: this.candidateDetailList[0]?.mothersName,
              fatherName: this.candidateDetailList[0]?.fathersName,
              dob: this.candidateDetailList[0]?.dob,
              gender: this.candidateDetailList[0]?.gender,
              al1: this.candidateDetailList[0]?.address,
              // al2: this.candidateDetailList[0]?.address,
              state: this.candidateDetailList[0].state,
              pin: this.candidateDetailList[0]?.pincode,
              district: this.candidateDetailList[0]?.district,
              country: this.candidateDetailList[0]?.country,
              regnNum: this.candidateDetailList[0]?.registrationNumber,
              placeOfWork: this.candidateDetailList[0]?.workPlace,
              tcName: this.candidateDetailList[0]?.trainingCenter,
              proQual: this.candidateDetailList[0]?.professionalQualification,
              joinDate: this.candidateDetailList[0].joiningYear + "-" + jm + "-01",
              passDate: this.candidateDetailList[0].passingYear + "-" + pm + "-01",
              council: this.candidateDetailList[0].council,
              registrationIssueDate: this.candidateDetailList[0].registrationIssueDate,
              foreignCouncilName: this.candidateDetailList[0].foreignCouncilName,
              councilAddress: this.candidateDetailList[0].foreignCouncilAddress,
              councilCountry:this.candidateDetailList[0].foreignCouncilCountry
              // docproof:this.candidateDetailList[0]?.docproof


            });


          }
        );
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
        Validators.required, this.validateMinAge(15) as ValidatorFn]),
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
      council: new FormControl('', [Validators.required]),
      foreignCouncilName: new FormControl(''),
      councilAddress: new FormControl(''),
      councilCountry: new FormControl(''),
      registrationIssueDate: new FormControl('',[Validators.required]),
      universityName: new FormControl(''),
      instituteName: new FormControl(''),
      courseName: new FormControl('')



      // fileAttach: new FormControl('')
    });
    if (this.userEmail === "Regulator") {
      { { (this.stateData.body.entity === "StudentForeignVerification" ? this.getCandidatePersonalDetailsForeign() : this.getCandidatePersonalDetails()) } }
    }
    else {
      if (this.stateData.body.entity) {
        this.getEndPoint();
        { { (this.stateData.body.entity === 'StudentForeignVerification') ? this.getCandidatePersonalDetailsForeign() : this.getCandidatePersonalDetails() } }

      }
      else {
        this.getEndPoint();
        { { (this.stateData.body.type === 'ForeignVerifyReq') ? this.getCandidatePersonalDetailsForeign() : this.getCandidatePersonalDetails() } }

      }




    }
    // if(this.stateData.customData.type === 'goodStandingCert'){
    //   this.getCandidatePersonalDetails();

    // }
    // else{
    //   this.getCandidatePersonalDetailsForeign();
    // }
  }
  validateMinAge(minAge: number) {
    return (control: FormControl) => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - selectedDate.getFullYear();

      if (age < minAge) {
        return { invalidMinAge: true };
      }

      return null;
    };
  }
  navigateToUrl(item: any) {
    window.open(item, "_blank");
  }


  onFileChanged(event?: any) {
    for (let i = 0; i <= event.target.files.length - 1; i++) {
      let selectedFile = event.target.files[i];

      if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
        this.fileList.push(selectedFile);
        // this.listOfFiles.push(selectedFile.name);

      }
    }
    this.uploadFiles();

  }

  uploadFiles() {

    const formData = new FormData();
    for (var i = 0; i < this.fileList.length; i++) {
      console.log(this.fileList[i])
      formData.append("files", this.fileList[i]);
    }
     let OsIdGoodStanding = this.osid ? this.osid: this.studentOsId

    this.baseService.uploadFiles$(OsIdGoodStanding, formData, this.endPointUrl).subscribe({
      next:(data) => {
      console.log(data)
      this.docsResponseUrl = data.result;
      this.docsUrl = this.docsResponseUrl.split(',').filter(url => url.trim() !== "")
      this.updatedUrlList = this.updatedUrlList.concat(this.docsUrl)
      console.log('docsUrl', this.docsUrl)
       this.fileList = []
      const uploadObj = this.docsUrl.map(url => {
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
      console.log('uO', uploadObj)
      this.listOfFiles.push(...uploadObj)
      console.log('this.listOfFiles', this.listOfFiles)
    },
    error:(err)=>{
      console.log(err),
      this.fileList = []
    }
  })

  }

  onCourseFileChanged(event?: any) {
    console.log(event);
    for (let i = 0; i <= event.target.files.length - 1; i++) {
      let selectedFile = event.target.files[i];

      if (this.listOfCourseFiles.indexOf(selectedFile.name) === -1) {
        this.courseFileList.push(selectedFile);
        this.listOfCourseFiles.push(selectedFile.name.concat(this.formatBytes(selectedFile.size)));
      }
    }
  }

  removeSelectedFile(index: any) {
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    this.updatedUrlList = this.listOfFiles.map(item => item.url)
    console.log(this.updatedUrlList)
    // delete file from FileList
    this.fileList.splice(index, 1);
  }

  formatBytes(bytes: any, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  removeSelectedCourseFile(index: any) {
    // Delete the item from fileNames list
    this.listOfCourseFiles.splice(index, 1);
    // delete file from FileList
    this.courseFileList.splice(index, 1);
  }
  selectLink(link: string) {
    this.selectedLink = link;
  }

  // showInfo(option: any) {
  //   console.log(option)
  //   option === "Candidate Details" ? this.candidateDetails = true : this.candidateDetails = false;
  // }

  // onFileChanged(event?: any) {
  //   console.log(event);
  //   for (let i = 0; i <= event.target.files.length - 1; i++) {
  //     let selectedFile = event.target.files[i];

  //     if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
  //       this.fileList.push(selectedFile);
  //       this.listOfFiles.push(selectedFile.name.concat(this.formatBytes(selectedFile.size)));
  //     }
  //   }
  // }

  // removeSelectedFile(index: any) {
  //   // Delete the item from fileNames list
  //   this.listOfFiles.splice(index, 1);
  //   // delete file from FileList
  //   this.fileList.splice(index, 1);
  // }

  // formatBytes(bytes: any, decimals = 2) {
  //   if (!+bytes) return '0 Bytes'
  //   const k = 1024
  //   const dm = decimals < 0 ? 0 : decimals
  //   const sizes = ['Bytes', 'KB', 'MB']
  //   const i = Math.floor(Math.log(bytes) / Math.log(k))
  //   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  // }

  onGoodStandingForeignVerificationformSubmit(value: any) {
    const osid = this.stateData.body.id
    console.log("id....", osid)

    if (this.entity === "StudentForeignVerification" && this.userEmail === "Regulator") {
      const message = `Enter the email`;
      const message1 = `Upload Document`;

      const shouldShowFileUpload = true;
      const resDialog = new DialogModel(message, message1);

      let dialogRef = this.dialog.open(DialogBoxComponent, {
        disableClose: true,
        // width: '40rem',
        // height:'25rem',
        data: { message, message1, shouldShowFileUpload }
      });
      dialogRef.afterClosed().subscribe(result => {
        // const reason = result;


        if (result) {
          this.urlList = this.updatedUrlList ? this.updatedUrlList:''
          if (this.updatedUrlList.length) {
            this.listOfFiles = this.updatedUrlList?.map(url => {
              // const parts = url.split('=');
             
                return decodeURIComponent(url);
              
              return null;
            });

          }
          const details = JSON.parse(this.stateData.body.propertyData);
          //convert to string with commaa separated
          this.convertUrlList = this.listOfFiles.join(',')
          const mailBody = {
            outsideEntityMailId: result.reason,
            name: this.goodStandingForeignVerificationformGroup.value.applicantName,
            gender: this.goodStandingForeignVerificationformGroup.value.gender,
            council: details.council,
            email: this.goodStandingForeignVerificationformGroup.value.email,
            examBody: value.examBody,
            docProofs: [this.convertUrlList],
            diplomaNumber: value.diplomaNumber,
            nursingCollage: value.collegeName,
            courseState: "aaaaa",
            courseCouncil: "BBB",
            state: this.goodStandingForeignVerificationformGroup.value.state,
            country: this.goodStandingForeignVerificationformGroup.value.country,
            // state: this.newRegCertDetailsformGroup.value.state,
            attachment: result.file,

          }
          this.baseService.sendMailOutsideUp$(mailBody).subscribe((response) => {
          })

        }

      });

      // const approveBody={
      //   action:"GRANT_CLAIM",
      //   note:"Registration Certificate"
      // }
      // this.baseService.approveClaim$(osid,approveBody)
      // .subscribe((response)=>{
      //   console.log(response)
      // })

    }
    else if (this.entity === "StudentGoodstanding" && this.userEmail === "Regulator") {
      const message = `Enter the email`;
      const message1 = `Upload Document`;

      const shouldShowFileUpload = true;
      const resDialog = new DialogModel(message, message1);

      let dialogRef = this.dialog.open(DialogBoxComponent, {
        disableClose: true,
        // width: '40rem',
        // height:'25rem',
        data: { message, message1, shouldShowFileUpload }
      });
      dialogRef.afterClosed().subscribe(result => {
        // const reason = result;


        console.log("res", result);
        if (result) {
          this.urlList = this.updatedUrlList ? this.updatedUrlList : ''
          if (this.updatedUrlList.length) {
            this.listOfFiles = this.updatedUrlList?.map(url => {
              // const parts = url.split('=');
              
                return decodeURIComponent(url);
              
              return null;
            });

          }
          const details = JSON.parse(this.stateData.body.propertyData);
          console.log("data................", details)
          //convert to string with commaa separated
          this.convertUrlList = this.listOfFiles.join(',')
          const mailBody = {
            outsideEntityMailId: result.reason,
            name: this.goodStandingForeignVerificationformGroup.value.applicantName,
            gender: this.goodStandingForeignVerificationformGroup.value.gender,
            council: details.council,
            email: this.goodStandingForeignVerificationformGroup.value.email,
            examBody: value.examBody,
            docProofs: [this.convertUrlList],
            diplomaNumber: value.diplomaNumber,
            nursingCollage: value.collegeName,
            courseState: "aaaaa",
            courseCouncil: "BBB",
            state: this.goodStandingForeignVerificationformGroup.value.state,
            country: this.goodStandingForeignVerificationformGroup.value.country,
            // state: this.newRegCertDetailsformGroup.value.state,
            attachment: result.file,

          }
          this.baseService.sendMailOutsideUp$(mailBody).subscribe((response) => {
            console.log(response)
          })

        }

      });

      // const approveBody={
      //   action:"GRANT_CLAIM",
      //   note:"Registration Certificate"
      // }
      // this.baseService.approveClaim$(osid,approveBody)
      // .subscribe((response)=>{
      //   console.log(response)
      // })

    }

    else if ((this.stateData.body.type === 'goodStandingCert' && this.listOfFiles[0].url && this.filePreview.url)) {
      const joinDate = new Date(this.goodStandingForeignVerificationformGroup.get('joinDate')?.value);

      const passDate = new Date(this.goodStandingForeignVerificationformGroup.get('passDate')?.value);
      const jMonth = joinDate.getMonth();
      const pMonth = passDate.getMonth();
      const joinYear = joinDate.getFullYear();
      const passYear = joinDate.getFullYear();

      const joinMonth = this.months[jMonth];
      const passMonth = this.months[pMonth];

      const curryear = new Date().getFullYear() % 100;
      
      console.log("joinmonth", joinMonth)
      this.urlList = this.updatedUrlList ? this.updatedUrlList : ''
      //convert to string with commaa separated
      this.convertUrlList = this.urlList.join(',')
      // this.candidateDetails = false;
      this.applicantUserName = this.goodStandingForeignVerificationformGroup.value.maidenName;
      const updateStudentGoodstandingBody = {
        "name": this.goodStandingForeignVerificationformGroup.value.maidenName,
        "fathersName": this.goodStandingForeignVerificationformGroup.value.fatherName,
        "presentAddress": `${this.goodStandingForeignVerificationformGroup.value.al1}`,
        "phoneNumber": this.goodStandingForeignVerificationformGroup.value.mobNumber,
        "email": this.goodStandingForeignVerificationformGroup.value.email,
        "trainingCenter": this.goodStandingForeignVerificationformGroup.value.tcName,
        "council":this.goodStandingForeignVerificationformGroup.value.council,
        "workPlace": this.goodStandingForeignVerificationformGroup.value.placeOfWork,
        "date": this.datePipe.transform(new Date(), "yyyy-MM-dd")?.toString(),
        "refNo": "REF789012",
        "validityOfRegistration": "2023-12-31",
        "dob": this.datePipe.transform(this.goodStandingForeignVerificationformGroup.value.dob, "yyyy-MM-dd")?.toString(),
        "docproof": this.convertUrlList,
         // "candidatePic": "pic1.jpg",
         "candidatePic": this.filePreview.url,
        "marriedName": this.goodStandingForeignVerificationformGroup.value.mrdName,
        "maidenName": this.goodStandingForeignVerificationformGroup.value.maidenName,
        "professionalQualification": this.goodStandingForeignVerificationformGroup.value.proQual,
        "registrationNumber": this.goodStandingForeignVerificationformGroup.value.regnNum,
        "paymentStatus": "PENDING",
        "claimType": this.stateData?.body.type,
        "state": this.goodStandingForeignVerificationformGroup.value.state,
        "country": this.goodStandingForeignVerificationformGroup.value.country,
        "pincode": this.goodStandingForeignVerificationformGroup.value.pin,
        "district": this.goodStandingForeignVerificationformGroup.value.district,
        // "joiningMonth": joinMonth,
        // "passingMonth": passMonth,
        // "joiningYear": joinYear.toString(),
        // "passingYear": passYear.toString(),
        "joiningDate":this.datePipe.transform(this.goodStandingForeignVerificationformGroup.get('joinDate')?.value, "yyyy-MM-dd")?.toString(),
        "courseDate" : this.datePipe.transform(this.goodStandingForeignVerificationformGroup.get('passDate')?.value,"yyyy-MM-dd")?.toString(),
        "registrationIssueDate":this.datePipe.transform(this.goodStandingForeignVerificationformGroup.value.registrationIssueDate,"yyyy-MM-dd")?.toString(),
        "universityName": this.goodStandingForeignVerificationformGroup.value.universityName,
        "instituteName": this.goodStandingForeignVerificationformGroup.value.instituteName,
        "courseName": this.goodStandingForeignVerificationformGroup.value.courseName,
        "refNoYear": curryear.toString()
        // "university":'NA'



      }

      console.log("goodBody", updateStudentGoodstandingBody)
      if (this.osid) {
        const paymentData = {
          osId: this.osid,
          origin: this.stateData.body.type,
          endPointUrl: this.endPointUrl

        }
        localStorage.setItem('payData', JSON.stringify(paymentData))
        this.baseService.updateStudentGoodStanding$(this.osid, updateStudentGoodstandingBody)
          .subscribe(
            (response) => {
              console.log(response);
              this.paymentDetails = true;


            },
          )
      }
      else {
        this.baseService.postStudentGoodStanding$(updateStudentGoodstandingBody)
          .subscribe(
            (response) => {
              console.log("good resp", response);
              this.paymentDetails = true;
              this.osid = response?.result?.StudentGoodstanding['osid']
              this.getEndPoint();
              const paymentData = {
                osId: this.osid,
                origin: this.stateData.body.type,
                endPointUrl: this.endPointUrl
              }
              localStorage.setItem('payData', JSON.stringify(paymentData))



            },
          )

      }

    }
    else if (this.candidateDetailList[0]?.paymentStatus === 'SUCCESS') {
      this.paymentDetails = true;
    }

    else {
      if (this.candidateDetailList[0]?.paymentStatus !== 'SUCCESS' && this.listOfFiles[0].url && this.filePreview.url) {
        const joinDate = new Date(this.goodStandingForeignVerificationformGroup.get('joinDate')?.value);

        const passDate = new Date(this.goodStandingForeignVerificationformGroup.get('passDate')?.value);
        const jMonth = joinDate.getMonth();
        const pMonth = passDate.getMonth();
        const joinYear = joinDate.getFullYear();
        const passYear = passDate.getFullYear();

        const joinMonth = this.months[jMonth];
        const passMonth = this.months[pMonth];
        console.log("joinmonth", joinMonth)
        this.urlList = this.updatedUrlList ? this.updatedUrlList : ''
        //convert to string with commaa separated
        this.convertUrlList = this.urlList.join(',')
        // this.candidateDetails = false;
        this.applicantUserName = this.goodStandingForeignVerificationformGroup.value.maidenName;
        const updateStudentForeignVerificationBody = {
          "name": this.goodStandingForeignVerificationformGroup.value.maidenName,
          "fathersName": this.goodStandingForeignVerificationformGroup.value.fatherName,
          "address": `${this.goodStandingForeignVerificationformGroup.value.al1} `,
          "phoneNumber": this.goodStandingForeignVerificationformGroup.value.mobNumber,
          "email": this.goodStandingForeignVerificationformGroup.value.email,
          "trainingCenter": this.goodStandingForeignVerificationformGroup.value.tcName,
          "council": this.goodStandingForeignVerificationformGroup.value.council,
          "workPlace": this.goodStandingForeignVerificationformGroup.value.placeOfWork,
          "date": this.datePipe.transform(new Date(), "yyyy-MM-dd")?.toString(),
          "refNo": "REF789012",
          "validityOfRegistration": "2023-12-31",
          "dob": this.datePipe.transform(this.goodStandingForeignVerificationformGroup.value.dob, "yyyy-MM-dd")?.toString(),
          "docproof": this.convertUrlList,
          // "candidatePic": "pic1.jpg",
          "candidatePic": this.filePreview.url,
          "marriedName": this.goodStandingForeignVerificationformGroup.value.mrdName,
          "maidenName": this.goodStandingForeignVerificationformGroup.value.maidenName,
          "professionalQualification": this.goodStandingForeignVerificationformGroup.value.proQual,
          "registrationNumber": this.goodStandingForeignVerificationformGroup.value.regnNum,
          "paymentStatus": "PENDING",
          "claimType": this.stateData.body.type,
          "state": this.goodStandingForeignVerificationformGroup.value.state,
          "country": this.goodStandingForeignVerificationformGroup.value.country,
          "pincode": this.goodStandingForeignVerificationformGroup.value.pin,
          "district": this.goodStandingForeignVerificationformGroup.value.district,
          "joiningMonth": joinMonth,
          "passingMonth": passMonth,
          "joiningYear": joinYear.toString(),
          "passingYear": passYear.toString(),
          "university":'NA',
          "registrationIssueDate":this.datePipe.transform(this.goodStandingForeignVerificationformGroup.value.registrationIssueDate,"yyyy-MM-dd")?.toString(),
          "foreignCouncilName": this.goodStandingForeignVerificationformGroup.value.foreignCouncilName,
          "foreignCouncilAddress": this.goodStandingForeignVerificationformGroup.value.councilAddress,
          "foreignCouncilCountry": this.goodStandingForeignVerificationformGroup.value.councilCountry

        }
        console.log("foreign body", updateStudentForeignVerificationBody)
        if (this.osid) {
          const paymentData = {
            osId: this.osid,
            origin: this.stateData.body.type,
            endPointUrl: this.endPointUrl
          }
          localStorage.setItem('payData', JSON.stringify(paymentData))
          this.baseService.updateStudentForeignVerification$(this.osid, updateStudentForeignVerificationBody)
            .subscribe(
              (response) => {
                console.log("good resp", response);
                this.paymentDetails = true;
              },
            )
        }
        else {
          this.baseService.postStudentForeignVerification$(updateStudentForeignVerificationBody)
            .subscribe(
              (response) => {
                console.log("foreign response", response)
                this.paymentDetails = true;
                this.getEndPoint();
                this.osid = response?.result?.StudentForeignVerification['osid']

                const paymentData = {
                  osId: this.osid,
                  origin: this.stateData.body.type,
                  endPointUrl: this.endPointUrl
                }
                localStorage.setItem('payData', JSON.stringify(paymentData))


              }
            )
        }
        // this.baseService.updateStudentForeignVerification$(this.osid, updateStudentForeignVerificationBody)
        // .pipe(
        //   mergeMap((resp: any) => {
        //    const makeClaimbody =
        //    {
        //      entityName: "StudentForeignVerification",
        //      entityId: this.osid,
        //      name: "StudentForeignVerify",
        //      propertiesOSID: {
        //       StudentForeignVerify: [
        //            this.osid
        //          ]
        //      }
        //  }
        //     return this.baseService.makeClaim$(this.osid,makeClaimbody);
        //   }
        //   ))  
        //   .subscribe(
        //     (response) => {
        //       console.log("good resp",response);

        //     },
        //   )
      }

    }

  }


  onReset() {
    if (this.entity === "studentForeignVerification" || this.entity === "StudentGoodstanding") {
      this.generatePDF();
    }
    // console.log("onReset")
    // this.submitted = false;
    // this.goodStandingForeignVerificationformGroup.reset();
    // this.listOfFiles = [];
  }
  showInfo(option: any) {
    this.selectLink(option);
    console.log(option)
    switch (option) {
      case 'Payment Details':
        this.paymentDetails = !this.paymentDetails;
        this.candidateDetails = false;

        break;
      case 'Candidate Details':
        this.candidateDetails = true;
        this.paymentDetails = false;
        break;
      default:

        return '';
    }
    return;
  }
  handlePayment() {
    if (this.stateData.body.status === 'APPROVED') {
      this.entity = this.stateData.body.entity;
      this.entityId = this.stateData.body.entityId;
      this.attestationName = this.stateData.body.attestationName;
      this.attestationId = this.stateData.body.attestationId
      this.baseService.getCredentials$(this.entity, this.entityId, this.attestationName, this.attestationId,'StudentGoodstanding')
        .subscribe((response: any) => {
          const fileName = "Certificate.pdf";
          saveAs(response.responseData, fileName);
        })
    }
    else {
      const postData = {
        endpoint: "https://eazypayuat.icicibank.com/EazyPG",
        returnUrl: "https://payment.uphrh.in/api/v1/user/payment",
        paymode: "9",
        secret: "",
        merchantId: "600547",
        mandatoryFields: {
          referenceNo: this.baseService.generate_uuidv4(),
          submerchantId: "45",
          transactionAmount: "1000",
          invoiceId: "x1",
          invoiceDate: "x",
          invoiceTime: "x",
          merchantId: "x",
          payerType: "registration",
          payerId: 'instituteId',
          transactionId: "x",
          transactionDate: "x",
          transactionTime: "x",
          transactionStatus: "x",
          refundId: "x",
          refundDate: "x",
          refundTime: "x",
          refundStatus: "x",
        },

        optionalFields: "registration",

      };
      this.http.getPaymentUrl(postData).subscribe((data) => {
        console.log(data)
        if (data) {
          window.open(data?.redirectUrl, '_blank')

        }
      }
      )
    }
  }
  // generatePDF() {
  // // if (this.formsReady) {

  //     var data = document.getElementById('good-foreign-content')!;
  //     html2canvas(data).then((canvas) => {
  //       // Few necessary setting options
  //       var imgWidth = 200;
  //       var pageHeight = 300;
  //       var imgHeight = (canvas.height * imgWidth) / canvas.width;
  //       var heightLeft = imgHeight;

  //       const contentDataURL = canvas.toDataURL('image/png');
  //       let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  //       var position = 0;
  //       pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //       pdf.save('aplllication.pdf'); // Generated PDF
  //     });
  generatePDF() {
    const doc = new jsPDF()
    console.log(this.form1Html)
    console.log(this.goodStandingForeignVerificationformGroup.value)

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
        [this.labels.al1, this.goodStandingForeignVerificationformGroup.controls['al1'].value],
        [this.labels.al2, this.goodStandingForeignVerificationformGroup.controls['al2'].value],
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


      ],

    });



    doc.save('table.pdf')
  }
  // }
  getEndPoint() {
    switch (this.stateData.body.type) {

      case 'goodStandingCert':
        this.endPointUrl = this.configService.urlConFig.URLS.STUDENT.GET_STUDENT_DETAILS_GOODSTANDING
        this.councilList = ['UPNC','UPMC','UPDC']
        this.isGoodStanding =  true;
        this.getGoodStandingValidators()
        // this.goodStandingForeignVerificationformGroup.get('foreignCouncilName')?.clearValidators();
        // this.goodStandingForeignVerificationformGroup.get('councilAddress')?.clearValidators();
        // this.goodStandingForeignVerificationformGroup.get('councilCountry')?.clearValidators();

        break;
      case 'ForeignVerifyReq':
        this.endPointUrl = this.configService.urlConFig.URLS.STUDENT.GET_STUDENT_DETAILS_FOREIGNVARIFIVATION
        this.councilList = ['UPNC'];
        this.getForeignVerificationValidators()

        // this.goodStandingForeignVerificationformGroup.get('foreignCouncilName')?.setValidators(Validators.required)
        // this.goodStandingForeignVerificationformGroup.get('councilAddress')?.setValidators(Validators.required)
        // this.goodStandingForeignVerificationformGroup.get('councilCountry')?.setValidators(Validators.required)
        break;
      case 'Regulator':
        // this.router.navigate(['claims/new-regn-cert'])
        break;

      default:
        return '';
    }
    return
  }
  navToPreviousPage() {
    this.location.back()
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
  getPaymentStatusColorClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'open';
      case 'SUCCESS':
        return 'closed';
      default:
        return '';
    }
  }
  onProfileChanged(event?:any){
    let selectedUploadFile = event.target.files[0];
    console.log(selectedUploadFile)
   //  this.profileFileName = selectedUploadFile.name
    this.uploadProfileData(selectedUploadFile)
   }
 
   uploadProfileData(selectedFile:any){
     const formData = new FormData();
     formData.append('files', selectedFile)
     this.baseService.uploadFiles$(this.osid,formData,this.endPointUrl).subscribe({
       next:(res)=>{
       console.log('profileData',res)
       this.uplaodedFiles =res.result
       console.log(this.uplaodedFiles)
       const UrlwithoutComma = this.uplaodedFiles.replace(/,*$/, '');
       const fileName = this.uplaodedFiles.split('/').pop();
       const extractLastPart = fileName?.split('_').pop();
       const getuploadObject = {
         name: extractLastPart,
         url: UrlwithoutComma
       }
       this.filePreview = getuploadObject
       console.log('getuploadObject',this.filePreview)
       },
       error:(err)=>{
         console.log(err)
       }
     })
   }
   getRejectReasonStudent(){
    this.baseService.getReasonStudent$(this.id).subscribe((response)=>{
      this.reason=response.responseData.notes[1].notes
      console.log("reason",response.responseData.notes[0].notes)
    })
  }
}
