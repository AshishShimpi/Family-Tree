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
    details: any = 'empty';
    
    ngOnInit(): void {
        // setTimeout(()=>{
        //     this.inputPersonData ={ person: [{
        //         accountId: 123,
        //         id: '5A',
        //         level: 2,
        //         parent: '0A',
        //         name: '3rd Child',
        //     },{
        //         accountId: 123,
        //         id: '6A',
        //         level: 2,
        //         parent: '5A',
        //         name: '3 2nd Child',
        //     }]}
        // },3000);
    }

    setDetails(details: person) {
        // console.log('from tree to home', details);
        this.details = details;
    }
    setTree(person:any){
        this.inputPersonData = {person : [person]};
    }

}
