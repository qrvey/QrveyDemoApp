import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  @Input() size: number = 80;
  @Input() theme?: string = undefined;
  @Input() text?: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
