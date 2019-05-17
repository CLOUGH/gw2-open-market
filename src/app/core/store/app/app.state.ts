import { INavigationState, initialNavigationState } from '../navigation/navigation.state';

export interface IAppState {
    navigation: INavigationState;
}

export const initialAppState: IAppState = {
    navigation: initialNavigationState
}

export function getIntialState(): IAppState {
    return initialAppState;
}