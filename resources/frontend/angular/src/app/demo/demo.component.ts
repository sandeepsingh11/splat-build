import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  test() {
    this.http.get('/api/test').subscribe(data => console.log(data));
  }
}
