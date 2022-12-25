function Cell({cellData}) {
    let className = 'cell';
    if (cellData.rightWall) className += ' rw';
    if (cellData.leftWall) className += ' lw';
    if (cellData.topWall) className += ' tw';
    if (cellData.bottomWall) className += ' bw';

    return <div className={className}>{cellData.set}</div>;
}

export default Cell;