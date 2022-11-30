import { createSelector } from '@ngrx/store';
import { AppState } from "../app.state";
import { familyState } from './family.reducer';


export const selectFamily = (state: AppState) => state.family;

export const selectAllPersons = createSelector(
    selectFamily,
    (state: familyState) => state.person
);


export const currentPerson = createSelector(
    selectFamily,
    (state: familyState) => state.selectedPerson
);

