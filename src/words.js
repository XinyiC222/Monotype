export function buildWords(wordStrings) {
    return wordStrings.map(wordStr => {
        return {
            chars: [...wordStr],
            typed: [],
            state: 'pending'
        };
    });
}

export function getActiveWord(state) {
    return state.words[state.activeWord];
}

export function wordHasError(word) {
    if (word.typed.length === 0) return false;
    return word.typed.some((char, i) => char !== word.chars[i]);
}