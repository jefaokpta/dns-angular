import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message';
import { TokenStore } from '../utils/token-store';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

   private url = 'http://localhost:8080/DnsVcomWS/ws/';
  // private url = location.origin + '/DnsVcomWS/ws/'; // PRODUCAO LOCALHOST COM O WS

  constructor(private http: HttpClient) { }

  public postServer(page: string, data){
    return this.http.post<Message>(this.url + page, data, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'Bearer ' + new TokenStore().getToken()
      })
    });
  }
  public getServer(page: string){
    return this.http.get<Message>(this.url + page, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'Bearer ' + new TokenStore().getToken()
      })
    });
  }
  public deleteServer(page: string, id: number){
    return this.http.delete<Message>(this.url + page + '/' + id, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'Bearer ' + new TokenStore().getToken()
      })
    });
  }

}
