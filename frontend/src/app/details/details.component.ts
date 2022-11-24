import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { person } from '../models/person.model';
import { faker } from '@faker-js/faker';
import { Observable } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

    @Output() newPersonData = new EventEmitter<person>(true);
    @ViewChild('f') form!: NgForm;

    constructor(public dialog: MatDialog) { }

    private _details: any = {};

    imgURL1?: string;
    imgURL2?: string;
    disableAddButton: boolean = true;
    disableFields: boolean = true;
    formData: person = {
        accountId: null,
        id: '',
        level: -1,
        parent: null,
        name: '',
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

        this.formData.name = this._details.name;
        this.formData.spouse = this._details.spouse;
        this.formData.location = this._details.location;
        this.formData.dob = this._details.dob;
        this.formData.address = this._details.address;
        this.formData.image1 = this._details.image1;
        this.formData.image2 = this._details.image2;

        this.fileName1 = this._details.image1.name;
        this.fileName2 = this._details.image2.name;
        
        
        this.parseFile(this._details.image1).subscribe({
            next: (res) => this.imgURL1 = res,
            error: (err) => console.log('Error in reading file', err)
        });

        this.parseFile(this._details.image2).subscribe({
            next: (res) => this.imgURL2 = res,
            error: (err) => console.log('Error in reading file', err)
        });

    }

    onFileUploadChange(event: any, person: number) {
        this.fileError = false;
        const file: File = event.target.files[0];

        if (file && file.type && !file.type.startsWith('image/')) {
            if (person === 1) {
                [this.fileName1, this.imgURL1, this.formData.image1] = [undefined, undefined, undefined];

            } else {
                [this.fileName2, this.imgURL2, this.formData.image2] = [undefined, undefined, undefined];

            }

        } else if (file) {
            
            if (person === 1) {
                this.fileName1 = file.name;
                this.formData.image1 = file;
                this.parseFile(file).subscribe({
                    next: (res) => this.imgURL1 = res,
                    error: (err) => console.log('Error in reading file', err)
                })

            } else {
                this.fileName2 = file.name;
                this.formData.image2 = file;
                this.parseFile(file).subscribe({
                    next: (res) => this.imgURL2 = res,
                    error: (err) => console.log('Error in reading file', err)
                })

            }
        }

    }


    onSubmit(form: NgForm) {
        if (!this.fileName1 || !this.fileName2) {
            this.fileError = true;
            this.dialog.open(DialogComponent,{
                data: {message:'Please upload file/s'}
            });
        }
        else if (this.fileName1 === this.fileName2) {
            console.log('files cannot be same');
            this.dialog.open(DialogComponent,{
                data: {message:'Files cannot be same'}
            });

        }
        else if (!form.valid) {
            console.log('form not valid', form);
            this.dialog.open(DialogComponent,{
                data: {message:'Fields cannot be empty'}
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
        this.formData.accountId = this._details.accountId ? this._details.accountId : faker.finance.ethereumAddress();
        this.formData.id = faker.datatype.uuid();
        this.formData.level = this._details.level !== undefined ? (this._details.level + 1) : 0;
        this.formData.parent = this._details.id ? this._details.id : null;
        // deep clone to change object reference as shallow copy changes with original data mutation & angular won't allow same object as input in component
        const data = Object.assign({}, this.formData)
        
        this.sendNewPersonData(data);
    }

    sendNewPersonData(data: any) {
        this.form.resetForm();
        this._details = null;
        this.newPersonData.emit(data);

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
