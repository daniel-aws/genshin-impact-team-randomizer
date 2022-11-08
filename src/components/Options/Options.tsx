import { JSX, ParentComponent, splitProps } from 'solid-js';

import styles from './Options.module.css';

interface IOptions {
  secondary?: boolean;
}

const Options: ParentComponent<
IOptions & JSX.ButtonHTMLAttributes<HTMLButtonElement>
> = props => {
  const [local, others] = splitProps(props, ['secondary']);

  return (
    <button
      {...others}
      class={
        local.secondary
          ? `${styles.options} ${styles.secondaryOptions}`
          : styles.options
      }
    >
      {props.children}
    </button>
  );
};

export { Options };
