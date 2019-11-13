import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message';
import { TokenStore } from '../utils/token-store';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  // private url = 'http://localhost:8080/DnsVcomWS/ws/';
   private url = location.origin + ':8080/VipDNS/ws/'; // PRODUCAO: LOCALHOST COM O WS
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
  public updateServer(page: string, data){
    return this.http.put<Message>(this.url + page, data, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'Bearer ' + this.token.getToken()
      })
    });
  }
  public getServer(page: string){
    return this.http.get<Message>(this.url + page, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'Bearer ' + this.token.getToken()
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

}
