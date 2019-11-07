import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  token: string;

  public getToken(){
    return this.token;
  }

  public setToken(t: string){
    this.token = t;
  }

  public removeToken(){
    this.token = '';
  }
}
