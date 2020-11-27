import { Component, splitProps, createMemo } from 'solid-js';

const Output: Component<Props> = (props) => {
  const [internal, external] = splitProps(props, ['code']);

  const srcDoc = createMemo(
    () => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
            <link
              rel="stylesheet"
              href="https://unpkg.co/tailwindcss/dist/base.min.css"
            />
            <link
              rel="stylesheet"
              href="https://unpkg.co/@tailwindcss/typography/dist/typography.min.css"
            />
        </head>
        <body class="prose">
            <div id="app"></div>
            <script type="module">${internal.code}</script>
        </body>
        </html>
    `,
  );

  return <iframe srcdoc={srcDoc()} {...external} />;
};

export default Output;

interface Props extends JSX.IframeHTMLAttributes<HTMLIFrameElement> {
  code: string;
}
