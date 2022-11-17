import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { form } from '../models/form.model';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

    constructor() { }

    imgURL1?: string;
    imgURL2?: string;

    formData: form = {
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

    ngOnInit(): void {
    }


    onFileUploadChange(event: any, person: number) {
        this.fileError = false;
        const file: File = event.target.files[0];

        if (file.type && !file.type.startsWith('image/')) {
            console.log('not supported file type');
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
        if (!this.fileName1 || !this.fileName2) {
            this.fileError = true;
        }
        else if (this.fileName1 === this.fileName2) {
            console.log('files cannot be same');

        }
        else if (!form.valid) {
            console.log('form not valid');
        }
        else {
            console.log(form, this.formData);
        }
    }

}
