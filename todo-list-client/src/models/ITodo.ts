type TTodoLinks = 'self' | 'inProgress' | 'wontDo' | 'done';

export default interface ITodoItem {
    id: string;
    title: string;
    status: string;
    priority: string;
    description: string;
    _links: Record<TTodoLinks, Record<'href' | 'title', string>>;
}