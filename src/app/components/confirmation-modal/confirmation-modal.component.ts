import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() texts: any;
  @Input() scrollContent: boolean = false;
  @Output() closeConfirmationModal: EventEmitter<any> = new EventEmitter();
  @Output() confirmAction: EventEmitter<any> = new EventEmitter();
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeModal()
  }

  constructor() { }

  ngOnInit(): void {
  }

  closeModal() {
    this.closeConfirmationModal.emit();
  }

  confirm() {
    this.confirmAction.emit();
  }

}
