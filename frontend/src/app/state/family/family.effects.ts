
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import * as allPersonActions from "./family.actions"
import { BackendService } from "../../../app/services/backend.service";
import { Store } from "@ngrx/store";
import { AppState } from "../app.state";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../../app/dialog/dialog.component";

@Injectable()
export class FamilyEffects {
    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private backendService: BackendService,
        public dialog: MatDialog,
    ) {
    }

    loadFamily$ = createEffect(() => this.actions$.pipe(
        ofType(allPersonActions.loadFamily),
        switchMap(action =>
            this.backendService.getFamilyData(action.id).pipe(
                tap({
                    next: () => {
                        this.backendService.loader.next({
                            showLoader: false,
                            message: 'Successfully fetched data'
                        });
                    },
                    error: () => {
                        console.error('error in fetch');

                        this.backendService.loader.next({
                            showLoader: true, message: 'Please try again later'
                        });
                        this.dialog.open(DialogComponent, {
                            width: '400px',
                            data: { custom: 'Failed to load data. Please try again later.' }
                        });
                    }
                }),
                map((data: any) => allPersonActions.loadFamilySucess({ person: data })),
                catchError((error) => {
                    return of(allPersonActions.loadFamilyFailure({ error: error }));
                })
            )
        )
    ));

    // savePerson$ = createEffect(() => this.actions$.pipe(
    //     ofType(allPersonActions.addPerson),
    //     switchMap(action =>
    //         this.backendService.savePersonData(action.person).pipe(
    //             map(() => allPersonActions.addPersonSuccess({ person: action.person })),
    //             catchError((error) => {
    //                 return of(allPersonActions.addPersonFailure({ error: error }));
    //             })
    //         )
    //     )
    // ));
}