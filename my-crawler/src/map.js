function map(texts) {
    const allWords = texts
        .flatMap(text => text.split(/\s+/))         // découpe chaque texte en mots
        .map(word => word.toLowerCase())            // en minuscule
        .map(word => word.replace(/[^a-zàâçéèêëîïôûùüÿñæœ]/gi, '')) // enlève tout sauf lettres
        .filter(Boolean);                           // retire les vides

    const small = [];
    const medium = [];
    const long = [];

    for (const word of allWords) {
        if (word.length >= 10) long.push(word);
        else if (word.length >= 5) medium.push(word);
        else small.push(word);
    }

    return { small, medium, long };
}

export { map };