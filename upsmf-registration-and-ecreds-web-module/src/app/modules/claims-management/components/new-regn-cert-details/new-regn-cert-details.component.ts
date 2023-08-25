import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { BaseServiceService } from 'src/app/services/base-service.service';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { allStateList } from 'src/models/statemodel';
import {credentialsType} from 'src/models/credentialsTypemodel';
import { ConfigService } from 'src/app/modules/shared';
import { HttpService } from 'src/app/core/services/http-service/http.service';

@Component({
  selector: 'app-new-regn-cert-details',
  templateUrl: './new-regn-cert-details.component.html',
  styleUrls: ['./new-regn-cert-details.component.scss']
})
export class NewRegnCertDetailsComponent {

  links = ['Candidate Details', 'Course Details', 'Payment Details']

  newRegCertformGroup: FormGroup;
  public newRegCertDetailsformGroup: FormGroup;
  newRegCourseDetailsformGroup: FormGroup;
  submitted = false;

  candidateDetails: boolean = true;
  paymentDetails: boolean = false;

  genderTypesArray = ['male', 'female', 'Others']

  listOfFiles: any[] = [];
  fileList: File[] = [];

  listOfCourseFiles: any[] = [];
  courseFileList: File[] = [];
  isStudent: boolean = true;
  candidateDetailList:any[]=[];
  docsUrl:any[]=[];
  urlData:any[]=[];
  urlList:any;
  updatedUrlList:any;
  urlDataResponse:string;
  docsResponseUrl:string;
  convertUrlList:string;
  getMakeClaimbody:any;


