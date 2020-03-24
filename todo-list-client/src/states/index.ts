import {IAuthState, initialAuthState} from './authState';
import {initialTodoState, ITodoState} from './todoState';

export interface IState {
    auth: IAuthState;
    todo: ITodoState;
}

export const initialState: IState = {
    auth: initialAuthState,
    todo: initialTodoState,
}