import { assignStyle } from "../utils/dom";

export function calcTextRect(text: string, params: { className?: string, style?: Partial<CSSStyleDeclaration> }): { width: number, height: number } {
    const t = document.createElement('span');
    if (params.className) t.className = params.className;
    if (params.style) {
        assignStyle(t, params.style);
    }

    assignStyle(t, {
        position: 'fixed !important',
        left: '-1000px',
        top: '-1000px',
        visibility: 'hidden !important',
        height: 'auto !important',
        width: 'auto !important',
        maxWidth: 'auto !important',
        maxHeight: 'auto !important',
        whiteSpace: 'nowrap !important',
    });

    t.innerText = text;

    const {
        clientWidth,
        clientHeight
    } = t;

    t.remove();

    return {
        width: clientWidth,
        height: clientHeight,
    };
}