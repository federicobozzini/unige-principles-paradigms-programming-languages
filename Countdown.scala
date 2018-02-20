class Countdown(numSeq: Vector[Int]) {

  type State = Int
  val initialState = 0


  trait Op {
    def isApplicable(state: State): Boolean

    def apply(state: State): State
  }

  case class Add(v: Int) extends Op {
    def isApplicable(state: State) = true

    def apply(state: State) = state + v
  }

  case class Sub(v: Int) extends Op {
    def isApplicable(state: State) = state > v

    def apply(state: State) = state - v
  }

  case class Mul(v: Int) extends Op {
    def isApplicable(state: State) = true

    def apply(state: State) = state * v
  }

  case class Div(v: Int) extends Op {
    def isApplicable(state: State) = state % v == 0

    def apply(state: State) = state / v
  }

  val ops = Vector(Add, Sub, Mul, Div)

  val moves =
    for {
      v <- numSeq
      op <- ops
    }
      yield op(v)

  class Path(history: List[Op], val endState: State) {
    def extend(op: Op) = {
      new Path(op :: history, op apply endState)
    }

    override def toString = (history.reverse mkString " ") + "--> " + endState
  }

  val initialPath = new Path(Nil, initialState)
  val visitedStates = scala.collection.mutable.Set[State](initialState)

  def from(paths: Set[Path]): Stream[Set[Path]] =
    if (paths.isEmpty) Stream.empty
    else {
      val more = for {
        path <- paths
        validMoves = moves.filter(m => m.isApplicable(path.endState))
        next <- validMoves map path.extend
        if !(visitedStates contains next.endState)
      } yield next
      visitedStates ++= more.map(m => m.endState)
      more #:: from(more)
    }

  val pathSets = Set(initialPath) #:: from(Set(initialPath))

  def solutions(target: Int): Stream[Path] = {
    for {
      pathSet <- pathSets
      path <- pathSet
      if path.endState == target
    } yield path
  }

}
