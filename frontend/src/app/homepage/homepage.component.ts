import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

    constructor() { 

    }
    details:any = 'empty';
    ngOnInit(): void {
    }

    setDetails(details:any){
        console.log('from tree to home', details);
        this.details = details;
    }

}
