export default (text:string, copied:boolean) => {
    navigator.clipboard.writeText(text);
    
    copied = true;

    setTimeout(() => {
        copied = false;
    }, 2000);
};
