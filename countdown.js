function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array;
}

const concat = (x, y) =>
    x.concat(y)

const flatMap = (f, xs) =>
    xs.map(f).reduce(concat, [])

function print(x) {
    console.log(x + '');
}

function Add(v) {
    this.v = v;
    this.apply = a => a + v;
    this.isApplicable = a => true;
    this.toString = () => 'add ' + v;
}
function Sub(v) {
    this.v = v;
    this.apply = a => a - v;
    this.isApplicable = a => a >= v;
    this.toString = () => 'sub ' + v;
}
function Mul(v) {
    this.v = v;
    this.apply = a => a * v;
    this.isApplicable = a => true;
    this.toString = () => 'mul ' + v;
}
function Div(v) {
    this.v = v;
    this.apply = a => a / v;
    this.isApplicable = a => a % v === 0;
    this.toString = () => 'div ' + v;
}

function getMoves(numSeq) {
    const ops = [Add, Sub, Mul, Div];
    return flatMap(n => ops.map(op => new op(n)), numSeq);
}

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

        const validMoves = shuffle(getMoves(numSeq)
            .filter(move => move.isApplicable(val)));

        validMoves.forEach(move => {
            countdownAux(move.apply(val), opSeq.concat([move]));
        });

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

function shiftSet(set) {
    const firstValue = set.values().next().value;
    set.delete(firstValue);
    return firstValue;
}

function breadthFirstCountdown(numSeq, target) {

    function getPath(lastActions, val) {
        const path = [];
        let lastAction;
        while (true) {
            lastAction = lastActions.get(val);
            if (!lastAction)
                break;
            path.push(lastAction.move);
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
                visitedBranches: visitedVals.size
            };
        }

        let nextStateParams = [];

        for (let move of getMoves(numSeq))
            if (move.isApplicable(val))
                nextStateParams.push({ val, move, res: move.apply(val) });

        nextStateParams = nextStateParams.filter(nsp => !visitedVals.has(nsp.res) && !toVisitVals.has(nsp.res));

        nextStateParams.forEach(nsp => {
            lastActions.set(nsp.res, nsp);
            toVisitVals.add(nsp.res);
        });
    }
}

function streamCountdown(numSeq, target) {

    const initialState = 0;
    const visitedStates = new Set([initialState]);

    const moves = getMoves(numSeq)

    function Path(history, endState) {
        this.endState = endState;
        this.extend = function (op) {
            return new Path([op].concat(history), op.apply(endState))
        }
        this.toString = function () {
            return history.reverse().join(",");
        }
    }

    const initialPath = new Path([], initialState);

    function* from(paths) {
        if (!paths.size)
            return [];
        yield paths;

        const more = new Set();
        for (let path of paths) {
            let validMoves = moves.filter(m => m.isApplicable(path.endState));
            let nextPaths = validMoves.map(m => path.extend(m));
            for (let next of nextPaths) {
                if (!visitedStates.has(next.endState))
                    more.add(next);
            }
        }
        more.forEach(s => visitedStates.add(s.endState));
        yield* from(more);
    }

    function* solutions(target) {
        const pathSets = from(new Set([initialPath]));
        for (pathSet of pathSets)
            for (path of pathSet)
                if (path.endState === target)
                    yield path;
    }

    return {
        sol: solutions(target).next().value,
        visitedBranches: visitedStates.size
    };

}

const numSeq = [1,  2, 3, 17];
const target = 3657;
const { sol: bfSol, visitedBranches: bfVisited } = breadthFirstCountdown(numSeq, target);
print(bfSol);
print(bfVisited);

const { sol: sSol, visitedBranches: sVisited } = streamCountdown(numSeq, target);
print(sSol);
print(sVisited);

// const { sol: dfSol, visitedBranches: dfVisited } = depthFirstCountdown(numSeq, target);
// print(dfSol);
// print(dfVisited);
