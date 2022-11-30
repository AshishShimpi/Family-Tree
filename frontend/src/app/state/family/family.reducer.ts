import { Action, createReducer, on } from "@ngrx/store";
import { person } from "src/app/models/person.model";
import * as allPersonActions from "./family.actions"


export interface familyState {
    person: person[];
    selectedPerson : person | null; 
    error: string | null;
    status: 'pending' | 'loading' | 'success' | 'error';
}

export const initialState: familyState = {
    person: [],
    selectedPerson: null,
    error: null,
    status: 'pending',
}

export const familyReducer = createReducer(
    initialState,

    on(allPersonActions.addPerson, (state, { person }) => ({
        ...state,
        person: [...state.person, person]
    })),

    on(allPersonActions.loadFamily, (state) => ({ ...state, status: 'loading', })),

    on(allPersonActions.loadFamilySucess, (state, { person }) => ({
        ...state,
        person: person,
        error: null,
        status: 'success',
    })),
    on(allPersonActions.loadFamilyFailure, (state, { error }) => ({
        ...state,
        error: error,
        status: 'error',
    }))
)
