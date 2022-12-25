// Fisher-Yates shuffle implementation
// from https://bost.ocks.org/mike/shuffle/
const fisherYatesShuffle = (array) => {
    let m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
};

module.exports = { fisherYatesShuffle };