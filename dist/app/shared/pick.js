"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = (objs, keys) => {
    const finalOb = {};
    for (const key of keys) {
        if (objs && Object.hasOwnProperty.call(objs, key)) {
            finalOb[key] = objs[key];
        }
    }
    return finalOb;
};
exports.default = pick;
