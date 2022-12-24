const makeCells = (width, height) => {
    const result = {};

    for (let x=1; x<=width; x++) {
        for (let y=1; y<=height; y++) {
            setCell(result, x, y, makeCell(x, y));
        }
    }

    return result;
};

const makeCell = (x, y) => {
    return {
        x: x,
        y: y,
        rightWall: true,
        leftWall: true,
        topWall: true,
        bottomWall: true,
        set: 1,
    };
};

const makeWall = (cells, x1, y1, x2, y2) => {
    let key1, key2;
    let a1, b1, a2, b2;
    if (y1 < y2) {
        [a1, b1, a2, b2] = [x1, y1, x2, y2];
    } else if (y1 > y2) {
        [a1, b1, a2, b2] = [x2, y2, x1, y1];
    } else if (x1 < x2) {
        [a1, b1, a2, b2] = [x1, y1, x2, y2];
    } else {
        [a1, b1, a2, b2] = [x2, y2, x1, y1];
    }

    key1 = makeKey(a1, b1);
    key2 = makeKey(a2, b2);

    return {
        key: key1 + '.' + key2,
        left: (a1 != a2) ? getCell(cells, a1, b1) : null,
        right: (a1 != a2) ? getCell(cells, a2, b2) : null,
        top: (b1 != b2) ? getCell(cells, a1, b1) : null,
        bottom: (b1 != b2) ? getCell(cells, a2, b2) : null,
    };
};

const makeWalls = (cells, width, height) => {
    const walls = {};

    for (let x=1; x<=width; x++) {
        for (let y = 1; y <= height; y++) {
            if (x > 1) addWall(walls, makeWall(cells, x-1, y, x, y));
            if (x < width) addWall(walls, makeWall(cells, x, y, x+1, y));
            if (y > 1) addWall(walls, makeWall(cells, x, y-1, x, y));
            if (y < height) addWall(walls, makeWall(cells, x, y, x, y+1));
        }
    }

    return walls;
};

const addWall = (walls, wall) => {
    walls[wall.key] = wall;
};

const makeMaze = (cells, width, height) => {
    const walls = makeWalls(cells, width, height);
};

const setCell = (cells, x, y, cell) => {
    let key = makeKey(x, y);
    cells[key] = cell;
};

const getCell = (cells, x, y) => {
    let key = makeKey(x, y);

    return cells[key];
};

const makeKey = (x, y) => {
    return x + '.' + y;
};

export {
    makeCells,
    getCell,
    makeKey,
    makeMaze,
};
