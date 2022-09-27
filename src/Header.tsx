import { Component } from "solid-js";

export const Header: Component<{}> = (props) => {
    return (
        <header class="text-center">
            <h1 class="text-6xl font-bold mt-0 mb-3">100 Boxes</h1>
            <p class="text-2xl mb-4">by <a href="http://github.com/eubentof" target="_blank">@eubentof</a></p>
            <p class="mb-7">Try to find a patter that fills all the grid. Each new sequence is added to the winners list with your name</p>
        </header>
    );
};
