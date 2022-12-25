function Cell({cellData}) {
    let className = 'cell';
    if (cellData.rightWall) className += ' rw';
    if (cellData.leftWall) className += ' lw';
    if (cellData.topWall) className += ' tw';
    if (cellData.bottomWall) className += ' bw';

    if (cellData.onRoute) className += ' route';

    return (
        <div className={className}>
            {/*{cellData.set}*/}
            {/*| {cellData.step}*/}
            <span className="label">{cellData.label}</span>
        </div>
    );
}

export default Cell;