// State
const state = {
    words: ["hello", "world", "this", "is", "monotype"],
    currentWordIndex: 0,
    currentLetterIndex: 0,
    isFocused: false,
    isFinished: false
};

// DOM references
const wordsContainer = document.getElementById('words');
const caret = document.getElementById('caret');
const app = document.getElementById('app');

// Initialization
function initWords() {
    wordsContainer.innerHTML = '';
    
    state.words.forEach((word, wordIdx) => {
        const wordDiv = document.createElement('div');
        wordDiv.classList.add('word');
        wordDiv.dataset.wordIndex = wordIdx;
        
        for(let i = 0; i < word.length; i++) {
            const letterSpan = document.createElement('span');
            letterSpan.classList.add('letter');
            letterSpan.textContent = word[i];
            letterSpan.dataset.letterIndex = i;
            wordDiv.appendChild(letterSpan);
        }
        wordsContainer.appendChild(wordDiv);
    });
    
    updateCaretPosition();
}

// FIX: Using getBoundingClientRect for pixel-perfect caret positioning
function updateCaretPosition() {
    const currentWordDiv = wordsContainer.children[state.currentWordIndex];
    if(!currentWordDiv) return;
    
    const letters = currentWordDiv.querySelectorAll('.letter');
    let targetElement;
    
    if (state.currentLetterIndex < letters.length) {
        targetElement = letters[state.currentLetterIndex];
    } else {
        targetElement = letters[letters.length - 1];
    }
    
    // Get viewport-relative positions
    const targetRect = targetElement.getBoundingClientRect();
    const appRect = app.getBoundingClientRect();
    
    // Calculate relative position
    let x = targetRect.left - appRect.left;
    const y = targetRect.top - appRect.top;
    
    // If caret is at end of word, add the element's width
    if (state.currentLetterIndex >= letters.length) {
        x += targetRect.width;
    }
    
    caret.style.transform = `translate(${x}px, ${y}px)`;
    caret.classList.remove('idle');
}

// Input handler
window.addEventListener('click', () => {
    state.isFocused = true;
    caret.classList.remove('idle');
    document.querySelector('.hint').style.opacity = '0';
});

window.addEventListener('keydown', (e) => {
    if (!state.isFocused || state.isFinished) return;
    
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;

    const currentWord = state.words[state.currentWordIndex];
    const letters = wordsContainer.children[state.currentWordIndex].querySelectorAll('.letter');

    if(e.key === 'Backspace') {
        if (state.currentLetterIndex > 0) {
            state.currentLetterIndex--;
            const letterToDelete = letters[state.currentLetterIndex];

            if (state.currentLetterIndex >= currentWord.length) {
                letterToDelete.remove();
            } else {
                letterToDelete.classList.remove('correct', 'incorrect', 'extra');
            }
        } 
        else if (state.currentWordIndex > 0) {
            state.currentWordIndex--;
            const previousWordText = state.words[state.currentWordIndex];
            state.currentLetterIndex = previousWordText.length;
            
            const prevWordDiv = wordsContainer.children[state.currentWordIndex];
            const extraLetters = prevWordDiv.querySelectorAll('.extra');
            extraLetters.forEach(extraSpan => extraSpan.remove());
            
            prevWordDiv.classList.remove('error');
        }
        
        updateCaretPosition();
        return;
    }

    if(e.key === ' ') {
        e.preventDefault();
        if(state.currentLetterIndex > 0) {
            state.currentWordIndex++;
            state.currentLetterIndex = 0;
            updateCaretPosition();
        }
        return;
    }

    if(e.key.length === 1) {
        if(state.currentLetterIndex < currentWord.length) {
            const expectedChar = currentWord[state.currentLetterIndex];
            const currentLetterSpan = letters[state.currentLetterIndex];
            
            if (e.key === expectedChar) {
                currentLetterSpan.classList.add('correct');
            } else {
                currentLetterSpan.classList.add('incorrect');
            }
            state.currentLetterIndex++;
        } else {
            const extraSpan = document.createElement('span');
            extraSpan.classList.add('letter', 'extra', 'incorrect');
            extraSpan.textContent = e.key;
            wordsContainer.children[state.currentWordIndex].appendChild(extraSpan);
            state.currentLetterIndex++;
        }
        updateCaretPosition();
    }
});

initWords();
caret.classList.add('idle');