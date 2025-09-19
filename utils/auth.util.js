export const parseExpiryToSeconds = (exp) => {
    if(typeof exp !== "string")
    return 0;

    const num = parseInt(exp.slice(0, -1));
    const unit = exp.slice(-1);
    if(unit === 's')
    return num;
    if(unit === 'm')
    return num * 60;
    if(unit === 'h')
    return num * 3600;
    if(unit === 'd')
    return num * 86400;
    
    return 0;
}