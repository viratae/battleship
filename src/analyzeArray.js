function analyzeArray(array) {
    let object = {
        average: 0,
        min: 0,
        max: 0,
        length: 0
    }
    object.average = average(array);
    object.min = min(array);
    object.max = max(array);
    object.length = array.length;
    return object
}
function average(array) {
    const total = array.reduce((total, num) => {
        return total + num;
    },0);
    return total / array.length;
}
function min(array) {
    let min = array[0];
    for(const num of array) {
        if(min > num) {
            min = num;
        }
    }
    return min;
}
function max(array) {
    let max = array[0];
    for(const num of array) {
        if(max < num) {
            max = num;
        }
    }
    return max;
}
export {
    analyzeArray
}