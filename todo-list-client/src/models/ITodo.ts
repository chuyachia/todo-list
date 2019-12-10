import IUser from './IUser';

type TTodoLinks = 'self' | 'inProgress' | 'wontDo' | 'done' | 'edit';

export default interface ITodoItem {
    id: string;
    title: string;
    status: string;
    priority: string;
    description: string;
    user: IUser;
    _links: Record<TTodoLinks, Record<'href' | 'title', string>>;
}