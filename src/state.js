// State
export const state = {
    words: [],
    activeWord: 0,
    activeLetter: 0,
    isFocused: false,
    isFinished: false
};

//export makes data available to other files
export function resetState() {
    state.activeWord = 0;
    state.activeLetter = 0;
    state.isFocused = false;
    state.isFinished = false;
}