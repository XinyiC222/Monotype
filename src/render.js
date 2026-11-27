import { state } from './state.js';
import { getActiveWord, wordHasError } from './words.js';
import { calcCaretPosition } from './caret.js';

const wordsContainer = document.getElementById('words');
const caret = document.getElementById('caret');
const wordsWrapper = document.getElementById('words-wrapper');

export function renderWords() {
    wordsContainer.innerHTML = '';
    
    state.words.forEach((word, wordIdx) => {
        const wordDiv = document.createElement('div');
        wordDiv.classList.add('word');
        wordDiv.dataset.wordIndex = wordIdx;
        
        if (wordHasError(word)) {
            wordDiv.classList.add('error');
        }
        
        word.chars.forEach((char, letterIdx) => {
            const letterSpan = document.createElement('span');
            letterSpan.classList.add('letter');
            letterSpan.textContent = char;
            letterSpan.dataset.letterIndex = letterIdx;
            
            if (letterIdx < word.typed.length) {
                if (word.typed[letterIdx] === char) {
                    letterSpan.classList.add('correct');
                } else {
                    letterSpan.classList.add('incorrect');
                }
            }
            
            wordDiv.appendChild(letterSpan);
        });
        
        if (word.typed.length > word.chars.length) {
            for (let i = word.chars.length; i < word.typed.length; i++) {
                const extraSpan = document.createElement('span');
                extraSpan.classList.add('letter', 'extra', 'incorrect');
                extraSpan.textContent = word.typed[i];
                wordDiv.appendChild(extraSpan);
            }
        }
        
        wordsContainer.appendChild(wordDiv);
    });
}

export function renderCaret() {
    const currentWordDiv = wordsContainer.children[state.activeWord];
    if (!currentWordDiv) return;
    
    const letters = currentWordDiv.querySelectorAll('.letter');
    let targetElement;
    
    if (state.activeLetter < letters.length) {
        targetElement = letters[state.activeLetter];
    } else {
        targetElement = letters[letters.length - 1];
    }
    
    const { x, y, height } = calcCaretPosition(targetElement, wordsWrapper);
    
    let finalX = x;
    if (state.activeLetter >= letters.length) {
        finalX += targetElement.getBoundingClientRect().width;
    }
    
    caret.style.height = `${height}px`;
    caret.style.transform = `translate(${finalX}px, ${y}px)`;
    caret.classList.remove('idle');
}

export function scrollToActiveLine() {
    const currentWordDiv = wordsContainer.children[state.activeWord];
    if (!currentWordDiv) return;

    const wordTop = currentWordDiv.offsetTop;
    const lineHeight = 1.5 * 1.5 * 16;

    let scrollOffset = 0;
    if(wordTop >= lineHeight) {
        scrollOffset = wordTop;
    }

    wordsContainer.style.transform = `translateY(-${scrollOffset}px)`;
}
export function render() {
    renderWords();
    scrollToActiveLine();
    renderCaret();
}

export function initFocusUI() {
    const hint = document.querySelector('.hint');
    if (hint) hint.style.opacity = '0';
}