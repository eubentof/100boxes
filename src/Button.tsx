import { children, Component } from "solid-js";
import styles from "./css/styles.module.css";

export const Button: Component<{
    onClick?: (e: MouseEvent) => void;
    color: string;
    disabled?: boolean;
    children: string;
}> = (props) => {
    return (
        <button
            type="button"
            class={`${styles.btn} ${styles["btn-" + props.color]}`}
            onClick={props.onClick}
            disabled={props.disabled !== undefined ? props.disabled : false}
        >
            {props.children}
        </button>
    );
};
