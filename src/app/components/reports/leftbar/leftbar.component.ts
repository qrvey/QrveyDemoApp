import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.scss']
})
export class LeftbarComponent implements OnInit {

  @Input() loggedUser:any; 

  constructor() { }

  ngOnInit(): void {
  }

}
