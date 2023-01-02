
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { person } from '../models/person.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackendService {

    public loader = new Subject();

    constructor(private http: HttpClient) { }

    getFamilyData(id: any): Observable<person[]> {
        this.loader.next({
            showLoader: true, message: 'Fetching Family Data'
        });
        return this.http.get<person[]>(environment.BACKEND_URL + 'getFamily', { responseType: 'json', params: { accountId: id } }).pipe(
            catchError(err => {
                return throwError(() => new Error(err.message));
            })
        );
        // return new BehaviorSubject(this.dummyTreeData);
    }

    savePersonData(data: any): Observable<unknown> {
        this.loader.next({
            showLoader: true, message: 'Adding Member'
        });
        return this.http.post(environment.BACKEND_URL + 'addPerson', data, { responseType: 'json' }).pipe(
            catchError(err => {
                return throwError(() => new Error(err.message));
            })
        );
        // return new BehaviorSubject('success');
    }
}
