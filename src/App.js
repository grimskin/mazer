import './App.css';
import { getCell, makeKey, makeMaze, placeWord, placeLetters } from './helpers/maze';
import Cell from "./Cell";

const width = 10;
const height = 10;

const sx = 1,
        sy = 10,
        ex = 10,
        ey = 1;

const theWord = 'Elizabeth';

const maze = makeMaze(width, height, sx, sy, ex, ey);
placeWord(maze, theWord);
placeLetters(maze, [
    'a', 'o', 'c', 'b', 'n', 'm', 'p', 't', 'w'
]);
const cells = maze.cells;

const placeholder = [];
for (let i=0; i<theWord.length; i++) {
    placeholder.push(
        <div className="cell lw rw tw bw" key={i}></div>
    );
}

function App() {
    let grid = [];

    for (let j=1; j<=height; j++) {
        let row = [];
        for (let i=1; i<=width; i++) {
            row.push(
                <Cell cellData={getCell(cells, i, j)} key={makeKey(i, j)} />
            );
        }
        grid.push(
            <div className="row" key={j}>{row}</div>
        );
    }

    return (
        <div className="App">
            <div className="page-holder">
                <div className="page">
                    {grid}
                    <div className="row spacer"></div>
                    <div className="placeholder-row">
                        {placeholder}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
