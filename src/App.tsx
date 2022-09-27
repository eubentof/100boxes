import { Component, createEffect, createSignal, For } from "solid-js";

import styles from "./css/styles.module.css";
import { Header } from "./Header";
import { Button } from "./Button";
import { Winners, WinnerGame } from "./Winners";

const range = ({ begin = 0, end }: { begin?: number; end: number }) =>
    new Array(end - begin).fill(0).map((_, index) => begin + index);

interface Box {
    index: number;
    row: number;
    col: number;
    isNextMove(): boolean;
    setIsNextMove(isNextMove: boolean): void;
    isPartOfSolution(): boolean;
    setIsPartOfSolution(isPartOfSolution: boolean): void;
    value(): number | undefined;
    setValue(value?: number): void;
}

const App: Component = () => {
    const [selectedBox, setSelectedBox] = createSignal<Box>();
    const [score, setScore] = createSignal(0);
    const [isReplaying, setIsReplaying] = createSignal(false);
    const [nextMoves, setNextMoves] = createSignal<number[]>([]);

    const gameHistory: any = {};

    const winners: WinnerGame[] = [
        {
            date: new Date(),
            username: "eubentof",
            country: "Brazil",
            game: [
                91, 61, 31, 1, 4, 7, 10, 40, 70, 100, 97, 94, 72, 42, 12, 15,
                18, 48, 30, 60, 90, 87, 84, 81, 51, 21, 3, 6, 9, 39, 69, 99, 96,
                93, 71, 41, 11, 14, 17, 20, 50, 80, 98, 68, 38, 8, 5, 2, 32, 62,
                92, 95, 77, 59, 29, 26, 44, 74, 56, 78, 75, 53, 23, 45, 67, 89,
                86, 83, 65, 47, 25, 22, 52, 82, 85, 88, 58, 28, 46, 64, 34, 16,
                19, 49, 79, 76, 73, 43, 13, 35, 57, 27, 24, 54, 36, 66, 63, 33,
                55, 37,
            ],
        },
    ];

    const boxSize = 50;

    const boxesIndexMap: { [index: number]: Box } = {};

    const boxes = range({ begin: 1, end: 101 }).map((index) => {
        const row = Math.floor((index - 1) / 10);
        const col = index % 10 == 0 ? 10 : index % 10;
        const [isNextMove, setIsNextMove] = createSignal(false);
        const [isPartOfSolution, setIsPartOfSolution] = createSignal(false);
        const [value, setValue] = createSignal<number>();
        const box = {
            index,
            row,
            col,
            isNextMove,
            setIsNextMove,
            isPartOfSolution,
            setIsPartOfSolution,
            value,
            setValue,
        };

        boxesIndexMap[index] = box;
        return box;
    });

    let solutionIndexes: number[] = [];

    function setNextMoveOptions() {
        // Reset the last moves
        nextMoves().forEach((index) =>
            boxesIndexMap[index].setIsNextMove(false)
        );

        setNextMoves([]);

        const box = selectedBox();

        if (!box) return;

        /**
         * . . . x . . .
         * . . . . . . .
         * . . . . . . .
         * . . . o . . .
         * . . . . . . .
         * . . . . . . .
         * . . . . . . .
         */
        const topMoveIndex = box.index - 30;
        if (topMoveIndex > 0) {
            const topMove = boxesIndexMap[topMoveIndex];
            if (!topMove.isPartOfSolution()) {
                topMove.setIsNextMove(true);
                setNextMoves([...nextMoves(), topMove.index]);
            }
        }

        /**
         * . . . . . . .
         * . . . . . x .
         * . . . . . . .
         * . . . o . . .
         * . . . . . . .
         * . . . . . . .
         * . . . . . . .
         */
        const topRightMoveIndex = box.index - 18;
        if (topRightMoveIndex > 0) {
            const topRightMove = boxesIndexMap[topRightMoveIndex];
            if (
                topRightMove.col > box.col &&
                !topRightMove.isPartOfSolution()
            ) {
                topRightMove.setIsNextMove(true);
                setNextMoves([...nextMoves(), topRightMove.index]);
            }
        }

        /**
         * . . . . . . .
         * . . . . . . .
         * . . . . . . .
         * . . . o . . x
         * . . . . . . .
         * . . . . . . .
         * . . . . . . .
         */
        const rightMoveIndex = box.index + 3;
        if (rightMoveIndex <= 100) {
            const rightMove = boxesIndexMap[rightMoveIndex];
            if (rightMove.row === box.row && !rightMove.isPartOfSolution()) {
                rightMove.setIsNextMove(true);
                setNextMoves([...nextMoves(), rightMove.index]);
            }
        }

        /**
         * . . . . . . .
         * . . . . . . .
         * . . . . . . .
         * . . . o . . .
         * . . . . . . .
         * . . . . . x .
         * . . . . . . .
         */
        const bottomRightMoveIndex = box.index + 22;
        if (bottomRightMoveIndex <= 100) {
            const rightBottomMove = boxesIndexMap[bottomRightMoveIndex];
            if (
                rightBottomMove.col > box.col &&
                !rightBottomMove.isPartOfSolution()
            ) {
                rightBottomMove.setIsNextMove(true);
                setNextMoves([...nextMoves(), rightBottomMove.index]);
            }
        }

        /**
         * . . . . . . .
         * . . . . . . .
         * . . . . . . .
         * . . . o . . .
         * . . . . . . .
         * . . . . . . .
         * . . . x . . .
         */
        const bottomMoveIndex = box.index + 30;
        if (bottomMoveIndex <= 100) {
            const rightBottomMove = boxesIndexMap[bottomMoveIndex];
            if (!rightBottomMove.isPartOfSolution()) {
                rightBottomMove.setIsNextMove(true);
                setNextMoves([...nextMoves(), rightBottomMove.index]);
            }
        }

        /**
         * . . . . . . .
         * . . . . . . .
         * . . . . . . .
         * . . . o . . .
         * . . . . . . .
         * . x . . . . .
         * . . . . . . .
         */
        const bottomLeftMoveIndex = box.index + 18;
        if (bottomLeftMoveIndex <= 100) {
            const rightBottomMove = boxesIndexMap[bottomLeftMoveIndex];
            if (
                rightBottomMove.col < box.col &&
                !rightBottomMove.isPartOfSolution()
            ) {
                rightBottomMove.setIsNextMove(true);
                setNextMoves([...nextMoves(), rightBottomMove.index]);
            }
        }

        /**
         * . . . . . . .
         * . . . . . . .
         * . . . . . . .
         * x . . o . . .
         * . . . . . . .
         * . . . . . . .
         * . . . . . . .
         */
        const leftMoveIndex = box.index - 3;
        if (leftMoveIndex > 0) {
            const leftMove = boxesIndexMap[leftMoveIndex];
            if (box.row === leftMove.row && !leftMove.isPartOfSolution()) {
                leftMove.setIsNextMove(true);
                setNextMoves([...nextMoves(), leftMove.index]);
            }
        }

        /**
         * . . . . . . .
         * . x . . . . .
         * . . . . . . .
         * . . . o . . .
         * . . . . . . .
         * . . . . . . .
         * . . . . . . .
         */
        const topLeftMoveIndex = box.index - 22;
        if (topLeftMoveIndex > 0) {
            const topLeftMove = boxesIndexMap[topLeftMoveIndex];
            if (topLeftMove.col < box.col && !topLeftMove.isPartOfSolution()) {
                topLeftMove.setIsNextMove(true);
                setNextMoves([...nextMoves(), topLeftMove.index]);
            }
        }
    }

    function isCurrentBox(box: Box) {
        return selectedBox()?.index == box.index;
    }

    function isGameFinished() {
        return score() === 100;
    }

    function isGameOver() {
        return !isGameFinished() && score() > 0 && nextMoves().length === 0;
    }

    function revertMove(box: Box) {
        const revertToIndex = solutionIndexes.indexOf(box.index) + 1;

        const movesToRemove = solutionIndexes.slice(revertToIndex);

        movesToRemove.forEach((index) => {
            const box = boxesIndexMap[index];
            box?.setIsPartOfSolution(false);
            box?.setValue(undefined);
        });

        solutionIndexes = solutionIndexes.slice(0, revertToIndex);
        setScore(score() - movesToRemove.length);
        selectLastBox();
    }

    function undoLastMove() {
        const box = selectedBox();

        if (!box) return;

        solutionIndexes = solutionIndexes.filter(
            (index) => index !== box.index
        );

        setScore(score() - 1);
        box.setIsPartOfSolution(false);
        box.setValue(undefined);
        selectLastBox();
    }

    function selectLastBox() {
        const lastBoxIndex = solutionIndexes[solutionIndexes.length - 1];
        const lastBox = boxesIndexMap[lastBoxIndex];
        setSelectedBox(lastBox);
        setNextMoveOptions();
    }

    function makeMove(box: Box, fromReplay = false, e?: MouseEvent) {
        if (isReplaying() && !fromReplay) return;

        const ctrlWasPressed = e && e.ctrlKey;

        const isAnUndoMove =
            ctrlWasPressed && box.index === selectedBox()?.index;
        if (isAnUndoMove) return undoLastMove();

        const isARevertMove =
            ctrlWasPressed && solutionIndexes.includes(box.index);
        if (isARevertMove) return revertMove(box);

        if (score() === 100) return;

        const notAValidMove =
            solutionIndexes.length > 0 && !nextMoves().includes(box.index);

        if (isGameOver() || notAValidMove || box.isPartOfSolution()) return;

        solutionIndexes.push(box.index);
        box.setIsPartOfSolution(true);
        setScore(score() + 1);
        box.setValue(score());
        setSelectedBox(box);
        setNextMoveOptions();
    }

    function resetBoxes() {
        if (isReplaying()) return;
        setSelectedBox(undefined);
        Object.values(boxesIndexMap).forEach((box) => {
            box.setIsNextMove(false);
            box.setIsPartOfSolution(false);
            box.setValue(undefined);
            setNextMoves([]);
            solutionIndexes = [];
            setScore(0);
        });
    }

    function replayGame(winner: WinnerGame) {
        resetBoxes();

        console.log(`Replaying ${winner.username}'s game`);

        setIsReplaying(true);

        const speed = 0; // ms

        const replayInterval = setInterval(() => {
            if (isGameFinished() || isGameOver()) {
                clearInterval(replayInterval);
                setIsReplaying(false);
                console.log("Score: ", score());
                return;
            }

            const index = winner.game[score()];
            const box = boxesIndexMap[index];
            makeMove(box, true);
        }, speed);
    }

    return (
        <div class={styles.container}>
            <Header />
            <div
                class={`
                    ${styles.grid}
                    ${!selectedBox() ? styles.grid__empty : ""}
                    ${isGameOver() ? styles["game-over"] : ""} 
                    ${isGameFinished() ? styles["game-finished"] : ""} 
                    ${isReplaying() ? styles["replaying-game"] : ""}
                `}
            >
                <For each={boxes}>
                    {(box) => (
                        <div
                            class={`
                                ${styles.box} 
                                ${
                                    isCurrentBox(box)
                                        ? styles["current-box"]
                                        : ""
                                } 
                                ${box.isNextMove() ? styles["next-option"] : ""}
                                ${isReplaying() ? styles.disabled : ""}
                                ${
                                    box.isPartOfSolution()
                                        ? styles["part-of-solution"]
                                        : ""
                                }
                            `}
                            style={`width: ${boxSize}px; height: ${boxSize}px`}
                            onClick={(e) => makeMove(box, false, e)}
                        >
                            {box.value()}
                        </div>
                    )}
                </For>
            </div>
            <Button
                onClick={resetBoxes}
                text="reset"
                disabled={isReplaying()}
            />
            <Winners winners={winners} onReplay={replayGame} />
        </div>
    );
};

export default App;
