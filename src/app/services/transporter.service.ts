import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransporterService {

  constructor() { }
  transmorph: any;

  getObj(){
    return this.transmorph;
  }
  setObj(obj){
    this.transmorph = obj;
  }
}
