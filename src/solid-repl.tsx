import { Show } from 'solid-js/web';
import type { JSX } from 'solid-js';
import { createMemo, splitProps } from 'solid-js';
import { compressToURL } from '@amoutonbrady/lz-string';

function uid() {
  const [ts, rand] = [performance.now(), Math.random()].map((value) =>
    value.toString(36),
  );

  return (ts + rand).replace(/\./g, '');
}

function childrensToArray<T = unknown>(children: unknown | unknown[]): T[] {
  return [...(Array.isArray(children) ? children : [children])];
}

function formatCode(code: string) {
  const lines = code.split('\n');

  let mindent: number | null = null;
  let result = code.replace(/\\\n[ \t]*/g, '').replace(/\\`/g, '`');

  for (const line of lines) {
    const m = line.match(/^(\s+)\S+/);

    if (!m) continue;
    const indent = m[1].length;
    mindent = mindent ? Math.min(mindent, indent) : indent;
  }

  if (mindent !== null) {
    result = lines
      .map((line) => (line[0] === ' ' ? line.slice(mindent) : line))
      .join('\n');
  }

  return result.trim().replace(/\\n/g, '\n');
}

export const ReplTab = (props: {
  name: string;
  children?: unknown | unknown[];
}) => {
  const id = uid();

  return createMemo(() => {
    const source = childrensToArray(props.children).join('');

    return ({
      id,
      name: props.name,
      source: formatCode(source),
      type: 'tsx',
    } as unknown) as JSX.Element;
  });
};

export const Repl = (props: ReplOptions) => {
  const [internal, external] = splitProps(props, [
    'data',
    'height',
    'baseUrl',
    'children',
    'isInteractive',
    'withHeader',
  ]);

  const tabs = createMemo(() => {
    if (!internal.children) return [];

    return childrensToArray<() => Tab>(internal.children).map((tab) => tab());
  });

  const src = createMemo(() => {
    const url = new URL(internal.baseUrl || 'https://playground.solidjs.com');

    if (!internal.withHeader) url.searchParams.set('noHeader', 'true');
    if (!internal.isInteractive) url.searchParams.set('noInteractive', 'true');
    if (internal.data) url.searchParams.set('data', internal.data);

    if (tabs().length) {
      url.hash = compressToURL(JSON.stringify(tabs()));
    }

    return url.toString();
  });

  return (
    <Show
      when={internal.data || tabs().length}
      fallback={<p>The REPL needs to have at least one tab</p>}
    >
      <iframe
        {...external}
        src={src()}
        style={{
          width: '100%',
          height:
            typeof internal.height === 'number'
              ? `${internal.height}px`
              : internal.height,
          border: 0,
        }}
      />
    </Show>
  );
};

export interface ReplOptions
  extends JSX.IframeHTMLAttributes<HTMLIFrameElement> {
  baseUrl?: string;
  height?: number | string;
  isInteractive?: boolean;
  withHeader?: boolean;
  data?: string;
  children?: any;
}

export interface Tab {
  id: string;
  name: string;
  type: string;
  source: string;
}
