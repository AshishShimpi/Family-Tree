import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { person } from '../models/person.model';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface TreeNode {
    name: string,
    id: string,
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
    treeControl = new NestedTreeControl<TreeNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<TreeNode>();


    constructor() {
    }
    disableToggle: boolean = false;
    selectedPerson: string = '';
    dummyTreeData: person[] = [
        {
            accountId: 123,
            id: '0A',
            level: 1,
            parent: null,
            name: 'Great grandpa',
        }, {
            accountId: 123,
            id: '1A',
            level: 2,
            parent: '0A',
            name: 'Daughter 1',
        }, {
            accountId: 123,
            id: '2A',
            level: 2,
            parent: '0A',
            name: 'Son 1',
        }, {
            accountId: 123,
            id: '3A',
            level: 3,
            parent: '2A',
            name: 'Daughter 11',
        }, {
            accountId: 123,
            id: '4A',
            level: 3,
            parent: '1A',
            name: 'Son 11',
        },
    ]

    treeData: TreeNode[] = [];

    ngOnInit(): void {
        setTimeout(() => {
            this.prepareTree();
        }, 200);

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
        // console.log(this.treeData[parentI]);
        // console.log('main clicking');

        this.dataSource.data = [this.treeData[parentI]];
        this.treeControl.expansionModel.setSelection(this.treeData[parentI]);
        this.track(this.treeData[parentI]);
    }


    track(data?: any) {

        // console.log('clicked', typeof (data), data);
        console.log(this.treeControl);
        
        this.selectedPerson = data?.id;
        let parentI = this.dummyTreeData.findIndex((person) => {
            return data.id === person.id;
        });
        this.details.emit(this.dummyTreeData[parentI]);
    }
    trackTree(index: number, item: any) {
        return item.name;
    }

}
