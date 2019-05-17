import { initialNavigationState, INavigationState } from './navigation.state';
import { NavigationActions, ENavigationAction } from './navigation.action';

export function navigationReducer(
    state = initialNavigationState,
    action: NavigationActions
): INavigationState {
    switch (action.type) {
        case ENavigationAction.SetPreviousUrl: {
            return {
                ...state,
                previousUrl: action.payload
            }
        }
        default:
            return state;
    }
}