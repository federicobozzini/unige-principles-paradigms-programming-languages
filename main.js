function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

const add = {
    apply: (a, b) => a + b,
    isApplicable: (a, b) => true,
    toString: () => 'sum'
}
const sub = {
    apply: (a, b) => a - b,
    isApplicable: (a, b) => a >= b,
    toString: () => 'sub'
}
const mul = {
    apply: (a, b) => a * b,
    isApplicable: (a, b) => true,
    toString: () => 'mul'
}
const div = {
    apply: (a, b) => a / b,
    isApplicable: (a, b) => a % b === 0,
    toString: () => 'div'
}
const ops = [add, sub, mul, div];

function depthFirstCountdown(numSeq, target, maxDepth = 35) {

    function countdownAux(val = 0, opSeq = []) {
        const depth = opSeq.length;
        if (visitedVals.has(val) && visitedVals.get(val) <= depth) {
            return;
        }
        if (minDepth && depth >= minDepth) {
            return;
        }
        if (depth >= maxDepth) {
            return;
        }
        visitedBranches++;
        visitedVals.set(val, depth);
        if (val === target) {
            minOpSeq = opSeq;
            minDepth = minOpSeq.length;
            return;
        }
        let nextStateParams = [];
        for (let v of numSeq)
            for (let op of ops) {
                if (op.isApplicable(val, v))
                    nextStateParams.push({v, op});
            }
        nextStateParams = shuffle(nextStateParams);
        for (let nsp of nextStateParams) 
            countdownAux(nsp.op.apply(val, nsp.v), opSeq.concat([nsp]));
        
    }

    const visitedVals = new Map();
    let minDepth, minOpSeq;
    let visitedBranches = 0;

    countdownAux();

    return {
        sol: minOpSeq,
        visitedBranches
    };
}

const {sol, visitedBranches} = depthFirstCountdown([1, 2, 6], 135);
const resStr = sol && sol.map(r => r.op + ' ' + r.v).join(' - ');
console.log(resStr);
console.log(visitedBranches);