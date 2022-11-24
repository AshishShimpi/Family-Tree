import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class TreeComponent implements OnInit, AfterViewInit {

    @Output() details = new EventEmitter<person>(true);
    treeControl: NestedTreeControl<TreeNode>;
    dataSource: MatTreeNestedDataSource<TreeNode>;

    @Input()
    set inputPersonData(data: person) {

        if (data) {
            this._inputPersonData = data;
            this.dummyTreeData.push(this._inputPersonData);
            this.prepareTree();
            this.expandTree();
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
    dummyTreeData: person[] = [];
    // dummyTreeData: person[] = [
    //     {
    //         accountId: 123,
    //         id: '0A',
    //         level: 1,
    //         parent: null,
    //         name: 'Great grandpa',
    //         spouse: 'Great grandMa',
    //         location: 'india',
    //         dob: '',
    //         address: 'maharashtra',
    //         image1: undefined,
    //         image2: undefined
    //     }, {
    //         accountId: 123,
    //         id: '1A',
    //         level: 2,
    //         parent: '0A',
    //         name: 'Daughter 1',
    //         spouse: 'dau in law',
    //         location: 'daughter country',
    //         dob: '',
    //         address: 'daughter city',
    //         image1: undefined,
    //         image2: undefined
    //     }, {
    //         accountId: 123,
    //         id: '2A',
    //         level: 2,
    //         parent: '0A',
    //         name: 'Son 1',
    //         spouse: 'son in law',
    //         location: 'son country',
    //         dob: '',
    //         address: 'son city',
    //         image1: undefined,
    //         image2: undefined
    //     }, {
    //         accountId: 123,
    //         id: '3A',
    //         level: 3,
    //         parent: '2A',
    //         name: 'Daughter 11',
    //         spouse: '11 dau in law',
    //         location: '11 daughter country',
    //         dob: '',
    //         address: '11 daughter city',
    //         image1: undefined,
    //         image2: undefined
    //     }, {
    //         accountId: 123,
    //         id: '4A',
    //         level: 3,
    //         parent: '1A',
    //         name: 'Son 11',
    //         spouse: '11 son in law',
    //         location: '11 son country',
    //         dob: '',
    //         address: '11 son city',
    //         image1: undefined,
    //         image2: undefined
    //     },
    // ]

    treeData: TreeNode[] = [];

    ngOnInit(): void {
        if (this.dummyTreeData) {
            this.prepareTree();
        }
    }

    ngAfterViewInit() {
        this.expandTree();
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
            if (this.treeData[i].parent === null) {
                this.dataSource.data = [this.treeData[i]];
                this.track(this.treeData[i]);
            }
        }

        // this.treeControl.expansionModel.setSelection(...this.treeData);
    }


    track(data?: any) {

        this.selectedPerson = data?.id;
        let parentI = this.dummyTreeData.findIndex((person) => {
            return data.id === person.id;
        });
        // deep clone to change object reference as angular won't allow same object as input in component
        this.details.emit(Object.assign({},this.dummyTreeData[parentI]));
    }

    expandTree() {
        Promise.resolve(null).then(() => {
            const ele = document.querySelector(".mat-tree-node.selected button") as HTMLElement | null;
            ele?.click();
        });
    }

}
