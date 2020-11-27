import ow from 'oceanwind';
import { Component } from 'solid-js';

const TabItem: Component<Props> = (props) => {
  return (
    <li
      class={ow({
        'border-orange-600': props.active || false,
        'border-b-2': props.active || false,

        'inline-flex': true,
        'items-center': true,
        'space-x-2': true,
        'py-1': true,
        'text-sm': true,
      })}
    >
      {props.children}
    </li>
  );
};

export default TabItem;

interface Props extends JSX.LiHTMLAttributes<HTMLLIElement> {
  active?: boolean;
}
