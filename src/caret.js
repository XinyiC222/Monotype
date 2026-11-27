export function calcCaretPosition(targetElement, appElement) {
    const targetRect = targetElement.getBoundingClientRect();
    const appRect = appElement.getBoundingClientRect();
    
    // Calculate relative position
    const x = targetRect.left - appRect.left;
    const y = targetRect.top - appRect.top;
    const height = targetRect.height;

    return {x, y, height };
}