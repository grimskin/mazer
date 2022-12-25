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
        step: 0,
        onRoute: false,
        label: '',
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

    return {
        key: makeWallKey(x1, y1, x2, y2),
        left: (a1 !== a2) ? getCell(cells, a1, b1) : null,
        right: (a1 !== a2) ? getCell(cells, a2, b2) : null,
        top: (b1 !== b2) ? getCell(cells, a1, b1) : null,
        bottom: (b1 !== b2) ? getCell(cells, a2, b2) : null,
        neighbourA: getCell(cells, a1, b1),
        neighbourB: getCell(cells, a2, b2),
    };
};

const makeWallKey = (x1, y1, x2, y2) => {
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

    return makeKey(a1, b1) + '.' + makeKey(a2, b2);
};

const makeWalls = (maze) => {
    const walls = {};

    for (let x=1; x<=maze.width; x++) {
        for (let y = 1; y <= maze.height; y++) {
            if (x > 1) addWall(walls, makeWall(maze.cells, x-1, y, x, y));
            if (x < maze.width) addWall(walls, makeWall(maze.cells, x, y, x+1, y));
            if (y > 1) addWall(walls, makeWall(maze.cells, x, y-1, x, y));
            if (y < maze.height) addWall(walls, makeWall(maze.cells, x, y, x, y+1));
        }
    }

    return walls;
};

const addWall = (walls, wall) => {
    walls[wall.key] = wall;
};

const makeExit = (maze, cell) => {
    if (cell.x === 1) cell.leftWall = false;
    if (cell.y === 1) cell.topWall = false;
    if (cell.x === maze.width) cell.rightWall = false;
    if (cell.y === maze.height) cell.bottomWall = false;
};

const breakWall = (maze, wall) => {
    if (wall.left) {
        wall.left.rightWall = false;
        wall.right.leftWall = false;
    } else {
        wall.top.bottomWall = false;
        wall.bottom.topWall = false;
    }

    delete maze.walls[wall.key];

    let setA = wall.neighbourA.set;
    let setB = wall.neighbourB.set;
    if (setA > setB) {
        let setC = setA; setA = setB; setB = setC;
    }

    for (let cellId in maze.cells) {
        if (maze.cells[cellId].set === setB) maze.cells[cellId].set = setA;
    }
}

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

const canWalk = (maze, cellA, cellB) => {
    const wallKey = makeWallKey(cellA.x, cellA.y, cellB.x, cellB.y);
    return maze.walls[wallKey] === undefined;
}

const getNeighbourByKey = (maze, cell, neighbourKey, routeOnly) => {
    if (maze.cells[neighbourKey] === undefined) return null;
    if (!routeOnly) return maze.cells[neighbourKey];
    if (canWalk(maze, cell, maze.cells[neighbourKey])) return maze.cells[neighbourKey];
    return null;
}

const getLeftNeighbour = (maze, cell, routeOnly = true) => {
    const key = makeKey(cell.x-1, cell.y);
    return getNeighbourByKey(maze, cell, key, routeOnly);
};
const getRightNeighbour = (maze, cell, routeOnly = true) => {
    const key = makeKey(cell.x+1, cell.y);
    return getNeighbourByKey(maze, cell, key, routeOnly);
};
const getTopNeighbour = (maze, cell, routeOnly = true) => {
    const key = makeKey(cell.x, cell.y-1);
    return getNeighbourByKey(maze, cell, key, routeOnly);
};
const getBottomNeighbour = (maze, cell, routeOnly = true) => {
    const key = makeKey(cell.x, cell.y+1);
    return getNeighbourByKey(maze, cell, key, routeOnly);
};

const getNeighbours = (maze, cell, routeOnly = true) => {
    const result = [];
    let neighbour;

    // eslint-disable-next-line no-cond-assign
    if (neighbour = getLeftNeighbour(maze, cell, routeOnly)) result.push(neighbour);
    if (neighbour = getRightNeighbour(maze, cell, routeOnly)) result.push(neighbour);
    if (neighbour = getTopNeighbour(maze, cell, routeOnly)) result.push(neighbour);
    if (neighbour = getBottomNeighbour(maze, cell, routeOnly)) result.push(neighbour);

    return result;
};

const makeRoute = (maze) => {
    const start = getCell(maze.cells, maze.startX, maze.startY);
    const end = getCell(maze.cells, maze.endX, maze.endY);
    start.step = 1;
    start.onRoute = true;

    const cellsArr = [];
    for (let cellKey in maze.cells) {
        cellsArr.push(maze.cells[cellKey]);
    }

    let stepLimit = maze.width * maze.height - 1;
    while (!end.step && stepLimit) {
        cellsArr.forEach(cell => {
            if (cell.step > 0) return cell;

            const neighbours = getNeighbours(maze, cell);
            if (!neighbours.length) return cell;

            const maxStep = 999999;
            let minStep = maxStep;
            neighbours.forEach(cell => {
                if (cell.step && (cell.step < minStep)) minStep = cell.step;
            });
            if (minStep !== maxStep) cell.step = minStep + 1;
        });

        stepLimit--;
    }

    let route = [end];
    end.onRoute = true;
    let currentCell = end;
    for (let i=end.step-1; i>0; i--) {
        const neighbours = getNeighbours(maze, currentCell);

        let foundCell;
        neighbours.forEach(cell => {
            if (cell.step+1 === (currentCell.step)) foundCell = cell;
        });
        route.push(foundCell);
        foundCell.onRoute = true;
        currentCell = foundCell;
    }
    maze.route = route.reverse();
};

const makeMaze = (width, height, startX, startY, endX, endY) => {
    const maze = {
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        width: width,
        height: height,
        route: [],
    };

    maze.cells = makeCells(width, height);
    const start = getCell(maze.cells, startX, startY);
    start.isStart = true;
    const end = getCell(maze.cells, endX, endY);
    end.isEnd = true;

    makeExit(maze, start);
    makeExit(maze, end);

    maze.walls = makeWalls(maze);

    let wallsArr = [];
    for (let wallId in maze.walls) {
        wallsArr.push(maze.walls[wallId]);
    }
    wallsArr = fisherYatesShuffle(wallsArr);

    let chosenWall;
    // eslint-disable-next-line no-cond-assign
    while (chosenWall = wallsArr.pop()) {
        if (chosenWall.neighbourA.set === chosenWall.neighbourB.set) continue;

        breakWall(maze, chosenWall);
        if (start.set === end.set) break;
    }

    makeRoute(maze);

    return maze;
};

export {
    getCell,
    makeKey,
    makeMaze,
};
