
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import * as allPersonActions from "./family.actions"
import { BackendService } from "src/app/services/backend.service";
import { Store } from "@ngrx/store";
import { AppState } from "../app.state";

@Injectable()
export class FamilyEffects {
    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private backendService: BackendService,
    ) {
    }

    loadFamily$ = createEffect(() => this.actions$.pipe(
        ofType(allPersonActions.loadFamily),
        switchMap(() =>
            this.backendService.getFamilyData().pipe(
                // tap(data => console.log('piping async',data)),
                map((data) => allPersonActions.loadFamilySucess({ person: data })),
                catchError((error) => {
                    return of(allPersonActions.loadFamilyFailure({ error: error }));
                })
            )
        )
    ));

    savePerson$ = createEffect(() => this.actions$.pipe(
        ofType(allPersonActions.addPerson),
        switchMap(action =>
            this.backendService.savePersonData(action.person).pipe(
                map(() => allPersonActions.addPersonSucess({ person: action.person })),
                catchError((error) => {
                    return of(allPersonActions.addPersonFailure({ error: error }));
                })
            )
        )
    ));
}