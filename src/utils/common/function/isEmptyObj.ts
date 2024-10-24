export function isEmptyObj(obj) {
    if (obj.constructor === Object
        && Object.keys(obj).length === 0) {
        return false;
    }

    return true;
}


export function objToArr(strObj) {
    let strArr = [];
    for (let objKey in strObj) {
        if (strObj.hasOwnProperty(objKey)) {
            strArr.push(parseFloat(objKey));
        }
    }

    return strArr;
}

export function objToArrValue(strObj){

    let strArr = [];

    for (let objKey in strObj) {
        if(strObj.hasOwnProperty(objKey)) {
            strArr.push(strObj[objKey]);
        }
    }

    return strArr;
}

export function arrToObj(strArr:any){

    let strObj = {};

    strArr.map(value => {
        strObj[value.key] = value
    })

    return strObj;
}

export function getLastTime(strObj) {
    let strArr = 0;

    for (let objKey in strObj) {

        if (strArr < strObj[objKey].lastTime)
            strArr = strObj[objKey].lastTime
    }

    return strArr;
}