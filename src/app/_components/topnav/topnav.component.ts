import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
  isIconToggle: boolean = false;

  constructor() { }

  async ngOnInit() {

  }

  toggleSidebar() {
    this.isIconToggle = false;
  }

}
