import {
    analyzeArray
} from "../src/analyzeArray.js"
test("exists", () => {
    expect(analyzeArray([1])).not.toBeUndefined();
})
test("result of [4,2,-1,8]", () => {
    expect(analyzeArray([4,2,-1,8])).toEqual({
        average: 3.25,
        min: -1,
        max: 8,
        length:4
    });
})