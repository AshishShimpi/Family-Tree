
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { person } from '../models/person.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BackendService {

    dummyTreeData: person[] = [
        {
            accountId: 123,
            id: '0A',
            level: 1,
            parent: null,
            name: 'Great grandpa',
            spouse: 'Great grandMa',
            location: 'india',
            dob: '',
            address: 'maharashtra',
            image1: undefined,
            image2: undefined
        }, {
            accountId: 123,
            id: '1A',
            level: 2,
            parent: '0A',
            name: 'Daughter 1',
            spouse: 'dau in law',
            location: 'daughter country',
            dob: '',
            address: 'daughter city',
            image1: undefined,
            image2: undefined
        }, {
            accountId: 123,
            id: '2A',
            level: 2,
            parent: '0A',
            name: 'Son 1',
            spouse: 'son in law',
            location: 'son country',
            dob: '',
            address: 'son city',
            image1: undefined,
            image2: undefined
        }, {
            accountId: 123,
            id: '3A',
            level: 3,
            parent: '2A',
            name: 'Daughter 11',
            spouse: '11 dau in law',
            location: '11 daughter country',
            dob: '',
            address: '11 daughter city',
            image1: undefined,
            image2: undefined
        }, {
            accountId: 123,
            id: '4A',
            level: 3,
            parent: '1A',
            name: 'Son 11',
            spouse: '11 son in law',
            location: '11 son country',
            dob: '',
            address: '11 son city',
            image1: undefined,
            image2: undefined
        },
    ]
    constructor(private http: HttpClient) { }

    getFamilyData(): Observable<person[]> {
        
        return new BehaviorSubject(this.dummyTreeData);
    }
    savePersonData(data: any): Observable<unknown> {
        return this.http.post('http://localhost:3000/addPerson', data, { responseType: 'json' }).pipe(
            catchError(err => {
                console.log('error in savePersonData \n' + err.message);
                return of();
            })
        );
    }
}
