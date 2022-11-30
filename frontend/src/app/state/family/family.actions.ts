import { createAction, props } from '@ngrx/store';
import { person } from 'src/app/models/person.model';

export const addPerson = createAction(
    '[ Details ] add Person',
    props<{ person: person }>()
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
