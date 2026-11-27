import { state, resetState } from './state.js';
import { buildWords, getActiveWord, loadWords } from './words.js';
import { render, initFocusUI } from './render.js';

async function initTest() {
    const wordStrings = await loadWords(25);
    state.words = buildWords(wordStrings);
    resetState();
    render();
}

window.addEventListener('click', () => {
    state.isFocused = true;
    initFocusUI();
});

window.addEventListener('keydown', (e) => {
    if (!state.isFocused || state.isFinished) return;
    //handle special keys
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;
    
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

initTest();
document.getElementById('caret').classList.add('idle');