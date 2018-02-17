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

function depthFirstCountdown(numSeq, target, maxDepth = 15) {

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
                    nextStateParams.push({ v, op });
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

function shiftSet(s) {
    let el;
    for (let v of s) {
        el = v;
        break;
    }
    s.delete(el);
    return el;
}

function breadthFirstCountdown(numSeq, target, maxDepth = 35) {

    function getPath(lastActions, val) {
        const path = [];
        let lastAction;
        while (true) {
            lastAction = lastActions.get(val);
            if (!lastAction)
                break;
            path.push(lastAction);
            val = lastAction.val;
        }
        return path.reverse();
    }
    const toVisitVals = new Set();
    const visitedVals = new Set();
    const lastActions = new Map();
    const start = 0;
    lastActions.set(start, null);
    toVisitVals.add(start);
    while (toVisitVals.size) {
        let val = shiftSet(toVisitVals);
        visitedVals.add(val);
        if (val === target) {
            return {
                sol: getPath(lastActions, target),
                visitedBranches: visitedVals.size};
        }
        
        let nextStateParams = [];    
        for (let v of numSeq)
            for (let op of ops) {
                if (op.isApplicable(val, v))
                    nextStateParams.push({ val, v, op, res: op.apply(val, v)});
            }
        nextStateParams = shuffle(nextStateParams);

        nextStateParams.forEach(nsp => {
            if (visitedVals.has(nsp.res) || toVisitVals.has(nsp.res))
                return;
            
            lastActions.set(nsp.res, nsp);
            toVisitVals.add(nsp.res);
        });
    }
}

const numSeq = [1, 2, 6];
const target = 5649;
const { sol, visitedBranches } = breadthFirstCountdown(numSeq, target);
const resStr = sol && sol.map(r => r.op + ' ' + r.v).join(' - ');
console.log(resStr);
console.log(visitedBranches);