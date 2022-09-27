import { Component, For } from "solid-js";
import { Button } from "./Button";

export interface WinnerGame {
    date: Date;
    username: string;
    country: string;
    game: number[];
}

export const Winners: Component<{
    winners: WinnerGame[];
    onReplay: (winner: WinnerGame) => void;
}> = (props) => {
    const { winners, onReplay } = props;
    return (
        <div class="w-3/5 mx-auto">
            <section class="mt-5 border-t-4 w-full">
                <h1 class="text-2xl mt-3 text-center">Winners</h1>
                <table class="w-full mt-4">
                    <thead class="text-left border-b-2">
                        <tr>
                            <th style="width:14rem">Date</th>
                            <th>Username</th>
                            <th>Country</th>
                            <th class="w-20"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={winners}>
                            {(winner) => (
                                <tr>
                                    <td class="mr-5">
                                        {winner.date.toLocaleDateString()} at{" "}
                                        {winner.date.toLocaleTimeString()}
                                    </td>
                                    <td class="mr-5">{winner.username}</td>
                                    <td class="mr-5">{winner.country}</td>
                                    <td>
                                        <Button
                                            text="replay"
                                            color="green"
                                            onClick={() => onReplay(winner)}
                                        />
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
