import { Component, OnInit } from '@angular/core';
import { person } from '../models/person.model';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

    constructor() {

    }
    inputPersonData: any = null;
    details: any = null;
    
    ngOnInit(): void {
    }

    setDetails(data: person) {
        this.details = null;
        this.details = data;
    }
    setTree(person:any){
        this.inputPersonData = null;
        this.inputPersonData = person;
    }

}
