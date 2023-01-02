import { Component, OnInit } from '@angular/core';
import { person } from '../models/person.model';
import { faker } from '@faker-js/faker';
import { BackendService } from '../services/backend.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {


    inputPersonData: any = null;
    details: any = null;
    loader = false;
    message = '';

    constructor(private backendService: BackendService) {
        if (localStorage.getItem('account_id') === null) {
            localStorage.setItem('account_id', faker.finance.ethereumAddress());
        }

    }
    ngOnInit(): void {
        this.backendService.loader.subscribe((res: any) => {
            this.loader = res.showLoader;
            this.message = res.message;
        });
    }

    setDetails(data: person) {
        this.details = null;
        this.details = data;
    }
    setTree(person: any) {
        this.inputPersonData = null;
        this.inputPersonData = person;
    }

}
