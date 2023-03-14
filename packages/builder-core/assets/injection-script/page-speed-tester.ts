const FIRST_SCREEN_FLAG = 'FIRST-SCREEN-TIMING';
const FIRST_SCREEN_IGNORE_FLAG = 'IGNORE-FIRST-SCREEN-TIMING';

interface IMarkDoms {
  [key: string]: Element[];
}

interface IChangeDetail {
  roots: Element[];
  rootsDomNum: number[];
  time: number;
}

interface IAegisPerfMaterial {
  changeList: IChangeDetail[];
  markDoms: IMarkDoms;
  observeDom: MutationObserver;
}

interface IFirstScreenInfo {
  element: Element;
  timing: number;
  markDoms?: IMarkDoms;
}

// 重试次数
let retryTimes = 1;
// 等待多少 ms 之后开始计算首屏性能数据
const TIMEOUT = 3000;
const requestIdleCallback = window.requestIdleCallback ? window.requestIdleCallback : setTimeout;

/**
 * 向数据容器注入测速数据
 *
 * @export
 * @param {Record<string, any>} dataConatianer
 * @returns {*}  {(Promise<IFirstScreenInfo | undefined>)}
 */
export function injectPageSpeed(dataConatianer: Record<string, any>): Promise<IFirstScreenInfo | undefined> {
  const material = collectFirstScreenTimingMaterial();
  let p: Promise<IFirstScreenInfo | undefined>;
  if (!material) {
    p = new Promise(resolve => resolve(undefined));
  } else {
    p = new Promise((resolve) => setTimeout(() => {
      resolve(calculateFirstScreenInfo(material));
    }, TIMEOUT));
  }
  dataConatianer['firstScreenInfo'] = p;
  return p;
}

/**
 * 计算首屏测速数据
 *
 * @param {IAegisPerfMaterial} materialNS
 * @returns {*}  {(Promise<IFirstScreenInfo | undefined>)}
 */
function calculateFirstScreenInfo(materialNS: IAegisPerfMaterial): Promise<IFirstScreenInfo | undefined> {
  return new Promise((resolve) => {
    requestIdleCallback(function () {
      let firstScreenTiming = 0;
      let maxChange = 0;
      let firstScreenInfo: IFirstScreenInfo | undefined;
      const { markDoms = {}, changeList = [], observeDom } = (materialNS || {}) as IAegisPerfMaterial;
      const markDomTimings: number[] = Object.keys(markDoms)
        .filter((timing: string) => markDoms[timing].find((ele: Element) => isInFirstScreen(ele)))
        .map((timing) => Number(timing));

      if (markDomTimings.length) {
        // 用户手动标记的需要检查首屏的dom最晚出现的时间
        firstScreenTiming = Math.max.apply(null, markDomTimings);
        firstScreenInfo = {
          element: markDoms[firstScreenTiming] && markDoms[firstScreenTiming][0],
          timing: firstScreenTiming,
          markDoms,
        };
      } else {
        changeList.forEach((change) => {
          for (let i = 0; i < change.roots.length; i++) {
            if (change.rootsDomNum[i] > maxChange && isInFirstScreen(change.roots[i])) {
              maxChange = change.rootsDomNum[i];
              firstScreenTiming = change.time;
              firstScreenInfo = {
                element: change.roots[i],
                timing: firstScreenTiming,
              };
            }
          }
        });
      }
      retryTimes -= 1;
      if (!firstScreenTiming && retryTimes >= 0) {
        setTimeout(() => resolve(calculateFirstScreenInfo(materialNS)), TIMEOUT);
      } else {
        observeDom && observeDom.disconnect();
        resolve(firstScreenInfo);
      }
    }, 0);
  });
}

/**
 * 收集首屏速度的材料
 *
 * @returns {*} 
 */
function collectFirstScreenTimingMaterial() {
  if (!MutationObserver) return;

  const ignoreEleList = ['script', 'style', 'link', 'br'];
  const changeList = [];
  const markDoms = {};
  const observeDom = new MutationObserver(function (mutations) {
    const change = {
      roots: [],
      rootsDomNum: [],
      time: performance.now(),
    };
    mutations.forEach(function (mutation) {
      if (!mutation || !mutation.addedNodes || !mutation.addedNodes.forEach) return;

      mutation.addedNodes.forEach(function (ele) {
        if (
          ele.nodeType === 1 &&
          ((ele as Element).hasAttribute(FIRST_SCREEN_FLAG) || (ele as Element).querySelector(`[${FIRST_SCREEN_FLAG}]`))
        ) {
          if (!Object.prototype.hasOwnProperty.apply(markDoms, [change.time])) {
            markDoms[change.time] = [];
          }
          markDoms[change.time].push(ele);
        } else if (
          ele.nodeType === 1 &&
          ignoreEleList.indexOf(ele.nodeName.toLocaleLowerCase()) < 0 &&
          !isEleInArray(ele, change.roots) &&
          !(ele as Element).hasAttribute(FIRST_SCREEN_IGNORE_FLAG)
        ) {
          change.roots.push(ele);
          change.rootsDomNum.push(walkAndCount(ele) || 0);
        }
      });
    });
    change.roots.length && changeList.push(change);
  });
  observeDom.observe(document, {
    childList: true,
    subtree: true,
  });
  return {
    markDoms: markDoms,
    changeList: changeList,
    observeDom: observeDom,
  };
}

/**
 * 查看当前元素的先祖是否在数组中
 *
 * @param {*} target
 * @param {*} arr
 * @returns {*} 
 */
function isEleInArray(target, arr) {
  if (!target || target === document.documentElement) {
    return false;
  }
  if (arr.indexOf(target) !== -1) {
    return true;
  }
  return isEleInArray(target.parentElement, arr);
}

// 计算元素数量
function walkAndCount(target) {
  let eleNum = 0;
  let i = 0;
  if (target && target.nodeType === 1) {
    eleNum += 1;
    const children = target.children;
    const childrenLen = (children && children.length) || 0;
    if (childrenLen > 0) {
      for (; i < children.length; i++) {
        eleNum += walkAndCount(children[i]);
      }
    }
  }
  return eleNum;
}

/**
 * 判断是否在首屏范围内
 *
 * @param {Element} target
 * @returns {*} 
 */
function isInFirstScreen(target: Element) {
  if (!target || typeof target.getBoundingClientRect !== 'function') return false;
  const rect = target.getBoundingClientRect();
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;
  return (
    rect.left >= 0 &&
    rect.left < screenWidth &&
    rect.top >= 0 &&
    rect.top < screenHeight &&
    rect.width > 0 &&
    rect.height > 0
  );
}
