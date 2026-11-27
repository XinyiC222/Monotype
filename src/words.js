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

export async function loadWords(count) {
    try {
        const response = await fetch('./src/data/english.json')
        const data = await response.json()

        const allWords = data.commonWords;

        const chosenWords= [];
        for(let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * allWords.length);
            chosenWords.push(allWords[randomIndex].trim());
        }
        return chosenWords;
    } catch(error) {
        console.error("failed to load words:", error);
        return ["error", "loading", "words", "check", "console"];
    }
}