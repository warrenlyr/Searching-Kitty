import React, { useEffect, useState } from "react";
import "./styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BoardSquare from "../BoardSquare/BoardSquare";
import Timer from "../Timer/Timer";
import Modal from "../Modal/modal";
import Leaderboardlanding from "../LeaderBoard/leaderboard";
import Button from "../Button/Button";

const GameGrid = ({ puzzle, size, words, level }) => {
	const [selectedBlocks, setSelectedBlocks] = useState([]);
	const [remainingWords, setRemainingWords] = useState(words);
	const [openedLetters, setOpenedLetters] = useState([]);
	const [time, setTime] = useState(0);
	const [wrongAttempts, setWrongAttempts] = useState(0);

	const [canContinue, setCanContinue] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const [stopTimer, setStopTimer] = useState(false);

	const maxSelected = size;

	const handleClick = (row, col, letter) => {
		if (canContinue) {
			const newBlock = { row: row, col: col, letter: letter };
			if (
				!selectedBlocks.some(
					(block) => block.row === row && block.col === col
				) &&
				selectedBlocks.length < maxSelected
			) {
				setSelectedBlocks([...selectedBlocks, newBlock]);
			} else {
				if (
					selectedBlocks.some((block) => block.row === row && block.col === col)
				) {
					toast.info("Letter already selected");
				} else {
					toast.info("Maximum amount of letters selected");
				}
			}
		} else {
			toast.info("Wait for the previous blocks to close", {
				autoClose: 1000,
			});
		}
	};

	const handleConfirm = () => {
		let word = "";
		let prevNeighbors = null;

		for (let i = 0; i < selectedBlocks.length; i++) {
			const block = selectedBlocks[i];
			if (i === 0) {
				prevNeighbors = getBlockNeighbors(block.row, block.col);
			} else {
				if (
					prevNeighbors.some(
						(neighbor) =>
							neighbor.row === block.row && neighbor.col === block.col
					)
				) {
					prevNeighbors = getBlockNeighbors(block.row, block.col);
				} else {
					break;
				}
			}
			word = word + block.letter;
		}

		const prevOpenedLetters = openedLetters;
		const newArray = openedLetters.concat(selectedBlocks);
		setOpenedLetters(newArray);

		if (remainingWords.includes(word)) {
			setRemainingWords((wordsLeft) => wordsLeft.filter((w) => w !== word));
			toast.success(`Word found, ${word}`);
			handleClear();
		} else {
			const closeTime = level === 1 || level === 3 ? 3000 : 4000;
			setCanContinue(false);
			setWrongAttempts(wrongAttempts + 1);
			toast.error("Wrong word, Try again", {
				autoClose: closeTime,
			});

			if (level === 1) {
				setCanContinue(true);
				handleClear();
			} else if (level === 2) {
				setTimeout(() => {
					setOpenedLetters(prevOpenedLetters);
					setCanContinue(true);
					handleClear();
				}, 4700);
			} else {
				setTimeout(() => {
					setOpenedLetters(prevOpenedLetters);
					setCanContinue(true);
					handleClear();
				}, 3700);
			}
		}
	};

	const handleClear = () => {
		setSelectedBlocks([]);
	};

	const getBlockNeighbors = (row, col) => {
		const neighbors = [];
		const row_limit = puzzle.length;
		if (row_limit > 0) {
			const column_limit = puzzle[0].length;
			for (
				let r = Math.max(0, row - 1);
				r <= Math.min(row + 1, row_limit - 1);
				r++
			) {
				for (
					let c = Math.max(0, col - 1);
					c <= Math.min(col + 1, column_limit - 1);
					c++
				) {
					if (r !== row || c !== col) {
						const neighbor = {
							row: r,
							col: c,
							letter: puzzle[r][c],
						};
						neighbors.push(neighbor);
					}
				}
			}
		}
		return neighbors;
	};

	const endGame = () => {
		setIsOpen(true);
		setStopTimer(true);
	};

	useEffect(() => {
		if (remainingWords.length === 0) {
			endGame();
		}
	}, [remainingWords]);

	return (
		<>
			<div className="gameContainer">
				<div className="wordsContainer">
					<div>Words to find</div>
					{remainingWords.map((word) => {
						return (
							<div className="gameWord" key={word}>
								{word}
							</div>
						);
					})}
				</div>
				<div className="game">
					<div className="gameFunctions">
						<Timer stopTimer={stopTimer} time={time} setTime={setTime} />
						<span className="blockSelect">
							{selectedBlocks.length} selected
						</span>
					</div>
					<div className="puzzleBoard">
						{puzzle.map((row, rowIndex) => {
							return (
								<div className="boardRow" key={rowIndex}>
									{row.map((letter, colIndex) => {
										return (
											<BoardSquare
												key={`${rowIndex}-${colIndex}`}
												letter={letter}
												row={rowIndex}
												col={colIndex}
												handleClick={handleClick}
												clicked={
													canContinue
														? selectedBlocks.some(
																(b) =>
																	b.row === rowIndex &&
																	b.col === colIndex &&
																	b.letter === letter
														  )
														: false
												}
												opened={openedLetters.some(
													(b) =>
														b.row === rowIndex &&
														b.col === colIndex &&
														b.letter === letter
												)}
												level={level}
											/>
										);
									})}
								</div>
							);
						})}
					</div>
					<div className="boardButtons">
						<Button
							additionalStyles={"boardButton"}
							buttonType={"button"}
							handleClick={handleConfirm}
						>
							Confirm
						</Button>
						<Button
							additionalStyles={"boardButton"}
							buttonType={"button"}
							handleClick={handleClear}
						>
							Clear
						</Button>
					</div>
				</div>
				<Leaderboardlanding />
			</div>
			<Modal open={isOpen} onClose={() => setIsOpen(false)}>
				<div className="modalTitle">Puzzle Solved!</div>
				<p>Great job, you have solved the daily Puzzle!</p>
				<div className="score">
					Your time:{" "}
					<span className="digits">
						{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
						{("0" + Math.floor((time / 1000) % 60)).slice(-2)}
					</span>
				</div>
				<div>Wrong attempts {wrongAttempts}</div>
				<button>Share my score</button>
				<button>Share my score anonymously</button>
			</Modal>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover={false}
				theme="dark"
			/>
		</>
	);
};

export default GameGrid;