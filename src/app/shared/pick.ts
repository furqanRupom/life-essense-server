const pick = <T extends Record<string, unknown>, K extends keyof T>(objs: T, keys: K[]) => {
    const finalOb: Partial<T> = {}
    for (const key of keys) {
        if (objs && Object.hasOwnProperty.call(objs, key)) {
            finalOb[key] = objs[key]
        }
    }
    return finalOb;
}

export default pick;