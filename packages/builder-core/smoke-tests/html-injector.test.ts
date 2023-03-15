import { HtmlInjector } from '../src/index';
const templateHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Demo 1</title>
  </head>
  <body>
    <div id="app" FIRST-SCREEN-TIMING></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
`;

new HtmlInjector(templateHtml, {
  title: '测试标题',
  description: '测试描述',
  useInjection: {
    debugger: true,
    flexible: true,
    pageSpeedTester: true,
  },
}).getInjectedHtml({
  builder: 'esbuild',
});