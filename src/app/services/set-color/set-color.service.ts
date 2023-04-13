import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetColorService {

  constructor() { }

  public setColor(user?:any){
    let body: HTMLElement = (document as any).querySelector("body");
    if(!user){
      body.setAttribute("style", `--primary-color:#ff6f00; --qv-main-color:#ff6f00 !important`);
    }else{
      body.setAttribute("style", `--primary-color:${user.organization.hexcolor || '#2E5DF4'}; --qv-main-color:${user.organization.hexcolor} !important; --qv-pageview-canvas-valuelist-font-color: #000 !important`);

      let popStyles = document.createElement('style');
      popStyles.innerHTML = `
        an-qv-popup-menu{
          --primary-color:${user.organization.hexcolor || '#2E5DF4'}; 
          --qv-main-color:${user.organization.hexcolor} !important; 
          --qv-pageview-canvas-valuelist-font-color: #000 !important;
          ${user.organization.hextext ? '--qv-text-color:' + user.organization.hextext + ';'  : ''}
        }
      `;
      body.appendChild(popStyles);
    }
  }

}
