import { parseUrl, loadScript } from "./util"; 

export function loadDebugger () {
  const params = parseUrl(window.location.href).params;
  if (params['debugger'] === '1') {
    const origin = 'https://unpkg.com';
    const debuggerUrlMap = {
      mdebug: `${origin}/mdebug@latest/dist/index.js`,
      eruda: `${origin}/eruda@latest/dist/eruda.js`,
      vconsole: `${origin}/vconsole@latest/dist/vconsole.min.js`,
    };
    const debuggerType = params['debuggerType'] || 'mdebug';
    loadScript(debuggerUrlMap[debuggerType] || debuggerUrlMap.mdebug, function () {
      // @ts-ignore
      window[debuggerType]?.init?.();
    });
  }
}