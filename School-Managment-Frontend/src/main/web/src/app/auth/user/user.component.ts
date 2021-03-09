import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  providers: [],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userID: string;
  constructor() { }

  ngOnInit(): void {
  }

  userSelected(event) {
    this.userID = event;
  }
}
