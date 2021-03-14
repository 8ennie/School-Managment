import { TreeNode } from 'primeng/api';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {

  public treeNodes: TreeNode[] = [];
  public areas: string[];


  constructor() { }

  ngOnInit(): void {
  }

  public onNodeExpand(): void{

  }

  public returnFalse(){
    return false;
  }

}
