prodList :: [Int] -> Int
prodList [] = 1
prodList (x:xs) = x * (prodList xs)

prodListF :: [Int] -> Int
prodListF xs = foldl (*) 1 xs

member :: Eq a => a -> [a] -> Bool
member x [] = False
member x (y:ys) = x == y || member x ys

memberF :: Eq a => a -> [a] -> Bool
memberF x ys = foldl (\acc y -> acc || x == y) False ys

andF :: [Bool] -> Bool
andF xs = foldl (&&) True xs

copy :: Int -> a -> [a]
copy 0 x = []
copy n x = x : copy (n-1) x

copyL :: Int -> a -> [a]
copyL n x = [x | i <- [1..n]]

myTake :: Int -> [a] -> [a]
myTake 0 xs = []
myTake n (x:xs) = x : myTake (n-1) xs

myDrop :: Int -> [a] -> [a]
myDrop 0 xs =  xs
myDrop n (x:xs) = myDrop (n-1) xs

poslist :: [Int] -> [Int]
poslist xs = filter (\x -> x>0) xs

forall :: (a -> Bool) -> [a] -> Bool
forall p xs = foldl (\acc x -> acc && p x) True xs

allpos :: [Int] -> Bool
allpos xs = forall (>0) xs

split :: (a -> Bool) -> [a] -> ([a], [a])
split p xs = foldl (\(l1, l2) x -> if p x then (x:l1, l2) else (l1, x:l2)) ([], []) xs

eqElems :: Eq a => [(a, a)] -> [Bool]
eqElems xs = map (\(a, b) -> a == b) xs

exists :: (a -> Bool) -> [a] -> Bool
exists p xs = foldl (\acc x -> acc || p x) False xs

foldright :: (b -> a -> b) -> b -> [a] -> b
foldright f b [] = b
foldright f b (x:xs) = f (foldright f b xs) x

foldleft :: (b -> a -> b) -> b -> [a] -> b
foldleft f b [] = b
foldleft f b (x:xs) = foldleft f (f b x) xs

composelist :: [(a -> a)] -> (a -> a)
composelist fs = foldright (\acc f -> f . acc) (\x -> x) fs 

insert :: Ord a => a -> [a] -> [a]
insert x [] = [x]
insert x (y:ys) = if x<y then x:y:ys else y:insert x ys

insertsort :: Ord a => [a] -> [a]
insertsort xs = foldl (flip insert) [] xs