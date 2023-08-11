import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { claimDetails, claimcolumn, studentDetails } from '../interfaces/interfaces';
import { HttpService } from "../core/services/http-service/http.service";

import { environment } from 'src/environments/environment';
import { ConfigService, RequestParam, ServerResponse } from '../modules/shared';

@Injectable({
  providedIn: 'root'
})
export class BaseServiceService  extends HttpService   {
  override baseUrl: string;
 //baseUrl: string;
  constructor(private httpClient: HttpClient,private configService: ConfigService) { 
    super(httpClient);
    this.baseUrl = environment.apiUrl;
  }

  

  loadActivity$() : Observable<any> {
    return this.httpClient.get<any>("https://www.boredapi.com/api/activity");
 /*     console.log(this.baseUrl);
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.GRIEVANCE_TICKETS.GET_ALL_TICKETS,
      data: {
       
      }
    }
    return this.post(reqParam);  */
  }
  candidateDetails$(): Observable<any>{
    return this.httpClient.get<any>("https://api.agify.io/?name=meelad");
  }
  makeClaim$(body: claimcolumn): Observable<any>{
    console.log(body)
    return of({respone:"success"});
  }
  // updateStudent$(body: studentDetails): Observable<any>{
  //   console.log(body)
  //   return of({id:"1-fb5333e7-42ea-481b-ab0b-6422c85172ad"});
  // }
  createClaim$(body: claimDetails): Observable<any>{
    console.log(body)
    return of({id:"1-fb5333e7-42ea-481b-ab0b-6422c85172ad"});
  }

  getClaims$(){
 /*    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6eE80ak9FNWNjQjhGeXhuZnlIaGZNY1NYNDd0UXRCSWl4ellIbnBWdzlRIn0.eyJleHAiOjE2OTE1NzQ2NjcsImlhdCI6MTY5MTQ4ODI2NywianRpIjoiMjRkZTViOWUtMzczZi00YThmLWE3ZGQtYmZhNzY1NDBkYzNkIiwiaXNzIjoiaHR0cDovLzM0LjEwMC4yMTIuMTU2OjgwODAvYXV0aC9yZWFsbXMvc3VuYmlyZC1yYyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI0YzE0MzY5NC00YTc2LTQ4NzktYTc1MS01YjZmM2I2YjQ1ZjQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJyZWdpc3RyeS1mcm9udGVuZCIsInNlc3Npb25fc3RhdGUiOiIzZmFjOWY0NS1jMTkwLTRmNjAtOGUwNy0xMmQ0MmVhNzJmZjIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vbG9jYWxob3N0OjQyMDIiLCJodHRwOi8vbG9jYWxob3N0OjgxODAvYXV0aCIsImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMiIsImh0dHBzOi8vbG9jYWxob3N0OjQyMDAiLCJodHRwczovL25kZWFyLnhpdi5pbiIsImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCIsImh0dHA6Ly9uZGVhci54aXYuaW4iLCJodHRwOi8vMjAuMTk4LjY0LjEyOCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsIlJlZ3VsYXRvciIsImRlZmF1bHQtcm9sZXMtbmRlYXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6Im1hbm1vaGFuMkB0ZXN0LmNvbSIsImVudGl0eSI6WyJSZWd1bGF0b3IiXSwiZW1haWwiOiJtYW5tb2hhbjJAdGVzdC5jb20ifQ.NDe8jl0sWGioI3aoovi9yy4pdE3-qjSHQ2CL_TgcFia7iRE2A6yqMvOkM-wq7Pf3bGxACSMiL89wlruqK0Rs2lRgN3tW8EqgNmWC3zyvfA1R1qOD8FnIRDWqt2XgCP2zagqr502iXNA2VdY5yh1vfhX3waSPJXOpfv_xNj88na4UD7o_yzIkSXEntT2kW_u1U3Wj7q62Trl7gFhFdp_gMtw10uRNQAvuBYLJDwEUwS0JvY1xNE2OYpHufIlcs2dYg2BzyYsbYQj0ZtJHBjY0DeWOoRy4RSC6JsB21KRJZVBC-gxp-4FFCyT6jeVHvzaau7tKJFJcpxM_Gn0rtxwKlw`
    };
    

 
    return this.httpClient.get<any>("http://localhost:8081/api/v1/Regulator/claims/", { 'headers': headers });
  
   */
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6eE80ak9FNWNjQjhGeXhuZnlIaGZNY1NYNDd0UXRCSWl4ellIbnBWdzlRIn0.eyJleHAiOjE2OTE3MzU3NjQsImlhdCI6MTY5MTY0OTM2NCwianRpIjoiM2M1OTFjYzQtYTNkMi00MGQzLThlNDAtNjgzMDZhYjI2ZjU5IiwiaXNzIjoiaHR0cDovL3JlZ2lzdHJhdGlvbi51cGhyaC5pbjo4MDgwL2F1dGgvcmVhbG1zL3N1bmJpcmQtcmMiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZDJmMGRlYzctMjVlMC00Y2U0LTk1YjgtZDgyZTg5OWI2NjkyIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicmVnaXN0cnktZnJvbnRlbmQiLCJzZXNzaW9uX3N0YXRlIjoiY2ZmNzY0ODMtMWQwZS00OWNmLWFmODUtNzFkZWNmOTVjZWIwIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJTdHVkZW50RnJvbVVQIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtbmRlYXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJBcnVuIE5haXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhcnVuMTIzQGV4YW1wbGUuY29tIiwiZ2l2ZW5fbmFtZSI6IkFydW4iLCJmYW1pbHlfbmFtZSI6Ik5haXIiLCJlbnRpdHkiOlsiU3R1ZGVudEZyb21VUCJdLCJlbWFpbCI6ImFydW4xMjNAZXhhbXBsZS5jb20ifQ.pBkMEV7-VcZ_pRv1cI5fPeIjahGK0jd-E6T5akS2lk8cwULnhMIvvItJXkPlYtFYyACIhEcNOBl8Mf6ic4glaypmpJnl8xjEEHoEaCBQRD3qpSX7uyGmGZ7LkVaTQz7Joh38Pv73gK7UDi-k-4qqD1dvU3Bh66hVGiNkMgCM2KjNOGjqKlB0JohQc3RU_4VgbohVkQFlMzM6MxM-YKztLINDH6i5ZGttpINSZ-a6c_CZ1ohY-OqKWHyDImColH-4ijCsiDxxpvT-3J7f2uQpnCxgXplb9Ue7OpUWUtjp3RtY1FGL9WtKIEF6XstIRnG9sG8HShrkAOBWkoDA5jSk7w`
    };
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.CLAIMS.GET_ALL_CLAIMS,  
      header: headers
    }
    return this.get(reqParam);
    
  
  }

  inviteStudent$(body: studentDetails): Observable<any> {
    const headers = ({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    
    const reqParams: RequestParam= {
      url :this.configService.urlConFig.URLS.INVITE_STUDENT_FROMUP,
      header:headers,
      data:body
      
    }
    return this.post(reqParams);
  }
 
}
