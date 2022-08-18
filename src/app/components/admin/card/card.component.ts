import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() tenant?: any;
  @Input() plan_template?: any;
  @Input() plan?: any;

  constructor() { }

  ngOnInit(): void {
  }

}
