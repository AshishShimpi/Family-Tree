import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { person } from '../models/person.model';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Store } from '@ngrx/store';
import { selectAllPersons } from '../state/family/family.selectors';
import { AppState } from '../state/app.state';
import { loadFamily } from '../state/family/family.actions';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface TreeNode {
    name: string,
    id: string | null,
    parent: string | null,
    children: TreeNode[],

}

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

    @Output() details = new EventEmitter<person>(true);
    treeControl: NestedTreeControl<TreeNode>;
    dataSource: MatTreeNestedDataSource<TreeNode>;


    constructor(private store: Store<AppState>) {
        this.treeControl = new NestedTreeControl<TreeNode>(node => node.children);
        this.dataSource = new MatTreeNestedDataSource<TreeNode>();
    }


    disableToggle: boolean = false;
    selectedPerson: string = '';
    
    familyData: person[] = [];
    
    treeData: TreeNode[] = [];
    
    pdfTree: any[] = [];
    ngOnInit(): void {
        this.getFamilyTree();

        this.store.dispatch(loadFamily({ id: localStorage.getItem('account_id') }));
    }

    hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

    getFamilyTree() {
        this.store.select(selectAllPersons).subscribe({
            next: (res) => {
                if (res.length) {
                    this.familyData = [...res];

                    this.prepareTree();
                    setTimeout(() => {
                        this.expandTree();
                    }, 100);
                }

            },
            error: (err) => {
                console.log('Error in tree comp-getAllData\n', err);
            }
        })
    }

    prepareTree() {

        this.familyData.sort((a, b) => b.level - a.level);
        this.treeData = [];
        this.treeData = this.familyData.map((personFromQuery) => {

            return {
                name: personFromQuery.name,
                parent: personFromQuery.parent,
                id: personFromQuery.id,
                children: []
            }
        });

        this.renderTreeData();
    }

    renderTreeData() {

        this.treeData.forEach((personFromQuery, index) => {

            let parentIndex = -1;
            for (let i = index + 1; i < this.treeData.length; i++) {
                if (this.treeData[i].id === personFromQuery.parent) {
                    parentIndex = i;
                    break;
                }
            }
            if (parentIndex !== -1)
                this.treeData[parentIndex].children.push(personFromQuery);
        });

        for (let i = this.treeData.length - 1; i >= 0; i--) {
            if (this.treeData[i].parent === 'null') {
                this.dataSource.data = [this.treeData[i]];
                this.track(this.treeData[i]);
            }
        }

        // this.treeControl.expansionModel.setSelection(...this.treeData);
    }


    track(data?: any) {
        if (data) {
            this.selectedPerson = data?.id;
            let parentI = this.familyData.findIndex((person) => {
                return data.id === person.id;
            });
            // deep clone to change object reference as angular won't allow same object as input in component
            let newObj: any = {};
            for (let [key, value] of Object.entries(this.familyData[parentI])) {
                newObj[key] = value;
            }
            // this.details.emit(Object.assign({}, this.familyData[parentI]));
            this.details.emit(newObj);
        }
    }

    expandTree() {
        Promise.resolve(null).then(() => {
            const ele = document.querySelector(".mat-tree-node.selected button") as HTMLElement | null;
            ele?.click();
        });
    }

    // PDF Generation Logic
    generateTree() {
        let queue = [];
        queue.push(this.treeData[this.treeData.length - 1]);

        while (queue.length !== 0) {

            let child = [];
            let temp: any = queue.shift();
            let memberData = this.familyData.find((element: any) => {
                return element.id === temp.id;
            });
            console.log(memberData);

            if (temp.children.length !== 0) {

                for (let i = 0; i < temp.children.length; i++) {
                    child.push(temp.children[i].name);
                    queue.push(temp.children[i]);
                }

            }
            this.pdfTree.push({ ...memberData, children: child });
        }
        console.log(this.pdfTree);
        this.GeneratePdf();
    }

    async GeneratePdf() {

        var contents = [];
        var allImages: any = {};
        var count: number = 0;

        for (let member of this.pdfTree) {
            contents.push({
                text: member.name + ' :',
                style: 'master'
            });
            contents.push({
                text: 'Spouse   -  ' + member.spouse,
                style: 'slave'
            });
            contents.push({
                text: 'Location -  ' + member.location,
                style: 'slave'
            });
            contents.push({
                text: 'DOB         -  ' + member.dob,
                style: 'slave'
            });
            contents.push({
                text: 'Address  -  ' + member.address,
                style: 'slave'
            });

            count++;
            allImages['i' + count] = member.image1 + '?h=200&fit=clip';

            count++;
            allImages['i' + count] = member.image2 + '?h=200&fit=clip';

            contents.push({
                columns: [
                    {
                        image: 'i' + (count-1),
                        width: 100,
                        height: 100,
                        margin: [10, 5, 0, 5]
                    },
                    {
                        image: 'i' + count,
                        width: 100,
                        height: 100,
                        margin: [40, 5, 0, 5]
                    },
                ]
            })

            if (member.children.length > 0) {
                let list: any = {
                    ol: []
                }
                contents.push({
                    text: 'Children :',
                    bold: true,
                    margin: [8, 5, 0, 5]
                });
                member.children.forEach((e: any) => {
                    list.ol.push({
                        text: e,
                        margin: [35, 0, 0, 5]
                    });
                });
                contents.push(list);
            }
            contents.push({
                text: '_______________________________________________________________________________________',
                color: 'black',
                alignment: 'left',
                margin: [0, 5, 0, 5]
            });
        }
        console.log(contents);

        let docDefinition: any = {
            info: {
                title: 'My-Family-Tree',
                author: 'Ashish Shimpi',
                subject:'Assignment Family Tree ',
                keywords:'tree,assignment'
              },
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pageMargins: [40, 40, 40, 40],

            content: [
                {
                    text: 'Family Tree',
                    fontSize: 22,
                    alignment: 'center',
                    color: 'green',
                    margin: [0, 0, 0, 20]
                },
                ...contents

            ],
            styles: {
                master: {
                    fontSize: 16,
                    bold: true,
                    // color: 'chocolate',
                    italics: true,
                    margin: [0, 0, 0, 5]
                },
                slave: {
                    fontSize: 12,
                    // bold: true,
                    // color: 'coral',
                    lineHeight: 1.3,
                    margin: [25, 0, 0, 0]
                }
            },
            images: {
                ...allImages
            },
            columnGap: 10
        };
        pdfMake.createPdf(docDefinition).open();
    }


}
