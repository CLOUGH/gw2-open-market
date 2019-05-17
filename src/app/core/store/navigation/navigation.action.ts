import { Action } from '@ngrx/store';

export enum ENavigationAction {
    SetPreviousUrl = '[Navigation] Set Previous Url',
}


export class SetPreviousUrl implements Action {
    public readonly type = ENavigationAction.SetPreviousUrl;
    constructor(public payload: string) {}
}

export type NavigationActions = SetPreviousUrl;