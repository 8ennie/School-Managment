import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  providers: [],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userResourceUrl: string;
  constructor() { }

  ngOnInit(): void {
  }

  public userSelected(userResourceUrl: string): void {
    this.userResourceUrl = userResourceUrl;
  }
}
