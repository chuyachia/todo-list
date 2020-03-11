const debounce =  (func: Function, wait:number, leading: boolean): Function => {
    let timeout:number;

    return function(this:Function) {
        const args = arguments;

        // Apply immediately
        if (!timeout && leading) {
            func.apply(this, args);
        }
        clearTimeout(timeout); // is this needed?
        // Apply later
        timeout = window.setTimeout(() => {
            timeout = 0;
            if (!leading) {
                func.apply(this, args);
            }
        }, wait);

    }
}

export default debounce;