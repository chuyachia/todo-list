import React, {useContext, useReducer, createContext, ReducerState, Dispatch, ReducerAction} from 'react';
import {IState, initialState} from './states';
import IAction from './actions/IAction';
import reducer from './reducers';

type TReducer = React.Reducer<IState, IAction>;

interface IStateProviderProps {
    children: React.ReactNode;
    state: IState;
    reducer: TReducer;
}

export const StateContext = createContext<[React.ReducerState<TReducer>, React.Dispatch<React.ReducerAction<TReducer>>]>([initialState, (value:IAction)=> {}]);

export const StateProvider: React.FC<IStateProviderProps> = ({children, state, reducer}) => (
    <StateContext.Provider value={useReducer(reducer, state)}>{children}</StateContext.Provider>);

export const useStateValue = () => useContext(StateContext);
