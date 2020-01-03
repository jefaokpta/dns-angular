import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message';
import { TokenStore } from '../utils/token-store';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

   private url = 'http://localhost:8080/v1/';
   private ping = 'http://localhost:8080/';
  // private url = location.origin + ':8080/VipDNS/ws/'; // PRODUCAO: LOCALHOST COM O WS
  // private url = 'http://dns.vcomsolucoes.com.br:8080/VipDNS/ws/';

  constructor(
    private http: HttpClient,
    private token: TokenService
    ) { }

  public postServer(page: string, data){
    return this.http.post<Message>(this.url + page, data, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'Bearer ' + this.token.getToken()
      })
    });
  }
  public postServerSpring(page: string, data){
    return this.http.post(this.url + page, data, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'BASIC ' + this.token.getToken()
      })
    });
  }
  public postServerSpringLogin(page: string, data, auth){
    return this.http.post(this.url + page, data, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'BASIC ' + auth
      })
    });
  }
  public updateServer(page: string, data){
    return this.http.put<Message>(this.url + page, data, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'Bearer ' + this.token.getToken()
      })
    });
  }
  public updateServerSpring(page: string, data){
    return this.http.put(this.url + page, data, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'BASIC ' + this.token.getToken()
      })
    });
  }
  public getServer(page: string){
    return this.http.get<Message>(this.url + page, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'BASIC ' + this.token.getToken()
      })
    });
  }
  public getServerSpring(page: string){
    return this.http.get(this.url + page, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'BASIC ' + this.token.getToken()
      })
    });
  }
  public getServerSpringPing(page: string){
    return this.http.get(this.ping + page, {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    });
  }
  public deleteServer(page: string, id: number){
    return this.http.delete<Message>(this.url + page + '/' + id, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'Bearer ' + this.token.getToken()
      })
    });
  }
  public deleteServerSpring(page: string, id: number){
    return this.http.delete(this.url + page + '/' + id, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'BASIC ' + this.token.getToken()
      })
    });
  }

}
