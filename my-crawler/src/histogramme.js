function displayHistogram({ small, medium, long }) {
    const counts = {
        'Petits (<5)': small.length,
        'Moyens (5-9)': medium.length,
        'Longs (≥10)': long.length
    };

    // Trouve la valeur max pour normaliser la taille des barres
    const max = Math.max(...Object.values(counts));

    console.log('Histogramme des longueurs de mots :');
    for (const [label, value] of Object.entries(counts)) {
        const barLength = Math.round((value / max) * 40); // max 40 caractères
        const bar = '█'.repeat(barLength);
        console.log(`${label.padEnd(14)} | ${bar} ${value}`);
    }
}

export { displayHistogram };