export interface IAuthState {
    authenticated: boolean;
    username: string;
    failed: boolean,
    reason: string,
    loading: boolean,
}

export const initialAuthState: IAuthState = {
    failed: false,
    loading: true,
    reason: '',
    authenticated: false,
    username: ''
}
