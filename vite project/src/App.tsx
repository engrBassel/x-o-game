import { useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown19,
  faArrowDown91,
} from "@fortawesome/free-solid-svg-icons";

type square = string | null;

const locations = [
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 1],
  [2, 2],
  [2, 3],
  [3, 1],
  [3, 2],
  [3, 3],
];

let winSquares: number[];

function Square({
  value,
  indx,
  onSquareClick,
}: {
  value: square;
  indx: number;
  onSquareClick(): void;
}) {
  return (
    <button
      type="button"
      className={`square${
        winSquares && winSquares.includes(indx) ? " win" : ""
      }`}
      title="Click to draw"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({
  xIsNext,
  board,
  onPlay,
}: {
  xIsNext: boolean;
  board: square[];
  onPlay(nextBoard: square[], indx: number): void;
}) {
  function handleClick(indx: number) {
    if (checkWinner(board) || board[indx]) {
      return;
    }
    const nextBoard = board.slice();
    nextBoard[indx] = xIsNext ? "X" : "O";
    onPlay(nextBoard, indx);
  }

  return (
    <div className="game-play__board">
      {board.map((square, indx) => (
        <Square
          key={indx}
          value={square}
          indx={indx}
          onSquareClick={() => handleClick(indx)}
        />
      ))}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState<square[][]>([Array(9).fill(null)]),
    [clickHistory, setClickHistory] = useState<(number | null)[]>([null]),
    [currentMove, setCurrentMove] = useState(0),
    [reverseList, setReverseList] = useState(false),
    xIsNext = currentMove % 2 == 0,
    currentBoard = history[currentMove];

  function handlePlay(nextBoard: square[], indx: number) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextBoard],
      nextClickHistory = [...clickHistory.slice(0, currentMove + 1), indx];
    setHistory(nextHistory);
    setClickHistory(nextClickHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const winner = checkWinner(currentBoard);
  let label, player;
  if (winner) {
    label = "Winner: ";
    player = winner;
  } else if (currentMove == 9) {
    label = "Draw!";
    player = "";
  } else {
    label = "Next Player: ";
    player = xIsNext ? "X" : "O";
  }

  return (
    <>
      <header>Tic Tac Toe Game</header>
      <main id="game">
        <section className="game-play">
          <div className="game-play__message">
            <span>{label}</span>
            {player && <span className="player">{player}</span>}
          </div>
          <Board xIsNext={xIsNext} board={currentBoard} onPlay={handlePlay} />
        </section>
        <section className="game-history">
          <div className="game-history__header">
            <h2>Moves History</h2>
            <button
              type="button"
              title="Click to sort list"
              onClick={() => {
                setReverseList(!reverseList);
              }}
            >
              {reverseList ? (
                <FontAwesomeIcon icon={faArrowDown19} size="2x" />
              ) : (
                <FontAwesomeIcon icon={faArrowDown91} size="2x" />
              )}
            </button>
          </div>
          <ol start={0} className={reverseList ? "reversed" : ""}>
            {history.map((_, indx) => (
              <li key={indx}>
                {indx == currentMove ? (
                  <span>{`You are at ${
                    indx > 0
                      ? `move #${indx} at (${
                          locations[clickHistory[indx]!][0]
                        },${locations[clickHistory[indx]!][1]})`
                      : `game start`
                  }`}</span>
                ) : (
                  <button
                    type="button"
                    title="Click to jump"
                    onClick={() => {
                      winSquares = [];
                      setCurrentMove(indx);
                    }}
                  >
                    {`Go to ${
                      indx > 0
                        ? `move #${indx} at (${
                            locations[clickHistory[indx]!][0]
                          },${locations[clickHistory[indx]!][1]})`
                        : `game start`
                    }`}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </section>
      </main>
    </>
  );
}

function checkWinner(board: square[]): square {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winSquares = [a, b, c];
      return board[a];
    }
  }

  return null;
}

export default Game;
