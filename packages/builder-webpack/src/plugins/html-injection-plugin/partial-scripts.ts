export default `
(function () {
  function main(window, document) {
    var NAMESPACE = '$presets$';
    var UTIL_SUB_NAMESPACE = 'utils';
    if (!window[NAMESPACE]) {
      window[NAMESPACE] = {};
    }
    if (!window[NAMESPACE][UTIL_SUB_NAMESPACE]) {
      window[NAMESPACE][UTIL_SUB_NAMESPACE] = {};
    }
    injectUtils(window[NAMESPACE][UTIL_SUB_NAMESPACE], document);

    /*START_INJECTION_CONFIG:useDebugger*/
    // debugger 机制
    loadDebugger(window, window[NAMESPACE][UTIL_SUB_NAMESPACE]);
    /*END_INJECTION_CONFIG:useDebugger*/

    /*START_INJECTION_CONFIG:useFlexible*/
    // flexible 机制
    useFlexible(window, document);
    /*END_INJECTION_CONFIG:useFlexible*/
  }

  // 注入工具
  function injectUtils(namespace, document) {
    function parseUrl(url) {
      if (typeof url !== 'string') return null;
      var urlSegs = url.split('#');
      var beforeHash = urlSegs[0];
      var hash = urlSegs[1];
      var search = beforeHash.split('?')[1] || '';
      var segs = search.split('&');
      var params = segs.reduce(function (oriSum, seg) {
        var sum = oriSum;
        if (!seg) return sum;
        var value = '';
        var [oriKey, oriVal] = seg.split('=');
        if (!oriKey) return sum;
        var key = decodeURIComponent(oriKey);
        if (!oriVal) {
          value = oriVal;
        } else {
          value = decodeURIComponent(oriVal);
        }
        sum[key] = value;
        return sum;
      }, {});
      return {
        hash,
        params,
      };
    }

    // 加载 script 外链脚本
    function loadScript(url, callback) {
      var scriptElem = document.createElement('script');
      var headElem = document.head || document.getElementsByTagName('head')[0];
      scriptElem.src = url;
      scriptElem.async = true;
      scriptElem.addEventListener('load', function () {
        if (typeof callback !== 'function') return;
        callback();
      });
      scriptElem.addEventListener('error', function () {
        headElem.removeChild(scriptElem);
      });
      headElem.appendChild(scriptElem);
    }

    // 获取 cookie
    function getCookie(key, oriCookie) {
      var cookie = typeof oriCookie !== 'string' ? document.cookie : oriCookie;
      var r = new RegExp('(?:^|;\\s*)' + key + '=([^;]*)');
      var m = cookie.match(r);
      return (m && m[1]) || '';
    }

    namespace.parseUrl = parseUrl;
    namespace.loadScript = loadScript;
    namespace.getCookie = getCookie;
  }

  /*START_INJECTION_CONFIG:useDebugger*/
  // 加载 debugger
  function loadDebugger(window, utils) {
    var params = utils.parseUrl(window.location.href).params;
    if (params['debugger'] === '1') {
      var debuggerUrlMap = {
        mdebug: 'https://unpkg.com/mdebug@latest/dist/index.js',
        eruda: 'https://unpkg.com/mdebug@latest/dist/index.js',
        vConsole: 'https://unpkg.com/mdebug@latest/dist/index.js',
      };
      var debuggerType = params['debuggerType'] || 'mdebug';
      utils.loadScript(debuggerUrlMap[debuggerType] || debuggerUrlMap.mdebug, function () {
        window[debuggerType].init();
      });
    }
  }
  /*END_INJECTION_CONFIG:useDebugger*/

  /*START_INJECTION_CONFIG:useFlexible*/
  // 使用 flexible
  function useFlexible(window, document) {
    var docEl = document.documentElement;

    function setRemUnit() {
      var rem = docEl.clientWidth / 10;
      docEl.style.fontSize = rem + 'px';
    }
    setRemUnit();

    window.addEventListener('resize', setRemUnit);
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        setRemUnit();
      }
    });
  }
  /*END_INJECTION_CONFIG:useFlexible*/

  return main;
})()(window, document);
`;
