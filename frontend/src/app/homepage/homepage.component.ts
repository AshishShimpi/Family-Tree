import { Component, OnInit } from '@angular/core';
import { person } from '../models/person.model';
import { faker } from '@faker-js/faker';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {


    inputPersonData: any = null;
    details: any = null;
    
    constructor() {
        if(localStorage.getItem('account_id') === null){
            localStorage.setItem('account_id', faker.finance.ethereumAddress()) ;
        }
        
    }
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
