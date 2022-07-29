import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-link',
  templateUrl: './button-link.component.html',
  styleUrls: ['./button-link.component.scss']
})
export class ButtonLinkComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() link = '';
  @Input() text = '';
}
