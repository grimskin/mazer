import './App.css';
import { makeCells, getCell, makeKey, makeMaze } from './helpers/maze';
import Cell from "./Cell";

const width = 3;
const height = 3;

const cells = makeCells(width, height);
const maze = makeMaze(cells, width, height);

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
