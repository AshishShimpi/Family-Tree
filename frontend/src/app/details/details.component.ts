import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { person } from '../models/person.model';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
    
    @ViewChild('f') form!:NgForm;

    constructor() { }

    private _details:any;

    imgURL1?: string;
    imgURL2?: string;
    disableAddButton: boolean = true;
    disableFields:boolean = true;
    formData : person = {
        accountId : -1,
        id : '',
        level : -1,
        parent : null,
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
    @Output() newPersonData = new EventEmitter<person>();
    @Input() 
    set details(details:person){
        if(typeof(details) !== 'string'){
        this._details = details;
        // console.log(details);
        this.disableFields = true;
        this.disableAddButton = true;
        this.setDataFromTree();
        }
    }

    get details():any{ return this._details;}

    ngOnInit(): void {
    }

    setDataFromTree(){
        this.formData.name = this._details.name;
        this.formData.spouse = this._details.spouse;
        this.formData.location = this._details.location;
        this.formData.dob = this._details.dob;
        this.formData.address = this._details.address;
        this.formData.image1 = this._details.image1;
        this.formData.image2 = this._details.image2;
    }

    setDataFromNewPerson(){
        this.formData.accountId = this._details.accountId;
        this.formData.id = this._details.id + 'A';
        this.formData.level = this._details.level + 1;
        this.formData.parent = this._details.id;
        
        const data = JSON.parse(JSON.stringify(this.formData));
        console.log(data.parent);
        console.log(data);
        this.sendNewPersonData(data);
    }

    onFileUploadChange(event: any, person: number) {
        this.fileError = false;
        const file: File = event.target.files[0];

        if (file.type && !file.type.startsWith('image/')) {
            // console.log('not supported file type');
            if (person === 1) {
                [this.fileName1, this.formData.image1] = [undefined, undefined];
                this.imgURL1 = undefined;

            } else {
                [this.fileName2, this.formData.image2] = [undefined, undefined];
                this.imgURL2 = undefined;
            }

        } else if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {

                if (person === 1) {
                    this.fileName1 = file.name;
                    this.formData.image1 = file;
                    this.imgURL1 = event.target?.result?.toString();
                    
                } else {
                    this.fileName2 = file.name;
                    this.formData.image2 = file;
                    this.imgURL2 = event.target?.result?.toString();
                    
                }
            });
            reader.readAsDataURL(file);
        }

    }


    onSubmit(form: NgForm) {
        // if (!this.fileName1 || !this.fileName2) {
        //     this.fileError = true;
        // }
        // else if (this.fileName1 === this.fileName2) {
        //     console.log('files cannot be same');

        // }
        // else 
        if (!form.valid) {
            console.log('form not valid',form);
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

    resetForm(){
        this.form.reset();
        console.log(this.form);
        
        this.disableAddButton = false;
        this.disableFields = false;
    }

    sendNewPersonData(data:any){
        console.log('emitting');
        
        this.newPersonData.emit(data);
        this.form.reset();
        // this.setDataFromTree();   
    }
}
