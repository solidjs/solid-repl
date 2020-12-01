import { Show } from 'solid-js/web';
import type { Component } from 'solid-js';
import { createMemo, splitProps } from 'solid-js';
import { compressToEncodedURIComponent } from 'lz-string';

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

  console.log({ mindent });

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
    console.log(props.children);
    const source = childrensToArray(props.children).join('');

    return ({
      id,
      name: props.name,
      source: formatCode(source),
      type: 'tsx',
    } as unknown) as JSX.Element;
  });
};

export const Repl: Component<ReplOptions> = (props) => {
  const [internal, external] = splitProps(props, [
    'height',
    'baseUrl',
    'children',
  ]);

  const tabs = createMemo(() => {
    return childrensToArray<() => Tab>(internal.children).map((tab) => tab());
  });

  const src = createMemo(() => {
    const url = new URL(internal.baseUrl);
    url.hash = compressToEncodedURIComponent(JSON.stringify(tabs()));

    if (props.withHeader) url.searchParams.set('withHeader', 'true');
    if (props.isInteractive) url.searchParams.set('isInteractive', 'true');

    return url.toString();
  });

  return (
    <Show
      when={tabs().length}
      fallback={<p>The REPL needs to have at least one tab</p>}
    >
      <iframe
        {...external}
        src={src()}
        style={{ width: '100%', height: `${internal.height}px`, border: 0 }}
      />
    </Show>
  );
};

export interface ReplOptions
  extends JSX.IframeHTMLAttributes<HTMLIFrameElement> {
  baseUrl: string;
  height?: number;
  isInteractive?: boolean;
  withHeader?: boolean;
}

export interface Tab {
  id: string;
  name: string;
  type: string;
  source: string;
}
