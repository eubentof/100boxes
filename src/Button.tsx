import { children, Component } from "solid-js";
import styles from "./css/styles.module.css";

export const Button: Component<{
    onClick?: (e: MouseEvent) => void;
    color: string;
    disabled?: () => boolean;
    children: string;
}> = (props) => {
    const { onClick, children, color, disabled } = props;
    return (
        <button
            type="button"
            class={`${styles.btn} ${styles["btn-" + color]}`}
            onClick={onClick}
            disabled={disabled ? disabled() : false}
        >
            {children}
        </button>
    );
};
