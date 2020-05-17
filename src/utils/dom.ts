
export function stringifyQueryParams(params: { [x: string]: any }): string {
    return Object.entries(params).map(([ k, v ]) => {
        if (typeof v === 'object') return `${k}=${encodeURIComponent(JSON.stringify(v))}`;
        else return `${k}=${encodeURIComponent(v === undefined ? 'true' : `${v}`)}`;
    }).join('&');
}

export function parseQueryParams(x: string): { [x: string]: any } {
    if (!x) return {};
    if (x.startsWith('?')) x = x.substr(1);
    const kvs = x.split('&');
    if (kvs.length === 0) return {};
    return kvs.reduce((sum, kv) => {
        let [k,v] = kv.split('=') as any;

        v = decodeURIComponent(v);

        if (!v) {
            v = true;
        }
        else if (/^-?\d*\.?\d*$/.test(v)) {
            v = Number.parseFloat(v);
        }
        else if (v.startsWith('{') && v.endsWith('}')) {
            v = JSON.parse(v);
        }

        return Object.assign(sum, { [k]: v });
    }, {});
}

export function urlWithCurrentQuery(newUrl: string) {
    return newUrl + location.search;
}

export function appendRouteParams(params: any) {
    const curRouteParams = parseQueryParams(location.search);
    return stringifyQueryParams({ ...curRouteParams, ...params });
}

export function bringElementToFront(lastElementOfType: Element, el: Element) {
  if (lastElementOfType.nextElementSibling) {
      el.parentNode!.insertBefore(el, lastElementOfType.nextElementSibling);
  } else {
      el.parentNode!.appendChild(el);
  }
}

/**
* Call `onParent` for every parent.  
* Stops when `onParent` returns true.  
* Returns last found `parent`.
* 
* Example (find parent with class):
* ```js
* const gridLayerTarget = domBlobUp(evt.target as any, (n) => {
*    return n.classList.contains(GRID_LAYER_HELPER_CLASS);
* });
* ```
*/
export function domBlobUp(from: HTMLElement, onParent: (n: HTMLElement) => void|boolean): HTMLElement {
  while (from !== document.body) {
      from = from.parentNode! as HTMLElement;
      if (onParent(from)) return from;
  }
  return from;
}

export function isInTreeDOM(rootEl: Node, clicked: Node): boolean {
  while (clicked !== rootEl && clicked !== document.body && clicked !== null) {
      clicked = clicked.parentNode!;
  }

  return clicked === rootEl;
}
