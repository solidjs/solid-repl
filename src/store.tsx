import { createState, createContext, useContext, Component } from 'solid-js';

const defaultTabs = [
  {
    id: 0,
    name: 'app',
    type: 'jsx',
    source:
      "import { render } from 'solid-js/web'\n\nconst App = () => <h1>Hello world</h1>\n\nrender(App, document.body)",
  },
];

function createStore(initialTabs?: ReplTab[]) {
  const [state, setState] = createState<{ current: number; tabs: Tab[] }>({
    current: 0,
    tabs: initialTabs
      ? initialTabs.map((tab, id) => ({ ...tab, id, type: 'jsx' }))
      : defaultTabs,
  });

  return [
    state,
    {
      get currentTab() {
        return state.tabs[state.current];
      },
      setCurrentTab: (current: number) => {
        setState('current', current);
      },
      setTabName(id: number, name: string) {
        setState('tabs', id, 'name', name);
      },
      removeTab(id: number) {
        if (state.current === id) {
          setState('current', (current) => (current > 0 ? current - 1 : 0));
        }

        setState('tabs', (tabs) => {
          const idx = tabs.findIndex((tab) => tab.id === id);
          return [...tabs.slice(0, idx), ...tabs.slice(idx + 1)];
        });
      },
      get currentSource() {
        return state.tabs[state.current].source;
      },
      setCurrentSource(source: string) {
        setState('tabs', state.current, 'source', source);
      },
      addTab() {
        const nextId = state.tabs.length;

        setState({
          tabs: [
            ...state.tabs,
            {
              id: nextId,
              name: `tab${nextId}`,
              type: 'jsx',
              source: '',
            },
          ],
          current: nextId,
        });
      },
    },
  ] as const;
}

type Store = ReturnType<typeof createStore>;

const StoreContext = createContext<Store>();

export const StoreProvider: Component<Props> = (props) => {
  const store = createStore(props.tabs);

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  return useContext(StoreContext);
}

export interface Tab {
  id: number;
  name: string;
  type: string;
  source: string;
}

export type ReplTab = Pick<Tab, 'name' | 'source'>;

interface Props {
  tabs?: ReplTab[];
}
