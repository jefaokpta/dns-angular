import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PingService {

  private ping = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  public getServerSpringPing(page: string){
    return this.http.get(this.ping + page, {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    });
  }
}
