const memory = new Map();


export const setKey = (key, value, ttlSeconds) => {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    memory.set(key, { value, expiresAt });
}

export const getKey = (key) => {
    const obj = memory.get(key);
    if(!obj)
    return null;

    if(Date.now() > obj.expiresAt)
    {
        memory.delete(key);
        return null;
    }
    return obj.value;
}

export const delKey = (key) => {
    memory.delete(key);
}

export const keys = (pattern) => {
    const parts = pattern.split("*");
    const res = [];

    for(const k of memory.keys()) {
        if(k.startsWith(parts[0]))
        res.push(k);
    }
    return res;
}