import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


function Square(props) {
    let bgcolor = props.value ? 'black' : 'white' // Fait perdre de la vitesse
    return (
        <button className="square" onClick={props.onClick} style={{backgroundColor: bgcolor}}> 
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (<Square key={i}
            value={this.props.squares[i]} // Tout ça sera des Props passés lors de la création du composant
            onClick={()=> this.props.onClick(i)} // Tout ça sera des Props passés lors de la création du composant
            />
        );
      }

    renderLine(l) {
        const row = this.props.size;
        const final_row = []
        for (let j=0; j<row; j++) {
            final_row.push(this.renderSquare(l*row+j))
        }

        return(
            <div key={'l'+l} className="board-row">
                {final_row}
            </div>
        )
    }
    
    render() {
        const lines = this.props.size;
        const final_table = []
        for (let l=0; l<lines; l++) {
            final_table.push(this.renderLine(l))
        }
        return (
            <div>
                {final_table}
            </div>
        );
      }
    }


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(props.size*props.size).fill(null)
            }],
            size: props.size,
            list_of_neighbors: calculateAllNeighbors(props.size)
        }
    }

    handleClick(i) {
        const history = this.state.history.slice();
        const current = history[history.length-1];
        const squares = current.squares.slice(); // Jamais travailler directement sur le state
        squares[i] = squares[i] ? null : 'X';
        this.setState({
            history: history.concat([{
            squares: squares,
            }]),
        });
    }

    forward() {
        const history = this.state.history.slice();
        const current = history[history.length-1];
        const squares = current.squares.slice();

        const new_grid = squares.map((square, index) => {
            let val = square
            const neigh_list = this.state.list_of_neighbors[index].slice()
            let counter = 0;
            for (let neigh of neigh_list) {
                if (squares[neigh]) {
                    counter += 1;
                }
            }
            if (square && !(counter === 2 || counter === 3)) {
                val=null;
            }
            else if (!square && counter === 3) {
                val='X'
            }
            return val;
        });
        this.setState({
            history: history.concat([{
            squares: new_grid,
            }]),
        });
    }

    reset_filled() {
        const history = this.state.history.slice();
        const squares = Array.from({length: this.state.size*this.state.size}, () => Math.random()>0.5 ? 'X' : null);
        this.setState({
            history: history.concat([{
            squares: squares,
            }]),
        });
    }


    render () {
        const history = this.state.history;
        const current = history[history.length-1];
        return (
            <div className="game">
                <div className="game-board">
                    <Board size = {this.state.size} squares = {current.squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div>
                <button onClick={()=> this.forward()}>FORWARD !!</button>
                <button onClick={()=> this.reset_filled()}>RESET FILLED !!</button>
                </div>
            </div>
        )
    }
}


  // MAIN RENDER ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game size={50} />);

 // HELPER ========================================

  function calculateAllNeighbors(size) {
    const neighbors_list = [];
    for (let i=0; i<size*size; i++) {
        const neighbors = [];
        for (let w=-1; w<2; w++) {
            for (let h=-1; h<2; h++) {
                if (!(h === 0 && w === 0)) {
                    let calcVal = i+h*size+w

                    if (i%size === 0 && w===-1) {
                        calcVal += size
                    }

                    if ((i+1)%size === 0 && w===+1) {
                        calcVal -= size
                    }

                    if (i<size && h===-1) {
                        calcVal += size*(size)
                    }

                    if (i>size*(size-1) && h===+1) {
                        calcVal -= size*(size)
                    }

                    neighbors.push(calcVal)
                }
            }
        }
        neighbors_list.push(neighbors);
    }
    return neighbors_list;

  }