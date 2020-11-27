import type { Component } from 'solid-js';
import { createComputed, createEffect, createSignal } from 'solid-js';
import ow from 'oceanwind';
import { For, Show } from 'solid-js/web';

import { Tab } from './store';
import { StoreProvider, useStore } from './store';
import { compile } from './worker';

import Editor from './components/editor';
import Output from './components/output';
import TabList from './components/tab/list';
import TabItem from './components/tab/item';

const ReplBody: Component<{ interactive: boolean }> = (props) => {
  const [store, actions] = useStore();

  const [code, setCode] = createSignal('');
  const [edit, setEdit] = createSignal(-1);

  const refs = new Map<number, HTMLSpanElement>();

  createEffect(() => {
    if (edit() < 0) return;
    const ref = refs.get(edit());
    if (!ref) return;

    ref.focus();
  });

  createComputed(() => {
    for (const tab of store.tabs) tab.source;
    // TODO: Find a way to throttle / debounce this
    compile(store.tabs).then(setCode);
  });

  return (
    <main
      class={ow(['grid', 'grid-cols-2', 'bg-gray-200'])}
      style={{
        'grid-template-rows': 'auto 250px',
        'column-gap': '2px',
      }}
    >
      <TabList>
        <For each={store.tabs}>
          {(tab, index) => (
            <TabItem active={store.current === index()}>
              <button
                type="button"
                onClick={[actions.setCurrentTab, index()]}
                onDblClick={() => index() > 0 && setEdit(index())}
                class={ow([
                  'border-0',
                  'bg-transparent',
                  'text-current',
                  'cursor-pointer',
                  'pr-0',
                ])}
              >
                <span
                  ref={(el) => refs.set(index(), el)}
                  contentEditable={store.current === index() && edit() >= 0}
                  onBlur={(e) => {
                    setEdit(-1);
                    actions.setTabName(index(), e.target.textContent!);
                  }}
                >
                  {tab.name}
                </span>
                <span>.{tab.type}</span>
              </button>

              <Show when={index() > 0}>
                <button
                  type="button"
                  class={ow([
                    'border-0',
                    'bg-transparent',
                    'text-current',
                    'cursor-pointer',
                  ])}
                  onClick={[actions.removeTab, index()]}
                >
                  &times;
                </button>
              </Show>
            </TabItem>
          )}
        </For>

        <TabItem>
          <button onClick={actions.addTab} title="Add a new tab">
            {/* <span class={ow(["sr-only"])}>Add a new tab</span> */}
            <svg
              viewBox="0 0 24 24"
              style="stroke: currentColor; fill: none;"
              class={ow(['h-6'])}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </TabItem>
      </TabList>

      <Editor
        disabled={!props.interactive}
        value={actions.currentTab.source}
        onDocChange={actions.setCurrentSource}
        class={ow(['col-start-1', 'row-start-2', 'h-full', 'bg-white', 'p-3'])}
      />

      <Output
        code={code()}
        class={ow([
          'row-start-2',
          'col-start-2',
          'block',
          'w-full',
          'h-full',
          'border-0',
          'bg-white',
          'p-3',
        ])}
      />
    </main>
  );
};

export const Repl: Component<Props> = (props) => {
  return (
    <StoreProvider tabs={props.tabs}>
      <ReplBody interactive={Boolean(props.interactive)} />
    </StoreProvider>
  );
};

export type { Tab } from './store';

interface Props {
  interactive?: boolean;
  tabs: Pick<Tab, 'name' | 'source'>[];
}
