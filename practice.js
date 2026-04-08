console.log("1 - start");
console.log("2 - middle");
console.log("3 - end");
// returns in order of 1, 2, 3

console.log ("Start");

setTimeout(() => { 
    console.log("Middle - this is delayed by 2 seconds");
}, 2000);

console.log("End");
// returns in order of Start, End, Middle - because the middle is delayed by 2 seconds

console.log("A");

setTimeout(() => console.log("B"), 0);

console.log("C");

setTimeout(() => console.log("D"), 100);

console.log("E");

// prints in order of A, C, E, B, D