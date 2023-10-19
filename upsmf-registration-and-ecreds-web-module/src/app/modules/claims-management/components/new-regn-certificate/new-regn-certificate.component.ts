import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { BaseServiceService } from 'src/app/services/base-service.service';
import { BreadcrumbItem } from 'src/app/modules/shared/interfaces';
import { ConfigService } from 'src/app/modules/shared';


@Component({
  selector: 'app-new-regn-certificate',
  templateUrl: './new-regn-certificate.component.html',
  styleUrls: ['./new-regn-certificate.component.scss']
})
export class NewRegnCertificateComponent {


  fileList: File[] = [];
  listOfFiles: any[] = [];
  isLoading = false;
  submitted = false;
  details: Observable<any>;


  originTypesArray = [
    {
      name:'From UP',
      key: 'StudentFromUP'
    },
    {
      name:'Outside UP',
      key: 'StudentOutsideUP'
    }

    // 'From UP', 'Outside UP'
  ]
  councilsTypesArray = [
    'UPSMF', 'UPNC', 'UPDC','UPMC'
  ]

  qualificationsTypesArray = [
    'MSC', 'BSC', 'POST BASIC', 'NURSING PRACtitioner'
  ]

  claimsTypesArray = [
    'Permanent', 'Additional', 'Provisional', 'Others'
  ]

  courseTypesArray = [
    'degree', 'Diploma'
  ]

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Claim Registration Certificate', url: '/claims/new' },
    { label: 'Claim Details', url: '/claims/new-regn-cert' }
  ];
  courseUrl:string = ''
  originTypeData:string = ''



  @Input() newRegCertformGroup: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private baseService: BaseServiceService,
    private configService: ConfigService) { }

  ngOnInit() {
    this.createForm();
    this.getCourses();
    if(localStorage.getItem('payData') ){
      localStorage.removeItem('payData');
    }
    if(localStorage.getItem('diplomaData')){
      localStorage.removeItem('dipresData');
      localStorage.removeItem('diplomaData');
    }

  }

  getCourses(){
    // this.baseService.getCourses('DIPLOMA').subscribe((data)=>{
      this.courseUrl = this.configService.urlConFig.URLS.STUDENT.GET_COURSES + 'DIPLOMA'
      this.baseService.getCourses(this.courseUrl).subscribe((data)=>{
      console.log('data',data.responseData['result'])
      this.qualificationsTypesArray = data?.responseData['result']
    })
  }

  createForm() {

    this.newRegCertformGroup = this.formBuilder.group({
      regNo: new FormControl({ disabled: true, value: '' }, [
        Validators.required]),
      claimType: new FormControl('', [
        Validators.required]),
      dob: new FormControl({ disabled: true, value: '' }, [
        Validators.required,this.validateMinAge(15) as ValidatorFn]),
      councilName: new FormControl('', [
        Validators.required]),
      origin: new FormControl('', [
        Validators.required]),
      // endDate: new FormControl({ disabled: true, value: '' }, [
      //   Validators.required, this.validateMinAge(15) as ValidatorFn]),
      courseType: new FormControl({ disabled: true, value: '' }, [
        Validators.required]),
    });
    (this.origin.valueChanges).subscribe(value => {
      this.originTypeData = value
      value === 'StudentFromUP'|| 'StudentOutsideUP'  ? this.courseType.enable() : this.courseType.disable()
    });
    this.courseType.valueChanges.subscribe(value => {
      if (value === "Diploma" && this.originTypeData === 'StudentFromUP') {
        this.dob?.enable();
        this.regNo?.enable();
        this.dob?.enable();
      } else {
        this.dob?.disable();
        this.regNo?.disable();
        this.dob?.disable();
      }
    });

  }
  get origin() {
    return this.newRegCertformGroup.get('origin') as FormControl;
  }
  get courseType() {
    return this.newRegCertformGroup.get('courseType') as FormControl;
  }
  get dob() {
    return this.newRegCertformGroup.get('dob') as FormControl;
  }
  get regNo() {
    return this.newRegCertformGroup.get('regNo') as FormControl;
  }
  // get dob() {
  //   return this.newRegCertformGroup.get('endDate') as FormControl;
  // }
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

  

  onSubmit(value: any) {
    var makeClaimBody = {
      councilName: this.newRegCertformGroup.value.councilName,
      claimType: this.newRegCertformGroup.value.claimType,
      origin: this.newRegCertformGroup.value.origin,
      degree: this.newRegCertformGroup.value.courseType,
    }
  /*   this.baseService.makeClaim$(makeClaimBody).subscribe(
      (response) => {
        console.log(response);

      },
      (error) => {
        console.error('Error response:', error);
      }
    ); */
  }


  onNewRegnCertformSubmit(value: any) {
    console.log(value)
    this.submitted = true;
    if (this.newRegCertformGroup.valid && (value.courseType==='degree')) {
      this.router.navigate(['claims/new-regn-cert-details'], { state: { body: value } });
    }
    else if(this.newRegCertformGroup.valid && (value.courseType==='Diploma' && value.origin==='StudentOutsideUP')){
      this.router.navigate(['claims/new-regn-cert-details'], { state: { body: value } })
    }
    else{
      this.router.navigate(['claims/regn-diploma-cert-details'], { state: { body: value } });
    }


  }

  radioChecked(e: any, e1: any) {
    console.log(e)
  }

  grievanceSelected(grievance: Event) {
    console.log(grievance)
  }

  councilSelected(e: Event) {
    console.log(e)
  }

  qualificationSelected(e: Event) {
    console.log(e)
  }

  claimSelected(e: Event) {
    console.log(e)
  }

  degreeSelected(e: Event) {
    console.log(e)
  }

  onReset() {
    this.submitted = false;
    this.newRegCertformGroup.reset();
    this.listOfFiles = [];
  }

  onFileChanged(event?: any) {
    for (let i = 0; i <= event.target.files.length - 1; i++) {
      let selectedFile = event.target.files[i];

      if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
        this.fileList.push(selectedFile);
        console.log();
        this.listOfFiles.push(selectedFile.name.concat(this.formatBytes(selectedFile.size)));
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
  claimData() {

  }


}
