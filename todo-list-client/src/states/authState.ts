export interface IAuthState {
    authenticated: boolean;
    username: string;
    failed: boolean,
    reason: string,
    loading: boolean,
}

export const initialAuthState: IAuthState = {
    failed: false,
    loading: false,
    reason: "",
    authenticated: false,
    username: ""
}