  osid: string;

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  stateList:any[]=[]
  credTypeList:any[] =[];
  userRole:any;
  endPointUrl:any;

  
  stateData: any;
  selectedLink: string = 'Candidate Details';
  requestTypesArray = ['Orignal','Correction','Name change','Dublicate'];


  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe,
    private location: Location, private baseService: BaseServiceService,
    private router: Router,
    private configService: ConfigService,
    private http: HttpService
  ) {
   this.userRole = this.baseService.getUserRole()[0]
   console.log(this.userRole)
    // var token:any
    //  token =localStorage.getItem('token')
    //  let tokenId:any = ''
    //  tokenId = token
    // console.log('accessTOken',tokenId)
    // const helper = new JwtHelperService();
    // const decoded= helper.decodeToken(tokenId);
    // console.log(decoded)
    this.stateList = allStateList;
    this.credTypeList = credentialsType
    this.stateData = this.router?.getCurrentNavigation()?.extras.state;
    console.log("stateData:",this.stateData)
    this.stateData =  this.stateData?.body
    

  }

  ngOnInit() {
    console.log(this.baseService.generate_uuidv4())
    this.initForm();

  }

  getEndPoint(){
    switch (this.userRole) {

      case 'StudentOutsideUP':
        this.endPointUrl = this.configService.urlConFig.URLS.STUDENT.GET_STUDENT_DETAILS_OUTSIDE_UP
        break;
        case 'StudentFromUP':
        this.endPointUrl = this.configService.urlConFig.URLS.STUDENT.GET_STUDENT_DETAILS
        break;
        case 'Regulator':
        // this.router.navigate(['claims/new-regn-cert'])
        break;

      default:
        return '';
    }
    return
  }

  requestTypeSelected(e:Event){
    console.log(e)
  }

  stateTypeSelected(e:Event){
    console.log(e)
  }

  credTypeSelected(e:Event){

  }

  initForm() {
 
    this.newRegCertDetailsformGroup = this.formBuilder.group({
      applicantName: new FormControl('', [
        Validators.required]),
      motherName: new FormControl('', [
        Validators.required]),
      fatherName: new FormControl('', [
        Validators.required]),
      dob: new FormControl('', [
        Validators.required]),
      al1: new FormControl('', [
        Validators.required]),
      al2: new FormControl('', [
        Validators.required]),
      district: new FormControl('', [
        Validators.required]),
      state: new FormControl('UP', [
        Validators.required]),
      pin: new FormControl('302001', [
        Validators.required, Validators.minLength(6),
        Validators.pattern("^[0-9]*$")]
      ),
      country: new FormControl('', [
        Validators.required]),
      adhr: new FormControl('', [
        Validators.required]),
      gender: new FormControl('', [
        Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      mobNumber: new FormControl('', [
        Validators.required,
        Validators.pattern("^(0|91)?[6-9][0-9]{9}$")]),
        credType: new FormControl('', [
          Validators.required]),
    });

    this.newRegCourseDetailsformGroup = this.formBuilder.group({
      courseName: new FormControl('', [
        Validators.required]),
      collegeName: new FormControl('', [
        Validators.required]),
      examBody: new FormControl('', [
        Validators.required]),
      joinDate: new FormControl('', [
        Validators.required]),
      rollNum: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]*$")]),
      passDate: new FormControl('', [
        Validators.required]),
      requestType: new FormControl('', [
          Validators.required]),
       diplomaNumber: new FormControl(''),
       stateName:new FormControl(''),
       date: new FormControl(''),
       newCouncil: new FormControl(''),
       otherRegnNo: new FormControl('')
    });
    this.getEndPoint();
    this.getCandidatePersonalDetails();

  }

  getCandidatePersonalDetails() {
    console.log("getting getCandidatePersonalDetails")

    this.baseService.getCandidatePersonalDetails$(this.endPointUrl)
      .subscribe(
        (response: any) => {
          if(response.responseData.length){
            this.candidateDetailList = response.responseData
            console.log(this.candidateDetailList[0])
            this.osid = this.candidateDetailList[0].osid;
            this.urlDataResponse = this.candidateDetailList[0].docproof;
            if(!!this.urlDataResponse){
              this.urlData =  this.urlDataResponse?.split(",").filter(url => url.trim() !== "");
              console.log('urlDaaaa',this.urlData)
              if(this.urlData.length){
                this.listOfFiles = this.urlData?.map(url => {
                  const parts = url.split('=');
                  const fileNameWithQueryParams = parts[1];
                  const fileName = fileNameWithQueryParams.split('/').pop();
                  const extractLastPart = fileName?.split('_').pop(); 
                  const getuploadObject = {
                    name:extractLastPart,
                    url:url
                  } 
                  return getuploadObject;         
                });
              }
            }
           
            
            console.log(this.listOfFiles)
            
            // this.listOfFiles = this.candidateDetailList[0].docproof;
            console.log('canndidateList',this.candidateDetailList[0])
            this.newRegCertDetailsformGroup.patchValue({
              email: this.candidateDetailList[0]?.email,
              mobNumber: this.candidateDetailList[0]?.phoneNumber,
              applicantName: this.candidateDetailList[0]?.name,
              adhr: this.candidateDetailList[0]?.aadhaarNo,
              motherName: this.candidateDetailList[0]?.mothersName,
              fatherName: this.candidateDetailList[0]?.fathersName, 
              dob: this.candidateDetailList[0]?.dateOfBirth,
              gender: this.candidateDetailList[0]?.gender,
              al1: this.candidateDetailList[0]?.address,
              al2: this.candidateDetailList[0]?.address,
              state: this.candidateDetailList[0].state,
              pin: this.candidateDetailList[0]?.pincode,
              district: this.candidateDetailList[0]?.district,
              country: this.candidateDetailList[0]?.country,
              credType: this.candidateDetailList[0]?.credType
  
  
              
              // district : response[0]?.district
            });
            const month = (new Date(Date.parse(this.candidateDetailList[0]?.joiningMonth +" 1, 2012")).getMonth()+1 < 10)?
              "0"+( new Date(Date.parse(this.candidateDetailList[0]?.joiningMonth +" 1, 2012")).getMonth()+1):
             new Date(Date.parse(this.candidateDetailList[0]?.joiningMonth +" 1, 2012")).getMonth()+1
          
            this.newRegCourseDetailsformGroup.patchValue({
              courseName: this.candidateDetailList[0]?.courseName,
              collegeName: this.candidateDetailList[0]?.nursingCollage,
              examBody: this.candidateDetailList[0]?.examBody,
              joinDate: this.candidateDetailList[0]?.joiningYear+"-" +month+ "-01",
              rollNum: this.candidateDetailList[0]?.finalYearRollNo,
              passDate: this.candidateDetailList[0]?.passingYear+"-" +month+ "-01",
              requestType: this.candidateDetailList[0]?.requestType
            });
            
            console.log(this.newRegCourseDetailsformGroup.value.joinDate)
          }
         

          /*     this.listOfFiles =  */
        }
      );
  }

  newRegCertDetailsformGroupSubmit(value: any) {
    console.log(value)
    this.submitted = true;
    if (this.newRegCertDetailsformGroup.valid) {
      this.candidateDetails = false;
    }

  }
  onNewRegCourseDetailsformSubmit(value: any) {
    this.submitted = true;
    if (this.newRegCourseDetailsformGroup.valid) {

      console.log(this.newRegCertDetailsformGroup.value)
      console.log(value)

      const joinDate = new Date(this.newRegCourseDetailsformGroup.get('joinDate')?.value);

      const passDate = new Date(this.newRegCourseDetailsformGroup.get('passDate')?.value);
      const jMonth = joinDate.getMonth();
      const pMonth = passDate.getMonth();
      const joinYear = joinDate.getFullYear();
      const passYear = joinDate.getFullYear();
  
      const joinMonth = this.months[jMonth];
      const passMonth = this.months[pMonth];
      console.log('hh',joinMonth, passMonth)
      this.urlList  = this.updatedUrlList ? this.updatedUrlList : [...this.docsUrl, ...this.urlData]
      //convert to string with commaa separated
      this.convertUrlList = this.urlList.join(',')
      const updateStudentBody =
      {
        "date": this.datePipe.transform(new Date(), "yyyy-MM-dd")?.toString(),
        "candidatePic": "arun.jpg",
        "joiningYear": joinYear.toString(),
        "fathersName": this.newRegCertDetailsformGroup.value.fatherName,
        "gender": this.newRegCertDetailsformGroup.value.gender,
        "address":this.newRegCertDetailsformGroup.value.al1,
        "state": this.newRegCertDetailsformGroup.value.state,
        "district": this.newRegCertDetailsformGroup.value.district,
        "country": this.newRegCertDetailsformGroup.value.country,
        "pincode":this.newRegCertDetailsformGroup.value.pin,
        "finalYearRollNo": value.rollNum,
        "examBody": value.examBody,
        "joiningMonth": joinMonth,
        "passingMonth": passMonth,
        "email": this.newRegCertDetailsformGroup.value.email,
        "paymentStatus": "SUCCESS",
        "feeReciptNo": "12345678",
        "aadhaarNo": this.newRegCertDetailsformGroup.value.adhr,
        "dateOfBirth":this.datePipe.transform(this.newRegCertDetailsformGroup.value.dob, "yyyy-MM-dd")?.toString() ,
        "barCode": "123457",
        "nursingCollage": value.collegeName,
        "passingYear": passYear.toString(),
        "courseName": value.courseName,
        "phoneNumber": this.newRegCertDetailsformGroup.value.mobNumber,
        "registrationType": this.stateData.claimType,
        "council": this.stateData.councilName,
        "mothersName": this.newRegCertDetailsformGroup.value.motherName,
        "name": this.newRegCertDetailsformGroup.value.applicantName,
        "credType":this.newRegCertDetailsformGroup.value.credType ,
        "examYear":'',
        "centerCode":'',
        "requestType":value.requestType,
        "docproof": this.convertUrlList,
        "regNumber":this.stateData?.regNo ? this.stateData?.regNo : "NA",
        "diplomaNumber": value.diplomaNumber,
        "courseState": value.stateName ? value.stateName : "NA",
        "courseCouncil": value.newCouncil ?  value.newCouncil: "NA",
        "nurseRegNo": value.otherRegnNo ? value.otherRegnNo : "NA",
        "nurseRegDate": value.date? value.date : "NA"
      }
     console.log('updateStudentBody',updateStudentBody)
      this.baseService.updateStudent$(this.osid, updateStudentBody, this.endPointUrl)
       .pipe(
         mergeMap((resp: any) => {
          this.getMakeClaimbody = {
            // entityName: "StudentFromUP",
            entityId: this.osid,
            name: "studentVerification",
            // propertiesOSID: {
            //   StudentFromUP: [
            //       this.osid
            //     ]
            // }
        }
           switch(this.userRole){
            case 'StudentOutsideUP':
              this.getMakeClaimbody = {
                ...this.getMakeClaimbody,
                entityName: "StudentOutsideUP",
                propertiesOSID: {
                  StudentOutsideUP: [
                      this.osid
                    ]
                }
              }
              break;

            case 'StudentFromUP':
              this.getMakeClaimbody = {
                ...this.getMakeClaimbody,
                entityName: "StudentFromUP",
                propertiesOSID: {
                  StudentFromUP: [
                      this.osid
                    ]
                }

              }
              break;

           }

           return this.baseService.makeClaim$(this.osid,this.getMakeClaimbody);
         }
         ))  
         .subscribe(
           (response) => {
             console.log(response);
   
           },
         )
    }
  }

  navigateToUrl(item:any){
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

  uploadFiles(){
  
     const formData = new FormData();
    for (var i = 0; i < this.fileList.length; i++) { 
      console.log(this.fileList[i])
      formData.append("files", this.fileList[i]);
    }  
    this.baseService.uploadFiles$(this.osid, formData, this.endPointUrl).subscribe((data)=>{
      console.log(data)
      this.docsResponseUrl = data.result;
      this.docsUrl = this.docsResponseUrl.split(',').filter(url=>url.trim() !== "")
      console.log('docsUrl',this.docsUrl)
      
     const uploadObj = this.docsUrl.map(url => {
        const parts = url.split('=');
        const fileNameWithQueryParams = parts[1];
        const fileName = fileNameWithQueryParams.split('/').pop();
        const extractLastPart = fileName?.split('_').pop(); 
        const getuploadObject = {
          name:extractLastPart,
          url:url
        } 
        return getuploadObject;         
      });
     console.log('uO',uploadObj)
     this.listOfFiles.push(...uploadObj)
     console.log('this.listOfFiles',this.listOfFiles)
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
    this.updatedUrlList = this.listOfFiles.map(item=> item.url)
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

  showInfo(option: any) {
    this.selectLink(option);
    console.log(option)
    switch (option) {
      case 'Payment Details':
        this.paymentDetails = !this.paymentDetails
        break;
      case 'Candidate Details':
        this.candidateDetails = true;
        this.paymentDetails = false;
        break;
      case 'Course Details':
        this.candidateDetails = false;
        this.paymentDetails = false;
        break;
      default:

        return '';
    }
    return;
  }

  onReset() {
    console.log("onReset")
    this.submitted = false;
    this.newRegCertDetailsformGroup.reset();
    this.listOfFiles = [];
  }

  navToPreviousPage() {
    console.log("hhh")
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

  handlePayment(){
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
        payerType: "Institute",
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

      optionalFields: "",

    };
    this.http.getPaymentUrl(postData).subscribe((data)=>{
      console.log(data)
      if(data){
        window.open(data?.redirectUrl, '_blank')

      }
    }
    )
  }
}
