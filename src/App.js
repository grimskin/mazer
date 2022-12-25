import './App.css';
import { getCell, makeKey, makeMaze } from './helpers/maze';
import Cell from "./Cell";

const width = 9;
const height = 9;

const sx = 5,
        sy = 1,
        ex = 5,
        ey = 9;

const maze = makeMaze(width, height, sx, sy, ex, ey);
const cells = maze.cells;

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
                </div>
            </div>
        </div>
    );
}

export default App;
