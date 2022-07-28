import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() texts: any;
  @Output() closeConfirmationModal: EventEmitter<any> = new EventEmitter();
  @Output() confirmAction: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  closeModal(){
    this.closeConfirmationModal.emit();
  }

  confirm(){
    this.confirmAction.emit();
  }

}
