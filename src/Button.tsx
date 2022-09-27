import { Component } from "solid-js";

export const Button: Component<{
    onClick?: (e: MouseEvent) => void;
    text: string;
    color?: string;
    disabled?: boolean;
}> = (props) => {
    const { onClick, text, color = "blue", disabled } = props;
    return (
        <button
            type="button"
            class={`inline-block px-6 py-2.5 bg-${color}-600 ${
                color ? "text-white" : ""
            } text-black font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-${color}-700 hover:shadow-lg focus:bg-${color}-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-${color}-800 active:shadow-lg transition duration-150 ease-in-out`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
};
