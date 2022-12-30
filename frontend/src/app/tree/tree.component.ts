import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { person } from '../models/person.model';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Store } from '@ngrx/store';
import { selectAllPersons } from '../state/family/family.selectors';
import { AppState } from '../state/app.state';
import { loadFamily } from '../state/family/family.actions';

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

}
