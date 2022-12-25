import { fisherYatesShuffle } from './fisherYatesShuffle';

const makeCells = (width, height) => {
    const result = {};

    let counter = 1;
    for (let x=1; x<=width; x++) {
        for (let y=1; y<=height; y++) {
            const cell = makeCell(x, y);
            cell.set = counter++;
            setCell(result, x, y, cell);
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
        isStart: false,
        isEnd: false,
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
    
    a1 = String(a1); a2 = String(a2); b1 = String(b1); b2 = String(b2);

    key1 = makeKey(a1, b1);
    key2 = makeKey(a2, b2);

    return {
        key: key1 + '.' + key2,
        left: (a1 !== a2) ? getCell(cells, a1, b1) : null,
        right: (a1 !== a2) ? getCell(cells, a2, b2) : null,
        top: (b1 !== b2) ? getCell(cells, a1, b1) : null,
        bottom: (b1 !== b2) ? getCell(cells, a2, b2) : null,
        neighbourA: getCell(cells, a1, b1),
        neighbourB: getCell(cells, a2, b2),
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

const makeExit = (cell, width, height) => {
    if (cell.x === 1) cell.leftWall = false;
    if (cell.y === 1) cell.topWall = false;
    if (cell.x === width) cell.rightWall = false;
    if (cell.y === height) cell.bottomWall = false;
};

const makeMaze = (width, height, startX, startY, endX, endY) => {
    const maze = {
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
    };

    const cells = makeCells(width, height);
    maze.cells = cells;
    const start = getCell(cells, startX, startY);
    start.isStart = true;
    const end = getCell(cells, endX, endY);
    end.isEnd = true;

    makeExit(start, width, height);
    makeExit(end, width, height);

    maze.walls = makeWalls(cells, width, height);

    const cellsArr = [];
    for (let cellId in maze.cells) {
        cellsArr.push(maze.cells[cellId]);
    }

    let wallsArr = [];
    for (let wallId in maze.walls) {
        wallsArr.push(maze.walls[wallId]);
    }
    wallsArr = fisherYatesShuffle(wallsArr);
    let limit = wallsArr.length - 1;

    while (start.set != end.set && limit > 0) {
        limit--;
        const chosenWall = wallsArr.pop();
            let setA, setB;
            if (chosenWall.left) {
                setA = chosenWall.left.set;
                setB = chosenWall.right.set;
            } else {
                setA = chosenWall.top.set;
                setB = chosenWall.bottom.set;
            }

            if (setA == setB) continue;

            if (chosenWall.left) {
                chosenWall.left.rightWall = false;
                chosenWall.right.leftWall = false;
            } else {
                chosenWall.top.bottomWall = false;
                chosenWall.bottom.topWall = false;
            }

            if (setA > setB) {
                let setC = setA; setA = setB; setB = setC;
            }
            delete maze.walls[chosenWall.key];

            cellsArr.map(cell => {
                if (cell.set == setB) cell.set = setA; return cell;
            });
    }

    return maze;
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
    getCell,
    makeKey,
    makeMaze,
};
