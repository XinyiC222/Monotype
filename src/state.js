// State
export const state = {
    words: [],
    activeWord: 0,
    activeLetter: 0,
    isFocused: false,
    isFinished: false,

    //Timer and Test State
    isRunning: false,
    timerLeft: 30,
    timer: null,
    startTime: null //To calc for WPM
};

//export makes data available to other files
export function resetState() {
    state.activeWord = 0;
    state.activeLetter = 0;
    state.isFocused = false;
    state.isFinished = false;
    state.isRunning = false;
    state.timerLeft = 30;
    state.timer = null;
    state.startTime = null;
}