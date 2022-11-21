import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { person } from '../models/person.model';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

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

    @Output() details = new EventEmitter();
    treeControl: NestedTreeControl<TreeNode>;
    dataSource: MatTreeNestedDataSource<TreeNode>;

    @Input()
    set inputPersonData(data: any) {
        if (data && data.person) {
            this._inputPersonData = data.person;
            this.dummyTreeData.push(...this._inputPersonData);
            console.log(this._inputPersonData);
            this.prepareTree();
        }
    }
    get inputPersonData() {
        return this._inputPersonData;
    }

    constructor() {
        this.treeControl = new NestedTreeControl<TreeNode>(node => node.children);
        this.dataSource = new MatTreeNestedDataSource<TreeNode>();
    }

    private _inputPersonData: any;
    disableToggle: boolean = false;
    selectedPerson: string = '';
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

    treeData: TreeNode[] = [];

    ngOnInit(): void {

        this.prepareTree();
    }

    hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;


    prepareTree() {

        this.dummyTreeData.sort((a, b) => b.level - a.level);
        this.treeData = [];
        this.treeData = this.dummyTreeData.map((personFromQuery) => {

            return {
                name: personFromQuery.name,
                parent: personFromQuery.parent,
                id: personFromQuery.id,
                children: []
            }
        });
        // console.log(this.dummyTreeData);

        this.renderTreeData();
    }

    renderTreeData() {
        this.treeData.forEach((personFromQuery) => {

            let parentIndex = this.treeData.findIndex((person) => {
                return person.id === personFromQuery.parent;
            });

            if (parentIndex !== -1)
                this.treeData[parentIndex].children.push(personFromQuery);
        });

        let parentI = this.treeData.findIndex((person) => {
            return person.parent === null;
        });

        this.dataSource.data = [this.treeData[parentI]];
        
            this.treeControl.expansionModel.setSelection(...this.treeData);
        this.track(this.treeData[parentI]);
    }


    track(data?: any) {

        console.log(this.treeControl);

        this.selectedPerson = data?.id;
        let parentI = this.dummyTreeData.findIndex((person) => {
            return data.id === person.id;
        });

        this.details.emit(this.dummyTreeData[parentI]);
    }

}
