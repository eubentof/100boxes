import { Component, createSignal, For } from "solid-js";
import { Button } from "./Button";

export interface WinnerGame {
    date: string;
    name: string;
    country: string;
    game: string;
}

export const Winners: Component<{
    onReplay: (winner: WinnerGame) => void;
}> = (props) => {
    const [winners, setWinners] = createSignal<WinnerGame[]>([]);

    async function fetchLastWinners() {
        return fetch("http://localhost/100Boxes.api/winners/").then((r) =>
            r.json()
        );
        // .then((_winners) =>
        //     _winners.map((winner: WinnerGame) => {
        //         winner.date = new Date(winner.date);
        //     })
        // );
    }

    fetchLastWinners().then(setWinners);

    return (
        <div class="w-1/3 mb-5">
            <section class="mt-5 border-t-4 w-full">
                <h1 class="text-2xl mt-3 text-center">Winners</h1>
                <table class="w-full mt-4">
                    <thead class="text-left border-b-2">
                        <tr>
                            <th style="width:14rem">Date</th>
                            <th>Name</th>
                            <th>Country</th>
                            <th class="w-20"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={winners()}>
                            {(winner) => (
                                <tr>
                                    <td class="mr-5">{winner.date}</td>
                                    <td class="mr-5">{winner.name}</td>
                                    <td class="mr-5">{winner.country}</td>
                                    <td>
                                        <Button
                                            color="green"
                                            onClick={() => props.onReplay(winner)}
                                        >
                                            replay
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </section>
        </div>
    );
};
