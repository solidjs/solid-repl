import ow from 'oceanwind';
import type { Component } from 'solid-js';

const TabList: Component = (props) => {
  return (
    <ul
      class={ow([
        'flex',
        'items-center',
        'col-start-1',
        'px-0',
        'px-3',
        'list-none',
        'space-x-3',
        'bg-white',
        'm-0',
        'border-b-2',
        'border-gray-200',
      ])}
    >
      {props.children}
    </ul>
  );
};

export default TabList;
