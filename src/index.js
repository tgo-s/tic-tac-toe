import React from 'react'
import ReactDOM from 'react-dom'
import './index.css';

function Square(props){
    return (
        <button className={props.isWinnerSquare ? "squareWinner" : "square"} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

/* 3.Rewrite Board to use two loops to make the squares instead of hardcoding them. */
class Board extends React.Component {

    handleCheck(element){
        return this.props.winnerSquares.some(v => element === v);
    }
    renderSquare(i, pos, isWinnerSquare) {
        return <Square
                    value={this.props.squares[i]} 
                    onClick={() => this.props.onClick(i,pos)}
                    isWinnerSquare={isWinnerSquare}
                />;
    }

    renderBoard(){
        let cols = Array(3).fill(null);
        let rows = Array(3).fill(null);
        let index = 0;
        let board = rows.map((row, r) => <div className="board-row"> 
                                        { 
                                            cols.map((col, c) => {
                                                     let pos = [r + 1, c + 1];
                                                     let square = this.renderSquare(index, pos, this.handleCheck(index)); 
                                                     index++; 
                                                     return(square)
                                                     })
                                         } 
                                         </div> 
                                );
        return board;
    }

    render(){
        return(
        <div>
            {this.renderBoard()}
        </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: {
                    coord: [null,null],
                    player: "",
                },

            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    /*1.Display the move locations in the format “(1, 3)” in the move list.*/
    handleClick(i, pos){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        
        if(calculateWinner(squares) || squares[i]){
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({history: history.concat([{ squares : squares, position: { coord : pos, player: squares[i] } }]), 
                       stepNumber: history.length,
                       xIsNext: !this.state.xIsNext,
        });
    }

    restartGame(){
        this.setState({
            history: [{
                squares: Array(9).fill(null),
                position: {
                    coord: [null,null],
                    player: "",
                },

            }],
            stepNumber: 0,
            xIsNext: true,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const position = current.position;

        /*
        1.Display the move locations in the format “(1, 3)” in the move list.
        2.Bold the currently selected item in the move list.
        */
        const moves = history.map((step, move) => {
            const desc = move ? "Go to move #" + move + ": " + history[move].position.player + " (" + history[move].position.coord + ")":
                                "Go to game start";
                        return(<li key={move}>
                                    
                                    <button style={move === this.state.stepNumber ? {fontWeight:'bold'} : {}} onClick={() => this.jumpTo(move)}>{desc}</button>
                               </li>);
        });

        let status;
        
        if(winner){
            status = "Winner: " + winner.player;
        } else {
            status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
        }
        return(
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i, pos) => this.handleClick(i, pos)}
                        /* 5.When someone wins, highlight the three squares that caused the win. */
                        winnerSquares={winner ? winner.squares : Array(3).fill(null)}
                     />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
                <div className="game-info">
                    <div>Actions</div>
                    <ol><button onClick={() => this.restartGame()} >Restart</button></ol>
                </div>
            </div>
        );
    }
}


/*------------------------------------*/

/*TODO

    1.Display the move locations in the format “(1, 3)” in the move list. (check)
    2.Bold the currently selected item in the move list. (check)
    3.Rewrite Board to use two loops to make the squares instead of hardcoding them. (check)
    4.Add a toggle button that lets you sort the moves in either ascending or descending order. (uncheck)
    5.When someone wins, highlight the three squares that caused the win. (check)
    6.Add a button to reset and start again
*/

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares){
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for(let i = 0;i< lines.length;i++){
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return ({player: squares[a], squares: [a,b,c] });
        }
    }
    return null;
}

