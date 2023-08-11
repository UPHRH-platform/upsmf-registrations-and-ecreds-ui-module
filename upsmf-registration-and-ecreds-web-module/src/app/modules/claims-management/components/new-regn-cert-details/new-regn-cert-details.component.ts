import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { BaseServiceService } from 'src/app/services/base-service.service';
import {  mergeMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-regn-cert-details',
  templateUrl: './new-regn-cert-details.component.html',
  styleUrls: ['./new-regn-cert-details.component.scss']
})
export class NewRegnCertDetailsComponent {
  @ViewChild('attachments') attachment: any;
  
  links=['Candidate Details','Course Details','Payment Details']

  newRegCertformGroup: FormGroup;
  public newRegCertDetailsformGroup: FormGroup;
  newRegCourseDetailsformGroup: FormGroup;
  submitted = false;

  candidateDetails:boolean = true;
  paymentDetails:boolean = false;

  genderTypesArray =['Male' , 'Female', 'Others']

  listOfFiles: any[] = [];
  fileList: File[] = [];

  listOfCourseFiles: any[] = [];
  courseFileList: File[] = [];
  stateData: any;
  selectedLink: string='Candidate Details';
  

  constructor(private formBuilder: FormBuilder,
    private location: Location,private baseService: BaseServiceService,
    private router: Router
      ) {
        this.stateData= this.router?.getCurrentNavigation()?.extras.state;
       }

     ngOnInit() {
      this.initForm();
    }
  
  initForm() {

    this.newRegCertDetailsformGroup = this.formBuilder.group({
      applicantName: new FormControl('', [
        Validators.required]),
      motherName: new FormControl('', [
        Validators.required]),
      fatherName: new FormControl('', [
        Validators.required]),
      dob: new FormControl('08/08/2023', [
        Validators.required]),
      al1: new FormControl('', [
        Validators.required]),
      al2: new FormControl('', [
        Validators.required]),
      district: new FormControl('', [
        Validators.required]),
      state: new FormControl('', [
        Validators.required]),
      pin: new FormControl('', [
        Validators.required,Validators.minLength(6),
        Validators.pattern("^[0-9]*$")]
        ),
      country: new FormControl('', [
        Validators.required]),
      adhr: new FormControl('', [
        Validators.required]),
      gender: new FormControl('Male', [
        Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      mobNumber: new FormControl('', [
        Validators.required,
        Validators.pattern("^(0|91)?[6-9][0-9]{9}$")]),
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
          Validators.required])
        });
        
    }

    newRegCertDetailsformGroupSubmit(value: any) {
      console.log(value)
      this.submitted = true;
      if (this.newRegCertDetailsformGroup.valid) {
        this.candidateDetails = false;
      }
      
    }
    onSubmit(value:any){
      // console.log(value)
      var applicant_details = this?.newRegCertDetailsformGroup?.value;
      var course_details = this?.newRegCourseDetailsformGroup?.value;
      var data = this.stateData;
      const dob = new Date(data.body.endDate);
      const year = dob.getFullYear();
      const month = String(dob.getMonth() + 1).padStart(2, '0');
      const day = String(dob.getDate()).padStart(2, '0');
  
     const dateobbirth = `${year}-${month}-${day}`;
      console.log("first form",data)
      console.log(applicant_details)
      console.log("course",course_details)
      const joinDate = new Date(course_details.joinDate);
      const passDate = new Date(course_details.passDate);
      const jMonth = joinDate.getMonth();
      const pMonth = passDate.getMonth();
      const joinYear:any = joinDate.getFullYear().toString();
      const passYear :any= joinDate.getFullYear().toString();
     


    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const joinMonth = months[jMonth];
    const passMonth = months[pMonth];

     
      let updateStudent ={
        
        
        registrationType: data.body.courseType,
        name:applicant_details.applicantName,
        phoneNumber:applicant_details.mobNumber,
        council: data.body.councilName,
        email: applicant_details.email,
        mothersName: applicant_details.motherName,
        fathersName: applicant_details.fatherName,
        dateOfBirth: dateobbirth,
      
        aadhaarNo: applicant_details.adhr,
        gender: applicant_details.gender,
        courseName: data.body.claimType,
        nursingCollage: course_details.collegeName,

        joiningMonth: joinMonth,
        joiningYear: joinYear,
        passingMonth: passMonth,
        passingYear: passYear,
        finalYearRollNo: course_details.rollNum,
        examBody: course_details.examBody,
        courseState:applicant_details.state,

      }
      console.log("body.........",updateStudent)
     
      this.baseService.inviteStudent$(updateStudent)
      // .pipe(
      //   mergeMap((response) => {
      //     console.log("first", response)
      //     const claimBody = {

      //       entityId: response.responseData.id,
      //       entityName: course_details.courseName,
      //       name: applicant_details.applicantName,
      //       propertiesOSID: {
      //         studentUPVerification: [response.responseData.id
  
      //         ]
      //       }
      //     }
      //     console.log(claimBody)
  
      //     return this.baseService.createClaim$(claimBody);
      //   })
      // )
      .subscribe(
        (response) => {
          console.log("second", response)
  
        }
      );

    }
          
        
        
   
    onFileChanged(event?: any){
      console.log(event);
      for (let i = 0; i <= event.target.files.length - 1; i++) {
        let selectedFile = event.target.files[i];
     
        if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
          this.fileList.push(selectedFile);
          this.listOfFiles.push(selectedFile.name.concat(this.formatBytes(selectedFile.size)));
        }
      }
    }
   


    onCourseFileChanged(event?: any){
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

  showInfo(option : any){
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

  navToPreviousPage(){
    console.log("hhh")
    this.location.back()
  }
}
