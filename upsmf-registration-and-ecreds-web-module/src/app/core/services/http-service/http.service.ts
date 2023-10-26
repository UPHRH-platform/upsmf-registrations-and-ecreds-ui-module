// http.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf, Observable, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpOptions, RequestParam, ServerResponse, Response } from '../../../interfaces/api';
import { environment } from 'src/environments/environment';
import { paymentPostData } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  /**
   * Contains base Url for api end points
   */
  baseUrl: string;
  paymentUrl:string = environment.paymentUrl;
  
  constructor(private http: HttpClient) {}

 /**
   * for making get api calls
   *
   * @param requestParam interface
   */
 get(requestParam: RequestParam, isPdfDownload? : Boolean): Observable<ServerResponse> {

  const httpOptions: HttpOptions = {
    headers: requestParam.header ? requestParam.header : this.getHeader(),
    params: requestParam.param,
  };

   if (isPdfDownload) { //for pdf download
     httpOptions.responseType = 'blob' as 'json'
   }
  
  return this.http.get<Response>(this.baseUrl + requestParam.url, httpOptions).pipe(
    mergeMap((data:Response)=>{
      // if(data.status !== 200){
      //   return throwError(() => new Error(data.error));
      // }
      const serverRes: ServerResponse ={
        statusInfo: {status: 200, statusMessage: "success"},
        responseData: data
      }
      return observableOf(serverRes);
    })
  );
}

   /**
   * for making post api calls
   * @param {RequestParam} requestParam interface
  */
   post(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };
    return this.http.post<ServerResponse>(this.baseUrl + requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        console.log(data)
      /*   if (data.statusInfo.status !== 200) {
          return throwError(() => new Error(data.statusInfo?.errorMessage));
        } */
        return observableOf(data);
      }));
  }

  // get Course and activity
  postCourse(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };
    return this.http.post<ServerResponse>(this.baseUrl + requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        console.log(data)
      /*   if (data.statusInfo.status !== 200) {
          return throwError(() => new Error(data.statusInfo?.errorMessage));
        } */
        const serverRes: ServerResponse ={
          statusInfo: {status: 200, statusMessage: "success"},
          responseData: data
        }
        return observableOf(serverRes);
      }));
  }

  /**
   * for making patch api calls
   *
   * @param {RequestParam} requestParam interface
   *
   */
  patch(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };
    return this.http.patch<ServerResponse>(this.baseUrl + requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.statusInfo.status !== 200) {
          return throwError(() => new Error(data.statusInfo?.errorMessage));
        }
        return observableOf(data);
      }));
  }

  /**
   * for making delete api calls
   * @param {RequestParam} requestParam interface
   */
  delete(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param,
      body: requestParam.data
    };
    return this.http.delete<ServerResponse> (this.baseUrl + requestParam.url, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.statusInfo.status !== 200) {
          return throwError(() => new Error(data.statusInfo?.errorMessage));
        }
        return observableOf(data);
      }));
  }

  /**
 * for making PUT api calls
 * @param {RequestParam} requestParam interface
 */
  put(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header,
      params: requestParam.param,
    };
    return this.http.put<ServerResponse>(this.baseUrl + requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
   /*      if (data.statusInfo.status !== 200) {
          return throwError(() => new Error(data.statusInfo?.errorMessage));
        } */
        return observableOf(data);
      }));
  }

    /**
   * for preparing headers
   */
    private getHeader(headers?: HttpOptions['headers']): HttpOptions['headers'] {
      const access_token = sessionStorage.getItem('token');
      const default_headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      };

      if (headers) {
        return { ...default_headers, ...headers };
      } else {
        return { ...default_headers };
      }
    }


    // Payment gateway Service

    getPaymentUrl(body: paymentPostData):Observable<any>{
      return this.http.post(this.paymentUrl,body) 
    }

    //signUp post
    SignuUpost(requestParam: RequestParam): Observable<ServerResponse> {
      const httpOptions: HttpOptions = {
        // headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
        params: requestParam.param
      };
      return this.http.post<ServerResponse>(requestParam.url, requestParam.data, httpOptions).pipe(
        mergeMap((data: ServerResponse) => {
          console.log(data)
        /*   if (data.statusInfo.status !== 200) {
            return throwError(() => new Error(data.statusInfo?.errorMessage));
          } */
          return observableOf(data);
        }));
    }

    userPost(requestParam: RequestParam): Observable<ServerResponse> {
      const httpOptions: HttpOptions = {
         headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
        params: requestParam.param
      };
      return this.http.post<ServerResponse>(requestParam.url, requestParam.data, httpOptions).pipe(
        mergeMap((data: ServerResponse) => {
          console.log(data)
        /*   if (data.statusInfo.status !== 200) {
            return throwError(() => new Error(data.statusInfo?.errorMessage));
          } */
          return observableOf(data);
        }));
    }

    userPut(requestParam: RequestParam): Observable<ServerResponse> {
      const httpOptions: HttpOptions = {
         headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
        params: requestParam.param
      };
      return this.http.put<ServerResponse>(requestParam.url, requestParam.data, httpOptions).pipe(
        mergeMap((data: ServerResponse) => {
          console.log(data)
        /*   if (data.statusInfo.status !== 200) {
            return throwError(() => new Error(data.statusInfo?.errorMessage));
          } */
          return observableOf(data);
        }));
    }
    
}
