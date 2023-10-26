import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BaseServiceService } from '../services/base-service.service';
import { mergeMap } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-success-failure',
  templateUrl: './payment-success-failure.component.html',
  styleUrls: ['./payment-success-failure.component.scss']
})
export class PaymentSuccessFailureComponent implements OnInit {
  isSuccess: boolean = false;
  paymentResponse: string = ''
  resData: any;
  dipData: any;
  getMakeClaimbody: any;
  transactionAmt: string = ''
  transactionId: string = ''
  type: string;
  diplomaBody: any;
  candetails: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private baseService: BaseServiceService,
    private datePipe: DatePipe,) {

  }

  ngOnInit(): void {
    if (localStorage.getItem('payData')) {
      const storedData = localStorage.getItem('payData')
      if (storedData) {
        this.resData = JSON.parse(storedData)
        console.log("localData", this.resData)
      }
    }
    else {
      const sData = localStorage.getItem('diplomaData')
      if (sData) {
        this.dipData = JSON.parse(sData)
        console.log("localData", this.dipData)
      }
    }



    this.route.queryParams.subscribe((param) => {
      console.log('param', param)
      if (param['resp'] === 'success') {
        this.isSuccess = true;
        this.transactionAmt = param['transaction_amount'];
        this.transactionId = param['transaction_id']
        this.paymentResponse = param['resp']
        this.makeClaim()
      }
      else {
        this.isSuccess = false;
        this.transactionAmt = '';
        this.transactionId = '';
      }

    })
  }
  makeClaim() {
    if (this.paymentResponse === 'success' && this.resData) {
      const updateStudent = {
        "paymentStatus": "SUCCESS",
        "feeReciptNo": this.transactionId
      }
      this.baseService.updateStudentData$(this.resData.osId, updateStudent, this.resData.endPointUrl)
        .pipe(
          mergeMap((resp: any) => {
            this.getMakeClaimbody = {
              entityId: this.resData.osId,
            }
            switch (this.resData?.origin) {
              case 'StudentOutsideUP':
                this.getMakeClaimbody = {
                  ...this.getMakeClaimbody,
                  entityName: "StudentOutsideUP",
                  name: "studentVerification",
                  propertiesOSID: {
                    StudentOutsideUP: [
                      this.resData.osId
                    ]
                  }
                }
                break;

              case 'goodStandingCert':
                this.getMakeClaimbody = {
                  ...this.getMakeClaimbody,
                  entityName: "StudentGoodstanding",
                  name: "studentGoodstandingVerification",
                  propertiesOSID: {
                    StudentGoodstanding: [
                      this.resData.osId
                    ]
                  }

                }
                break;
              case 'ForeignVerifyReq':
                this.getMakeClaimbody = {
                  ...this.getMakeClaimbody,
                  entityName: "StudentForeignVerification",
                  name: "StudentForeignVerify",
                  propertiesOSID: {
                    StudentForeignVerification: [
                      this.resData.osId
                    ]
                  }
                }
                break;
              case 'StudentFromUP':
                console.log("....outside up....")
                this.getMakeClaimbody = {
                  ...this.getMakeClaimbody,
                  entityName: "StudentFromUP",
                  name: "studentVerification",
                  propertiesOSID: {
                    StudentFromUP: [
                      this.resData.osId
                    ]
                  }

                }
                break;

            }

            return this.baseService.makeClaim$(this.resData.osId, this.getMakeClaimbody);
          }
          )).subscribe((data) => {
            console.log(data)
            if (data.params['status'] === 'SUCCESSFUL') {
              localStorage.removeItem('payData');
            }
          })


    }
    else if (this.paymentResponse === 'success') {
      const diplomaPaymentBody = {
        "osid": this.dipData.osId,
        "name": this.dipData.name,
        "finalYearRollNo": this.dipData.finalYearRollNo,
        "paymentAmount": "1000",
        "transactionId": this.transactionId,
        "dateOfPayment": this.datePipe.transform(new Date(), "yyyy-MM-dd")?.toString(),
        "paymentStatus": "SUCCESS"
      }
      this.baseService.diplomaPayment$(diplomaPaymentBody).subscribe({
        next: (response) => {
          this.diplomaBody = {
            filters: {
              finalYearRollNo: {
                eq: this.dipData.regNum
              },
              dateOfBirth: {
                eq: this.dipData.dod
              },
              email: {
                eq: this.dipData.email
              }
            }
          }
          this.baseService.getDiploma$(this.diplomaBody).subscribe((response) => {
            console.log(response)
            if (Array.isArray(response)) {
              this.candetails = response[0]
              console.log(response[0])

              const updatediplomaBody = {
                "paymentStatus": "SUCCESS",
                "aadhaarNo":this.candetails.aadhaarNo,
                "address":this.candetails.address,
                "barcode":this.candetails.barcode,
                "candidatePic":this.candetails.candidatePic,
                "candidateSignature":this.candetails.candidateSignature,
                "centerCode":this.candetails.centerCode,
                "certificateNumber":this.candetails.certificateNumber,
                "council":this.candetails.council,
                "country":this.candetails.country,
                "courseName":this.candetails.courseName,
                "credType":this.candetails.credType,
                "date":this.candetails.date,
                "dateOfBirth":this.candetails.dateOfBirth,
                "district":this.candetails.district,
                "docproof":this.candetails.docproof,
                "email":this.candetails.email,
                "examBody":this.candetails.examBody,
                "examYear": this.candetails.examYear,
                "fathersName":this.candetails.fathersName,
                "feeReciptNo":this.candetails.feeReciptNo,
                "finalYearRollNo":this.candetails.finalYearRollNo,
                "gender":this.candetails.gender,
                "joiningMonth":this.candetails.joiningMonth,
                "joiningYear":this.candetails.joiningYear,
                "mothersName":this.candetails.mothersName,
                "name":this.candetails.name,
                "nursingCollage":this.candetails.nursingCollage,
                "passingMonth":this.candetails.passingMonth,
                "passingYear":this.candetails.passingYear, 
                "phoneNumber":this.candetails.phoneNumber ,
                "pincode":this.candetails.pincode,
                "state":this.candetails.state,
                "university":this.candetails.university,
                "validityUpto":this.candetails.validityUpto,
                "refNo":this.candetails.refNo ? this.candetails.refNo : '',
                "regNumber": this.candetails.regNumber ? this.candetails.regNumber : '',
                "activityName":this.candetails.activityName ? this.candetails.activityName : ''
              }
              this.baseService.updateDiploma$(this.dipData.osId, updatediplomaBody).subscribe((response) => {
                console.log(response)
              })
            }

           
          })

          console.log(response)
          this.type = 'diploma';
          localStorage.setItem('dipresData', JSON.stringify(response))


        },
        error: (err) => {
          console.log(err);
        }



      })

    }
  }

  navigateToHome() {
    if (this.type === 'diploma') {
      this.router.navigate(['/claims/regn-diploma-cert-details'])

    }
    else {
      this.router.navigate(['/claims/manage'])

    }

  }
}
