import { Component, createEffect, createSignal, For } from "solid-js";

import styles from "./styles.module.css";

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
    const [score, setScore] = createSignal(1);
    const [gameOver, setGameOver] = createSignal(false);
    const [gameFinished, setGameFinished] = createSignal(false);

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

    let validMovesIndexes: number[] = [];
    let solutionIndexes: number[] = [];

    function setNextMoveOptions() {
        validMovesIndexes.forEach((index) =>
            boxesIndexMap[index].setIsNextMove(false)
        );

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
        if (box.index - 30 > 0) {
            const topMove = boxesIndexMap[box.index - 30];
            if (!topMove.isPartOfSolution()) {
                topMove.setIsNextMove(true);
                validMovesIndexes.push(topMove.index);
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
        if (box.index - 18 > 0) {
            const topRightMove = boxesIndexMap[box.index - 18];
            if (
                topRightMove.col > box.col &&
                !topRightMove.isPartOfSolution()
            ) {
                topRightMove.setIsNextMove(true);
                validMovesIndexes.push(topRightMove.index);
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
        if (box.index + 2 <= 100) {
            const rightMove = boxesIndexMap[box.index + 3];
            if (rightMove.row === box.row && !rightMove.isPartOfSolution()) {
                rightMove.setIsNextMove(true);
                validMovesIndexes.push(rightMove.index);
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
        if (box.index + 22 <= 100) {
            const rightBottomMove = boxesIndexMap[box.index + 22];
            if (
                rightBottomMove.col > box.col &&
                !rightBottomMove.isPartOfSolution()
            ) {
                rightBottomMove.setIsNextMove(true);
                validMovesIndexes.push(rightBottomMove.index);
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
        if (box.index + 30 <= 100) {
            const rightBottomMove = boxesIndexMap[box.index + 30];
            if (!rightBottomMove.isPartOfSolution()) {
                rightBottomMove.setIsNextMove(true);
                validMovesIndexes.push(rightBottomMove.index);
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
        if (box.index + 18 <= 100) {
            const rightBottomMove = boxesIndexMap[box.index + 18];
            if (
                rightBottomMove.col < box.col &&
                !rightBottomMove.isPartOfSolution()
            ) {
                rightBottomMove.setIsNextMove(true);
                validMovesIndexes.push(rightBottomMove.index);
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
        if (box.index - 3 > 0) {
            const leftMove = boxesIndexMap[box.index - 3];
            if (box.row === leftMove.row && !leftMove.isPartOfSolution()) {
                leftMove.setIsNextMove(true);
                validMovesIndexes.push(leftMove.index);
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
        if (box.index - 22 > 0) {
            const topLeftMove = boxesIndexMap[box.index - 22];
            if (topLeftMove.row < box.row && !topLeftMove.isPartOfSolution()) {
                topLeftMove.setIsNextMove(true);
                validMovesIndexes.push(topLeftMove.index);
            }
        }
    }

    function isCurrentBox(box: Box) {
        const _sBox = selectedBox();
        return _sBox ? _sBox.index == box.index : false;
    }

    function makeMove(box: Box) {
        if (score() == 100) {
            setGameFinished(true);
            return;
        }

        if (
            gameOver() ||
            (solutionIndexes.length > 0 &&
                !validMovesIndexes.includes(box.index)) ||
            box.isPartOfSolution()
        )
            return;

        solutionIndexes.push(box.index);
        setSelectedBox(box);
        box.setIsPartOfSolution(true);
        box.setValue(score());
        setNextMoveOptions();
        if (validMovesIndexes.length) setScore(score() + 1);
        else setGameOver(true);
    }

    function resetBoxes() {
        setSelectedBox(undefined);
        Object.values(boxesIndexMap).forEach((box) => {
            box.setIsNextMove(false);
            box.setIsPartOfSolution(false);
            box.setValue(undefined);
            validMovesIndexes = [];
            solutionIndexes = [];
            setScore(1);
        });
    }

    return (
        <div class={styles.container}>
            <div
                class={`
                    ${styles.grid}
                    ${!selectedBox() ? styles.grid__empty : ""}
                    ${gameOver() ? styles["game-over"] : ""} 
                    ${gameFinished() ? styles["game-finished"] : ""} 
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
                                ${
                                    box.isPartOfSolution()
                                        ? styles["part-of-solution"]
                                        : ""
                                }
                            `}
                            style={`width: ${boxSize}px; height: ${boxSize}px`}
                            onClick={() => makeMove(box)}
                            // onMouseOver={() => setActiveBox(box)}
                        >
                            {box.value()}
                        </div>
                    )}
                </For>
            </div>
            <button onClick={resetBoxes}>Reset</button>
        </div>
    );
};

export default App;
