import { injectUtils } from "./util";
import { loadDebugger } from "./debugger";
import { useFlexible } from "./flexible";
import { injectPageSpeed } from "./page-speed-tester";

function main(window) {
  const NAMESPACE = '$presets$';
  const UTIL_SUB_NAMESPACE = 'utils';
  const DATA_SUB_NAMESPACE = 'data';
  if (!window[NAMESPACE]) {
    window[NAMESPACE] = {};
  }
  if (!window[NAMESPACE][UTIL_SUB_NAMESPACE]) {
    window[NAMESPACE][UTIL_SUB_NAMESPACE] = {};
  }
  if (!window[NAMESPACE][DATA_SUB_NAMESPACE]) {
    window[NAMESPACE][DATA_SUB_NAMESPACE] = {};
  }
  injectUtils(window[NAMESPACE][UTIL_SUB_NAMESPACE]);

  if (__USE_INJECTION_DEBUGGER__) {
    loadDebugger();
  }

  if (__USE_INJECTION_FLEXIBLE__) {
    useFlexible();
  }

  if (__USE_INJECTION_PAGE_SPEED_TESTER__) {
    injectPageSpeed(window[NAMESPACE][DATA_SUB_NAMESPACE]);
  }
}

if (__USE_INJECTION__) {
  main(window);
}
