import { state, resetState } from './state.js';
import { buildWords, getActiveWord, loadWords } from './words.js';
import { render, initFocusUI, updateTimerUI, showResults } from './render.js';

async function initTest() {
    const wordStrings = await loadWords(50);
    state.words = buildWords(wordStrings);
    resetState();
    render();
    updateTimerUI();
}

//Timer Logic
function startTimer() {
    if(state.isRunning) return;

    state.isRunning = true;
    state.startTime = Date.now();

    document.getElementById('timer').classList.add('visible');

    state.timer = setInterval(() => {
        state.timerLeft--;
        updateTimerUI();

        if(state.timerLeft <=0) {
            finishTest();
        }
    }, 1000);
}

function finishTest() {
    clearInterval(state.timer);
    state.isFinished = true;
    state.isRunning = false;
    showResults();
}

window.addEventListener('click', () => {
    state.isFocused = true;
    initFocusUI();
});

window.addEventListener('keydown', (e) => {
    if (state.isFinished) return;

    if(!state.isFocused) {
        state.isFocused = true;
        initFocusUI();
    }
    //handle special keys
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;
    
    //start timer after first valid key
    if (!state.isRunning && e.key.length === 1) {
        startTimer();
    }

    const activeWord = getActiveWord(state);
    
    //handles backspace
    if (e.key === 'Backspace') {
        if (state.activeLetter > 0) {
            state.activeLetter--;
            activeWord.typed.pop();
        } else if (state.activeWord > 0) {
            state.activeWord--;
            const prevWord = state.words[state.activeWord];
            state.activeLetter = prevWord.typed.length;
        }
        render();
        return;
    }
    
    if (e.key === ' ') {
        e.preventDefault();
        if (state.activeLetter > 0 && state.activeWord < state.words.length - 1) {
            state.activeWord++;
            state.activeLetter = 0;
            render();
        }
        return;
    }
    
    if (e.key.length === 1) {
        activeWord.typed.push(e.key);
        state.activeLetter++;
        render();
    }
});

document.fonts.ready.then(() => {
    initTest();
    document.getElementById('caret').classList.add('idle');
})
