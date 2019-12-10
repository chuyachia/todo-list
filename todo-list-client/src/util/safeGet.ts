export default (path: string[], object: any, defaultValue: any) => {
    const rtn = path.reduce((acc, cur) => acc && acc[cur] ? acc[cur] : undefined, object);

    return rtn === undefined ? defaultValue : rtn;
}