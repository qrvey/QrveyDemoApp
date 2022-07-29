import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetColorService {

  constructor() { }

  public setColor(user?:any){
    let body: HTMLElement = (document as any).querySelector("body");
    if(!user){
      body.setAttribute("style", `--primary-color:#2E5DF4; --qv-main-color:#2E5DF4 !important`);
    }else{
      body.setAttribute("style", `--primary-color:${user.organization.hexcolor || '#2E5DF4'}; --qv-main-color:${user.organization.hexcolor} !important`);
    }
  }

}
