export default (func: any, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;

    return function (...args: any[]) {
        if (timeout !== undefined) clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(null, args), delay);
    }
}