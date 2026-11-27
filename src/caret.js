export function calcCaretPosition(targetElement, wrapperElement) {
    const targetRect = targetElement.getBoundingClientRect();
    const wrapperRect = wrapperElement.getBoundingClientRect();
    
    // Calculate relative position
    const x = targetRect.left - wrapperRect.left;
    const y = targetRect.top - wrapperRect.top;

    return {x, y, height: targetRect.height};
}