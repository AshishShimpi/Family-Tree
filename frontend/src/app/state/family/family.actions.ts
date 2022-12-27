import { createAction, props } from '@ngrx/store';
import { person } from 'src/app/models/person.model';

export const addPerson = createAction(
    '[ Details ] adding Person',
    props<{ person: person }>());

export const addPersonSucess = createAction(
    '[ Details ] add Person Sucess',
    props<{ person: person }>()
);

export const addPersonFailure = createAction(
    '[ Details ] add person failure',
    props<{ error: string }>()
);

export const loadFamily = createAction('[ Tree ] load family');

export const loadFamilySucess = createAction(
    '[ Tree ] load family success',
    props<{ person: person[] }>()
);

export const loadFamilyFailure = createAction(
    '[ Tree ] load family failure',
    props<{ error: string }>()
);
