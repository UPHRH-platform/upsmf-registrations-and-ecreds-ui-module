import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApproveClaim, ClaimDetails, ClaimsTableData, SentMailBody, StudentDetails, StudentDetailsForeignVerification, StudentDetailsGoodStanding, UpdatediplomaBody, diplomaBody, diplomaPaymentBody, studentUpdate, studentosIdBody } from '../interfaces/interfaces';
import { HttpService } from "../core/services/http-service/http.service";

import { environment } from 'src/environments/environment';
import { ConfigService, RequestParam, ServerResponse } from '../modules/shared';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class BaseServiceService extends HttpService {
  override baseUrl: string;
  headers: any;
  //baseUrl: string;
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    super(httpClient);
    this.baseUrl = environment.apiUrl;

  }


  getHeaders() {
    this.headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    return this.headers;
  }

  loadActivity$(): Observable<any> {
    return this.httpClient.get<any>("https://www.boredapi.com/api/activity");
    /*     console.log(this.baseUrl);
       const reqParam: RequestParam = {
         url: this.configService.urlConFig.URLS.GRIEVANCE_TICKETS.GET_ALL_TICKETS,
         data: {
          
         }
       }
       return this.post(reqParam);  */
  }
  candidateDetails$(): Observable<any> {
    return this.httpClient.get<any>("https://api.agify.io/?name=meelad");
  }

  makeClaim$(osid: string, body: ClaimDetails): Observable<any> {
    // console.log(body)
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.CLAIMS.MAKE_CLAIM,
      data: body,
      header: this.getHeaders()
    }
    return this.post(reqParam);
  }
  inviteStudent$(body: StudentDetails): Observable<any> {
    console.log(body)
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.INVITE_STUDENT,
      data: body,
      header: this.getHeaders()
    }
    console.log(reqParam)
    return this.post(reqParam);
  }
  createClaim$(body: ClaimDetails): Observable<any> {
    console.log(body)
    return of({ id: "1-fb5333e7-42ea-481b-ab0b-6422c85172ad" });
  }


  getCandidatePersonalDetails$(endPointUrl: string) {

    const reqParam: RequestParam = {
      //  url: this.configService.urlConFig.URLS.STUDENT.GET_STUDENT_DETAILS,  
      url: endPointUrl,
      /* data:{
       "name": "Arun ",
       "phoneNumber": "9887478248",
       "email": "arun.nair@example.com"
   }, */
      header: this.getHeaders()
    }
    return this.get(reqParam);

  }
  getCandidatePersonalDetailsRegulator$(entity: string, osid: string) {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.GET_STUDENT_DETAILS_REGULATOR + entity + "/" + osid,
      header: this.getHeaders()
    }
    return this.get(reqParam);

  }
  getCandidatePersonalDetailsGoodstanding$() {

    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.GET_STUDENT_DETAILS_GOODSTANDING,
      /* data:{
       "name": "Arun ",
       "phoneNumber": "9887478248",
       "email": "arun.nair@example.com"
   }, */
      header: this.getHeaders()
    }
    return this.get(reqParam);

  }
  getCandidatePersonalDetailsForeignVerification$() {

    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.GET_STUDENT_DETAILS_FOREIGNVARIFIVATION,
      /* data:{
       "name": "Arun ",
       "phoneNumber": "9887478248",
       "email": "arun.nair@example.com"
   }, */
      header: this.getHeaders()
    }
    return this.get(reqParam);

  }
  approveClaim$(osid: string, body: ApproveClaim): Observable<any> {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.ADMIN.GRANT_CLAIM + osid + "/attest",
      data: body,
      header: this.getHeaders()
    }
    return this.post(reqParam);
  }
  sendMailOutsideUp$(body: SentMailBody): Observable<any> {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.ADMIN.SENTMAIL_OUTSIDEUP,
      data: body,
      header: this.getHeaders()
    }
    return this.post(reqParam)
  }

  updateStudent$(osid: string, body: StudentDetails, endPointUrl: any): Observable<any> {
    console.log(body)
    const reqParam: RequestParam = {
      url: endPointUrl + osid,
      data: body,
      header: this.getHeaders()
    }
    return this.put(reqParam);

  }

  postStudent$(body: StudentDetails, endPointUrl: any): Observable<any> {
    console.log(body)
    const reqParam: RequestParam = {
      url: endPointUrl,
      data: body,
      header: this.getHeaders()
    }
    return this.post(reqParam);

  }


  postStudentGoodStanding$(body: StudentDetailsGoodStanding): Observable<any> {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.UPDATE_GOODSTANDING,
      data: body,
      header: this.getHeaders()
    }
    return this.post(reqParam);

  }
  updateStudentGoodStanding$(osid: string, body: StudentDetailsGoodStanding): Observable<any> {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.UPDATE_GOODSTANDING + osid,
      data: body,
      header: this.getHeaders()
    }
    return this.put(reqParam);

  }
  postStudentForeignVerification$(body: StudentDetailsForeignVerification): Observable<any> {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.UPDATE_FOREIGNVERIFICATION,
      data: body,
      header: this.getHeaders()
    }
    return this.post(reqParam);

  }
  updateStudentForeignVerification$(osid: string, body: StudentDetailsForeignVerification): Observable<any> {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.UPDATE_FOREIGNVERIFICATION + osid,
      data: body,
      header: this.getHeaders()
    }
    return this.put(reqParam);

  }
  getClaimsAdmin$() {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.CLAIMS.GET_ALL_CLAIMS_ADMIN,
      header: this.getHeaders()
    }
    return this.get(reqParam);
  }

  getClaims$(email: string) {
    console.log('header', this.getHeaders())
    /*    const headers = {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6eE80ak9FNWNjQjhGeXhuZnlIaGZNY1NYNDd0UXRCSWl4ellIbnBWdzlRIn0.eyJleHAiOjE2OTE1NzQ2NjcsImlhdCI6MTY5MTQ4ODI2NywianRpIjoiMjRkZTViOWUtMzczZi00YThmLWE3ZGQtYmZhNzY1NDBkYzNkIiwiaXNzIjoiaHR0cDovLzM0LjEwMC4yMTIuMTU2OjgwODAvYXV0aC9yZWFsbXMvc3VuYmlyZC1yYyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI0YzE0MzY5NC00YTc2LTQ4NzktYTc1MS01YjZmM2I2YjQ1ZjQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJyZWdpc3RyeS1mcm9udGVuZCIsInNlc3Npb25fc3RhdGUiOiIzZmFjOWY0NS1jMTkwLTRmNjAtOGUwNy0xMmQ0MmVhNzJmZjIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vbG9jYWxob3N0OjQyMDIiLCJodHRwOi8vbG9jYWxob3N0OjgxODAvYXV0aCIsImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMiIsImh0dHBzOi8vbG9jYWxob3N0OjQyMDAiLCJodHRwczovL25kZWFyLnhpdi5pbiIsImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCIsImh0dHA6Ly9uZGVhci54aXYuaW4iLCJodHRwOi8vMjAuMTk4LjY0LjEyOCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsIlJlZ3VsYXRvciIsImRlZmF1bHQtcm9sZXMtbmRlYXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6Im1hbm1vaGFuMkB0ZXN0LmNvbSIsImVudGl0eSI6WyJSZWd1bGF0b3IiXSwiZW1haWwiOiJtYW5tb2hhbjJAdGVzdC5jb20ifQ.NDe8jl0sWGioI3aoovi9yy4pdE3-qjSHQ2CL_TgcFia7iRE2A6yqMvOkM-wq7Pf3bGxACSMiL89wlruqK0Rs2lRgN3tW8EqgNmWC3zyvfA1R1qOD8FnIRDWqt2XgCP2zagqr502iXNA2VdY5yh1vfhX3waSPJXOpfv_xNj88na4UD7o_yzIkSXEntT2kW_u1U3Wj7q62Trl7gFhFdp_gMtw10uRNQAvuBYLJDwEUwS0JvY1xNE2OYpHufIlcs2dYg2BzyYsbYQj0ZtJHBjY0DeWOoRy4RSC6JsB21KRJZVBC-gxp-4FFCyT6jeVHvzaau7tKJFJcpxM_Gn0rtxwKlw`
       };
       
   
    
       return this.httpClient.get<any>("http://localhost:8081/api/v1/Regulator/claims/", { 'headers': headers });
     
      */
    // `${this.baseUrl + this.configService.urlConFig.URLS.USER.GET_USERDETAILS_BY_ID}?id=${id}`
    const reqParam: RequestParam = {
      url: `${this.configService.urlConFig.URLS.CLAIMS.GET_ALL_CLAIMS}?email=${email}`,
      header: this.getHeaders()
    }
    return this.get(reqParam);

  }
  getCredentials$(entity:string,entityId:string,attestationName:string,attestationId:string,reqType?:string){
    const headers  = {
      'Accept': 'application/pdf',
      'Authorization': `Bearer ${localStorage.getItem("token")}` };
    // this.headers.Accept = 'application/pdf'
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.DOWNLOAD_CREDENTIALS_v3 + entity + "/" + entityId + "/attestation" + "/" + attestationName + "/" + attestationId + "/" + entity,
      header: headers
    }
    return this.get(reqParam, true); // pass true as second param for pdf download

  }
  getCredentialsStudent$(entity:string,entityId:string,attestationName:string,attestationId:string, reqType:string){
    const headers  = {
      'Accept': 'application/pdf',
      'Authorization': `Bearer ${localStorage.getItem("token")}` };
    // this.headers.Accept = 'application/pdf'
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.DOWNLOAD_CREDENTIALS_v3 + entity + "/" + entityId + "/attestation" + "/" + attestationName + "/" + attestationId + "/" + reqType,
      header: headers
    }
    return this.get(reqParam, true); // pass true as second param for pdf download

  }
  getDiplomaCredentials$(osid:string){
    const headers  = {
      'Accept': 'application/pdf',
      'Authorization': `Bearer ${localStorage.getItem("token")}` };
    // this.headers.Accept = 'application/pdf'
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.DOWNLOAD_CREDENTIALS_DIPLOMA + osid,
      header: headers
    }
    return this.get(reqParam, true); // pass true as second param for pdf download

  }
  getAllClaims$(body:any) {
    const header = {
      'Accept': 'application/json'
    }
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.CLAIMS.ALL_CLAIMS,
      data:body,
      header: header
    }
    return this.post(reqParam);
  }

  uploadFiles$(osid: string, body: any, endPointUrl: any) {
    const reqParam: RequestParam = {
      url: endPointUrl + osid + "/upload/multi-files",
      data: body,
      header: this.getHeaders()
    }
    return this.put(reqParam);
  }


  getUserRole() {
    var token: any
    token = localStorage.getItem('token')
    let tokenId: any = ''
    tokenId = token
    console.log('accessTOken', tokenId)
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(tokenId);
    console.log(decoded)
    return decoded.entity

  }

  getUserEmail() {
    var token: any
    token = localStorage.getItem('token')
    let tokenId: any = ''
    tokenId = token
    console.log('accessTOken', tokenId)
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(tokenId);
    console.log(decoded)
    return decoded.email

  }

  getCourses(courseUrl: string) {
    const reqParam: RequestParam = {
      url: courseUrl,
      header: this.getHeaders()
    }
    return this.get(reqParam);

  }

  fetchCourse(body:any){
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.FETCH_COURSE,
      data: body,
      header: this.getHeaders()
    }
    return this.postCourse(reqParam);
  }

  fetchActivity(body:any){
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.FETCH_ACTIVITY,
      data: body,
      header: this.getHeaders()
    }
    return this.postCourse(reqParam);
  }


  generate_uuidv4() {
    var dt = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var rnd = Math.random() * 16; //random number in range 0 to 16
      rnd = (dt + rnd) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === "x" ? rnd : (rnd & 0x3) | 0x8).toString(16);
    });

  };

  updateStudentData$(osid: string, body: studentUpdate, endPointUrl: any): Observable<any> {
    console.log(body)
    const reqParam: RequestParam = {
      url: endPointUrl + osid,
      data: body,
      header: this.getHeaders()
    }
    return this.put(reqParam);

  }
  getRegistrationClaimsAdmin$() {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.ADMIN.GET_ALL_CLAIMS_ADMIN,
      header: this.getHeaders()
    }
    return this.get(reqParam);
  }
  getDiploma$(body: diplomaBody) {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.GET_DIPLOMA_DETAILS,
      data: body,
      header: this.getHeaders()
    }
    return this.post(reqParam)
  }
  diplomaPayment$(body: diplomaPaymentBody) {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.DIPLOMA_PAYMENT,
      data: body,
      header: this.getHeaders()
    }
    return this.post(reqParam)
  }
  getStudentosid$(body: studentosIdBody) {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.STUDENT.STUDENT_OSID,
      data: body,
      header: this.getHeaders()
    }
   return this.post(reqParam)
  }
  getReasonAdmin$(osid:string){
    const reqParam:RequestParam={
      url:this.configService.urlConFig.URLS.ADMIN.REJECT_REASON + osid,
      header:this.getHeaders()
    }
    return this.get(reqParam)

  }
  getReasonStudent$(osid:string){
    const reqParam:RequestParam={
      url:this.configService.urlConFig.URLS.STUDENT.STUDENT_REJECT_REASON + osid,
      header:this.getHeaders()
    }
    return this.get(reqParam)

  }
  getQRCode$(entityName:string,entityId:string){
    const header = {
      'Accept': 'text/plain',
      
    }
    const reqParam:RequestParam={
      url:this.configService.urlConFig.URLS.ADMIN.CREATE_QR + entityName + "/" + entityId,
      header:header
    }
    return this.get(reqParam)
  }
  updateDiploma$(osId:string,body: UpdatediplomaBody){
    const reqParam:RequestParam={
      url:this.configService.urlConFig.URLS.STUDENT.UPDATE_DIPLOMA + osId,
      data: body,
      header:this.getHeaders()
    }
    return this.put(reqParam)

  }

    

}
