export function injectUtils (namespace: Record<string | symbol | number, any>) {
  namespace.parseUrl = parseUrl;
  namespace.loadScript = loadScript;
  namespace.getCookie = getCookie;
}

export function parseUrl(url: string) {
  if (typeof url !== 'string') return null;
  const urlSegs = url.split('#');
  const beforeHash = urlSegs[0];
  const hash = urlSegs[1];
  const search = beforeHash.split('?')[1] || '';
  const segs = search.split('&');
  const decode = decodeURIComponent;
  const params = segs.reduce(function (oriSum, seg) {
    var sum = oriSum;
    if (!seg) return sum;
    var value = '';
    var oriKV = seg.split('=');
    var oriKey = oriKV[0];
    var oriVal = oriKV[1];
    if (!oriKey) return sum;
    var key = decode(oriKey);
    if (!oriVal) {
      value = oriVal;
    } else {
      value = decode(oriVal);
    }
    sum[key] = value;
    return sum;
  }, {});
  return {
    hash,
    params,
  };
}

export function loadScript(url: string, callback?: () => void) {
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

export function getCookie(key: string, oriCookie?: string) {
  var cookie = typeof oriCookie !== 'string' ? document.cookie : oriCookie;
  var r = new RegExp('(?:^|;\\s*)' + key + '=([^;]*)');
  var m = cookie.match(r);
  return (m && m[1]) || '';
}