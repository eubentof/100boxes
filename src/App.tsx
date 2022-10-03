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
    const [validMoves, setValidMoves] = createSignal<number[]>([]);

    const gameHistory: any = {};

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
        validMoves().forEach((index) =>
            boxesIndexMap[index].setIsNextMove(false)
        );

        setValidMoves([]);

        const box = selectedBox();

        if (!box) return;

        const nextMovesCoords = [
            [-3, 0], // top
            [-2, 2], // top right
            [0, 3], // right
            [2, 2], // bottom right
            [3, 0], // bottom
            [2, -2], // bottom left
            [0, -3], // left
            [-2, -2], // top left
        ];

        const allValidMoves = nextMovesCoords
            .map(([cx, cy]) => {
                const indexStr = `${box.row + cx}${box.col - 1 + cy}`;
                if (indexStr.length > 2) return -1;
                const index = Number(indexStr);
                return Number.isInteger(index) ? Number(index) + 1 : -1;
            })
            .filter(
                (index) =>
                    boxesIndexMap[index] &&
                    !boxesIndexMap[index].isPartOfSolution() // Filter only the boxes that are not part of the solution
            );

        setValidMoves(allValidMoves);

        allValidMoves.forEach((index) =>
            boxesIndexMap[index].setIsNextMove(true)
        );
    }

    function isCurrentBox(box: Box) {
        return selectedBox()?.index == box.index;
    }

    function isGameFinished() {
        return score() === 100;
    }

    function isGameOver() {
        return !isGameFinished() && score() > 0 && validMoves().length === 0;
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

        if (score() === 100) {
            console.log(solutionIndexes);
            return;
        }

        const notAValidMove =
            solutionIndexes.length > 0 && !validMoves().includes(box.index);

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
            setValidMoves([]);
            solutionIndexes = [];
            setScore(0);
        });
    }

    function replayGame(winner: WinnerGame) {
        resetBoxes();

        console.log(`Replaying ${winner.name}'s game`);

        setIsReplaying(true);

        const speed = 5; // ms
        const game = JSON.parse(winner.game);
        const replayInterval = setInterval(() => {
            if (isGameFinished() || isGameOver()) {
                clearInterval(replayInterval);
                setIsReplaying(false);
                return;
            }

            const index = game[score()];
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
                            class={`${styles.box} 
                            ${isCurrentBox(box) && styles["current-box"]} 
                            ${box.isNextMove() && styles["next-option"]} 
                            ${isReplaying() && styles.disabled} 
                            ${
                                box.isPartOfSolution() &&
                                styles["part-of-solution"]
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
            <Button onClick={resetBoxes} color="blue" disabled={isReplaying()}>
                reset
            </Button>
            <Winners onReplay={replayGame} />
        </div>
    );
};

export default App;
