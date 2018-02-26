import qualified Data.Set as Set

data Op = Add Int | Sub Int | Mul Int | Div Int deriving (Eq, Show, Ord)

apply :: Op -> Int -> Int
apply op state = case op of
            Add v -> state + v
            Sub v -> state - v
            Mul v -> state * v
            Div v -> state `quot` v

isApplicable :: Op -> Int -> Bool            
isApplicable op state = case op of
            Add v -> True
            Sub v -> state >= v
            Mul v -> True
            Div v -> state `mod` v == 0

data Path = Path {history :: [Op], endState :: Int} deriving (Eq, Ord)

instance Show Path where
    show (Path history endSate) = show (reverse history) 

extend :: Path -> Op -> Path
extend path op = Path { history = op : history path, endState = apply op (endState path)}  

ops = [Add, Sub, Mul, Div]

getMoves :: [Int] -> [Op]
getMoves numSeq = [op v | v <- numSeq, op <- ops]

initialState = 0

initialPath = Path {history=[], endState=initialState}

from :: [Int] -> Set.Set(Path) -> Set.Set(Int) -> [Set.Set(Path)]
from numSeq pathset visited = if null pathset then [] else
            let more = Set.fromList(do 
                path <- (Set.elems pathset)
                let moves = getMoves numSeq
                let validMoves = filter (\m -> isApplicable m (endState path) ) moves
                let next = map (extend path) validMoves
                filter (\p -> Set.notMember (endState p) visited ) next)
            in more : from numSeq more (Set.union visited (Set.map endState more) )    

countdown :: [Int] -> Int -> Path
countdown numSeq target = 
    let pathsets = Set.singleton initialPath : from numSeq (Set.singleton initialPath) (Set.singleton initialState)
    in  head [path | pathset <- pathsets, path <- Set.elems pathset, endState path == target]