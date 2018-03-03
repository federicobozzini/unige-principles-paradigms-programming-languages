import Data.List (find)
import Data.Maybe

-- User-defined types
type PFun a b = a -> Maybe b
type Table k v = [(k,v)]

makeTotal :: PFun a b -> b -> (a -> b)
makeTotal f def_b = \x -> let y = f x in case y of 
        Just b -> b 
        Nothing -> def_b

consFun :: Eq k => Table k v -> PFun k v
consFun ps = \x -> let res = find (\(k, v) -> k == x) ps in case res of
    Just (k, v) -> Just v
    Nothing -> Nothing

data BTree a = Empty | Node a (BTree a) (BTree a) deriving Show

frontier :: BTree a -> [a]
frontier Empty = []
frontier (Node a Empty Empty) = [a]
frontier (Node a left right) = (frontier left) ++ (frontier right)

inorder :: (a -> b -> a) -> a -> BTree b -> a
inorder f a Empty = a
inorder f a (Node b left right) = let leftAcc = inorder f a left in inorder f (f leftAcc b) right

inorder_list :: BTree a -> [a]
inorder_list t = inorder (\a b -> a++[b]) [] t 

sum_tree :: BTree Int -> Int
sum_tree t = inorder (+) 0 t

node_num :: BTree a -> Int
node_num t = inorder (\a b -> a+1) 0 t

-- Small interpreter
data Exp = ExpZero | ExpTrue | ExpFalse | ExpSucc Exp | ExpPred Exp | ExpIf Exp Exp Exp | ExpIsZero Exp deriving Show

isNum :: Exp -> Bool
isNum e = case e of 
    ExpZero -> True
    ExpSucc n -> isNum n
    _ -> False 

isVal :: Exp -> Bool
isVal e = case e of 
    ExpTrue -> True
    ExpFalse -> True
    e -> isNum e 

reduce :: Exp -> Maybe Exp
reduce ExpTrue = Nothing
reduce ExpFalse = Nothing
reduce ExpZero = Nothing
reduce (ExpSucc e) = case reduce e of 
    Just t -> Just (ExpSucc t)
    Nothing -> Nothing
reduce (ExpIsZero ExpZero) = Just ExpTrue
reduce (ExpIsZero (ExpSucc _) ) = Just ExpFalse
reduce (ExpIsZero e) = case reduce e of 
    Just t -> Just (ExpIsZero t)
    _ -> Nothing
reduce (ExpPred (ExpSucc e)) = Just e
reduce (ExpPred ExpZero) = Just ExpZero
reduce (ExpPred e) = case reduce e of 
    Just t -> Just (ExpPred t)
    _ -> Nothing
reduce (ExpIf ExpTrue t1 _) = Just t1
reduce (ExpIf ExpFalse _ t2) = Just t2
reduce (ExpIf t t1 t2) = case reduce t of 
    Just t' -> Just (ExpIf t' t1 t2)
    _ -> Nothing

reduceStar :: Exp -> Exp
reduceStar e = case reduce e of
    Just e' -> reduceStar e'
    _ -> e

bigstep :: Exp -> Maybe Exp
bigstep e | isVal e = Just e
bigstep (ExpSucc e) = case bigstep e of 
    Just t -> Just (ExpSucc t)
    _ -> Nothing
bigstep (ExpPred e) = case bigstep e of 
    Just (ExpSucc t) -> Just t
    Just ExpZero -> Just ExpZero
    _ -> Nothing
bigstep (ExpIsZero e) = case bigstep e of 
    Just ExpZero -> Just ExpTrue
    Just (ExpSucc t) -> Just ExpFalse
    _ -> Nothing
bigstep (ExpIf t t1 t2) = case bigstep t of 
    Just ExpTrue -> bigstep t1
    Just ExpFalse -> bigstep t2
    _ -> Nothing

-- Lazy evaluation
allPrimes :: [Int]
allPrimes = let allPrimesAux primes (x:xs) = let newPrimeArray = if all (\p -> x `mod` p /= 0) primes then [x] else [] in newPrimeArray ++ allPrimesAux (primes ++ newPrimeArray) xs in allPrimesAux [] [2..] 

prime :: Int -> Int
prime n = allPrimes!!n

primeAfter :: Int -> Int
primeAfter n = fromJust $ find (>n) allPrimes

repeatBTree :: a -> BTree a
repeatBTree x = Node x (repeatBTree x) (repeatBTree x)

takeBTree :: Int-> BTree a -> BTree a
takeBTree 0 _ = Empty
takeBTree n (Node a left right) = Node a (takeBTree (n-1) left) (takeBTree (n-1) right)

replicateBTree :: Int -> a -> BTree a
replicateBTree n x = takeBTree n (repeatBTree x)

divergentBool :: Bool
divergentBool = True && divergentBool

-- shorcircuited implication
(==>) :: Bool -> Bool -> Bool
(==>) a b = if a then b else True

-- non-shorcircuited implication
implies :: Bool -> Bool -> Bool
implies a b = if a then b else (b || True)

-- non-divergent-on-true implication
implies' _ True = True
implies' False _ = True
implies' _ _ = False

duplil :: [a] -> [a]
duplil xs = foldl (\acc x -> acc ++ [x, x]) [] xs

duplir :: [a] -> [a]
duplir xs = foldr (\x acc -> [x, x] ++ acc) [] xs


-- Difference Lists
type DList a = [a] -> [a]

fromList :: [a] -> DList a
fromList xs = \ys -> xs ++ ys

toList :: DList a -> [a]
toList dxs = dxs []

append :: DList a -> DList a -> DList a
append dxs dys = \zs -> dxs (dys zs)

empty :: DList a
empty = ([]++)

cons :: a -> DList a -> DList a
cons x dxs = \ys -> x:dxs ys