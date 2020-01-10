export function changeCamelToDash(str: string) {
    str = str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    if(str.startsWith('-')) {
        str = str.substring(1, str.length);
    }
    return str;
}