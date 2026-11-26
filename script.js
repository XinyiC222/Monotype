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
        // Create a new div for the word
        const wordDiv = document.createElement('div');
        wordDiv.classList.add('word');
        wordDiv.dataset.wordIndex = wordIdx;
        
        // Create a span for each letter
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

// Render Function (Moves the caret)
function updateCaretPosition() {
    const currentWordDiv = wordsContainer.children[state.currentWordIndex];
    if(!currentWordDiv) return;
    
    const letters = currentWordDiv.querySelectorAll('.letter');
    let targetElement;
    
    if (state.currentLetterIndex < letters.length) {
        targetElement = letters[state.currentLetterIndex];
        caret.style.transform = `translate(${targetElement.offsetLeft}px, ${currentWordDiv.offsetTop + targetElement.offsetTop}px)`;
    } else {
        const lastLetter = letters[letters.length - 1];
        const endX = lastLetter.offsetLeft + lastLetter.offsetWidth;
        caret.style.transform = `translate(${endX}px, ${currentWordDiv.offsetTop + lastLetter.offsetTop}px)`;
    }
    
    caret.classList.remove('idle');
}

// Input handler
window.addEventListener('click', () => {
    state.isFocused = true;
    caret.classList.remove('idle');
    document.querySelector('.hint').style.opacity = '0';
});

window.addEventListener('keydown', (e) => {
    // If not focused or finished, do nothing
    if (!state.isFocused || state.isFinished) return;
    
    // Ignore special keys
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;

    const currentWord = state.words[state.currentWordIndex];
    const letters = wordsContainer.children[state.currentWordIndex].querySelectorAll('.letter');

    // Handle Backspace
    if(e.key === 'Backspace') {
        if (state.currentLetterIndex > 0) {
            state.currentLetterIndex--;
            const letterToReset = letters[state.currentLetterIndex];
            letterToReset.classList.remove('correct', 'incorrect', 'extra');
        } else if (state.currentWordIndex > 0) {
            state.currentWordIndex--;

            const previousWordText = state.words[state.currentLetterIndex];
            state.currentLetterIndex = previousWordText.length;

            const prevWordDiv = wordsContainer.children[state.currentWordIndex];

            const extraLetters = prevWordDiv.querySelectorAll('.extra');
            extraLetters.forEach(extraSpan => extraSpan.remove());

            prevWordDiv.classList.remove('error');
        }
        updateCaretPosition();
        return;
    }

    // Handle Space
    if(e.key === ' ') {
        e.preventDefault();
        if(state.currentLetterIndex > 0) {
            state.currentWordIndex++;
            state.currentLetterIndex = 0;
            updateCaretPosition();
        }
        return;
    }

    // Handle regular characters
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
            // Typing extra letters
            const extraSpan = document.createElement('span');
            extraSpan.classList.add('letter', 'extra', 'incorrect');
            extraSpan.textContent = e.key;
            wordsContainer.children[state.currentWordIndex].appendChild(extraSpan);
            state.currentLetterIndex++;
        }
        updateCaretPosition();
    }
});

// Start app
initWords();

// Make caret blink initially
caret.classList.add('idle');