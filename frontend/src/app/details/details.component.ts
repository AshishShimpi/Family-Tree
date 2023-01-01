import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { person } from '../models/person.model';
import { faker } from '@faker-js/faker';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Store } from '@ngrx/store';
import { addPerson, addPersonSuccess, addPersonFailure } from '../state/family/family.actions';
import { AppState } from '../state/app.state';
import { BackendService } from '../services/backend.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {


    @ViewChild('f') form!: NgForm;

    constructor(
        public dialog: MatDialog,
        private store: Store<AppState>,
        private backendService: BackendService,
    ) { }

    private _details: any = {};
    loader: boolean = false;
    imgURL1?: string;
    imgURL2?: string;
    disableAddButton: boolean = true;
    disableFields: boolean = true;
    formData: person = {
        accountId: null,
        id: '',
        level: -1,
        parent: null,
        name: 'asdfds',
        spouse: '',
        location: '',
        dob: '',
        address: '',
        image1: undefined,
        image2: undefined
    };
    fileError: boolean = false;
    fileName1?: string;
    fileName2?: string;

    @Input()
    set details(details: person) {

        if (details) {
            this._details = details;
            this.disableFields = true;
            this.disableAddButton = true;
            this.setDataFromTree();
        }

    }

    get details() {
        return this._details;
    }

    ngOnInit(): void {
    }

    setDataFromTree() {

        this.formData.accountId = this._details.account_id;
        this.formData.name = this._details.name;
        this.formData.spouse = this._details.spouse;
        this.formData.location = this._details.location;
        this.formData.dob = this._details.dob;
        this.formData.address = this._details.address;
        this.formData.image1 = this._details.image1;
        this.formData.image2 = this._details.image2;

        if (typeof (this._details.image1) !== 'string') {

            this.parseFile(this._details.image1).subscribe({
                next: (res) => this.imgURL1 = res,
                error: (err) => console.log('Error in reading file', err)
            });

            this.parseFile(this._details.image2).subscribe({
                next: (res) => this.imgURL2 = res,
                error: (err) => console.log('Error in reading file', err)
            });

        } else {

            this.imgURL1 = this._details.image1;
            this.imgURL2 = this._details.image2;
        }

    }

    onFileUploadChange(event: any, person: number) {
        this.fileError = false;
        const file: File = event.target.files[0];
        console.log(file);
        
        var allowedExtensions = /(\/jpg|\/jpeg|\/png)$/i;
        if (file && !allowedExtensions.exec(file.type)) {
            this.dialog.open(DialogComponent, {
                width: '400px',
                data: { custom: 'Only jpeg/png file allowed' }
            });
        }
        else if (file && file.type && !file.type.startsWith('image/')) {

            if (person === 1) {
                [this.fileName1, this.imgURL1, this.formData.image1] = [undefined, undefined, undefined];

            } else {
                [this.fileName2, this.imgURL2, this.formData.image2] = [undefined, undefined, undefined];

            }

        } else if (file) {

            if (person === 1) {
                this.fileName1 = 'file1';
                this.formData.image1 = file;
                this.parseFile(file).subscribe({
                    next: (res) => this.imgURL1 = res,
                    error: (err) => console.log('Error in reading file', err)
                })

            } else {
                this.fileName2 = 'file2';
                this.formData.image2 = file;
                this.parseFile(file).subscribe({
                    next: (res) => this.imgURL2 = res,
                    error: (err) => console.log('Error in reading file', err)
                })

            }
        }

    }


    onSubmit(form: NgForm) {

        if (!form.valid) {
            console.log('form not valid', form);
            this.dialog.open(DialogComponent, {
                width: '400px',
                data: { custom: 'Fields cannot be empty' }
            });
        }
        else if (!this.fileName1 || !this.fileName2) {
            this.fileError = true;
            this.dialog.open(DialogComponent, {
                width: '400px',
                data: { custom: 'Please upload file/s' }
            });
        }
        else if (this.fileName1 === this.fileName2) {
            console.log('files cannot be same');
            this.dialog.open(DialogComponent, {
                width: '400px',
                data: { custom: 'Files cannot be same' }
            });

        }
        else {
            this.imgURL1 = undefined;
            this.imgURL2 = undefined;
            this.fileName1 = undefined;
            this.fileName2 = undefined;
            this.disableAddButton = true;
            this.disableFields = true;
            this.setDataFromNewPerson();
        }
    }

    setDataFromNewPerson() {

        if (!this.formData.accountId)
            this.formData.accountId = localStorage.getItem('account_id');
        this.formData.id = uuidv4();
        this.formData.level = this._details.level !== undefined ? (this._details.level + 1) : 0;
        this.formData.parent = this._details.id ? this._details.id : 'null';
        this.formData.dob = new Date(this.formData.dob).toISOString();

        // deep clone to change object reference as shallow copy changes with original data mutation & angular won't allow same object as input in component
        // const data = Object.assign({}, this.formData);
        var newForm = new FormData();
        var newFormObj: any = {};
        for (let [key, value] of Object.entries(this.formData)) {
            newForm.append(key, value);
            newFormObj[key] = value;
        };

        this.sendNewPersonData(newForm, newFormObj);
    }

    sendNewPersonData(newForm: any, newFormObj: person) {
        this.form.resetForm();
        this._details = {};
        this.loader = true;
        this.store.dispatch(addPerson());

        this.backendService.savePersonData(newForm).subscribe({
            next: (res) => {

                this.store.dispatch(addPersonSuccess({ person: newFormObj }));
                this.dialog.open(DialogComponent, {
                    width: '400px',
                    data: { heading: 'Success', custom: ' Member added to family tree.' }
                });
                this.loader = false;
                console.log('data is sent', res);
            },
            error: (err) => {
                this.store.dispatch(addPersonFailure({ error: 'Failure to add Person' }));
                this.dialog.open(DialogComponent, {
                    width: '400px',
                    data: { heading: 'Error', custom: 'Unable To add Member. Please try again later' }
                });
                this.loader = false;
                console.log(err);
            }
        });
    }

    parseFile(file: File): Observable<any> {
        return new Observable((observer) => {
            const reader = new FileReader();

            reader.addEventListener('load', (event) => observer.next(event.target?.result?.toString()));
            reader.addEventListener('error', () => observer.error(reader.error));
            reader.readAsDataURL(file);
        });
    }

    resetForm() {
        this.form.reset();
        this.imgURL1 = undefined;
        this.imgURL2 = undefined;
        this.fileName1 = undefined;
        this.fileName2 = undefined;
        this.disableAddButton = false;
        this.disableFields = false;
    }
}
