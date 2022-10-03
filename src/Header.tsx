import { Component } from "solid-js";

export const Header: Component<{}> = (props) => {
    return (
        <header class="text-center mt-4">
            <h1 class="text-6xl font-bold mt-0 mb-3">100 Boxes</h1>
            <p class="text-2xl mb-4">by <a href="http://github.com/eubentof" target="_blank">@eubentof</a></p>
            <p class="mb-5">Try to find a sequence that fills the grid from 1 to 100 by clicking in any box and following the valid moves. </p>
            <p class="mb-7">If you reach 100 you will be added to the winners list.</p>
        </header>
    );
};
