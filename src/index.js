import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const colors = {
  available : 'lightgray',
  used: 'lightgreen',
  wrong : 'lightcoral',
  candidate : 'deepskyblue',
};

const PlayNumber = (props) => (
  <button className="number" 
  style={{ backgroundColor : colors[props.status]}} 
  onClick={() => props.onClick(props.number, props.status)} 
  >{props.number}</button>
);

const DisplayStars = (props) => (
  utils.range(1,props.count).map(i => <div key={i} className="star" />)
);

const PlayAgain = (props) => (
  <div className="game-done">
  <div 
    className="message"
    style={{ color: props.gameStatus === 'lost' ? 'red' : 'green'}}
  >
    {props.gameStatus === 'lost' ? 'Game Over' : 'Nice'}
  </div>
  <button onClick={props.onClick}>Play Again</button>
</div>
);

const useGameState = () => {
  const [stars, setstars] = useState(utils.random(1,9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [availableNums, setAvailableNums] = useState(utils.range(1,9));
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if(seconds>0 && availableNums.length > 0){
      const timerId  =setTimeout(() => {
        setSeconds(seconds-1);
      },1000);
      return () => clearTimeout(timerId);
    }
  });

  const setGameState = (newCandidate) => {
    if(utils.sum(newCandidate) !== stars){
      setCandidateNums(newCandidate);
    }else{
      const newAvailable = availableNums.filter(num => !newCandidate.includes(num));
      setstars(utils.randomSumIn(newAvailable,9));
      setAvailableNums(newAvailable);
      setCandidateNums([]);
    }
  }
  return { stars, availableNums, candidateNums, seconds, setGameState };
}

const Game = (props) => {
  const {
    stars,
    availableNums,
    candidateNums,
    seconds,
    setGameState,
  } = useGameState();
  
  const candidateSumGreater = utils.sum(candidateNums) > stars;

  const handleClick = (number, currStatus) => {
    //console.log(availableNums.length);
    if(currStatus === 'used' || gameStatus !== 'active'){
      return;
    }
    const newCandidate = currStatus === 'available' ? candidateNums.concat(number) : candidateNums.filter(i => i !== number);
    setGameState(newCandidate);
  }

  const gameStatus = availableNums.length === 0 ? 'won' : seconds === 0 ? 'lost' : 'active';

  const numberStatus = (number) => {
    if(!availableNums.includes(number)){
      return 'used';
    }
    else{
      if(candidateNums.includes(number)){
        return candidateSumGreater ? 'wrong' : 'candidate';
      }
      else{
        return 'available';
      }
    }
  }

  // const handlePlayAgainClick = () =>{
  //   setAvailableNums(utils.range(1,9));
  //   setCandidateNums([]);
  //   setstars(utils.random(1,9));
  //   setSeconds(10);
  // }

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the numbers of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !=='active' ? <PlayAgain onClick={props.newGame} gameStatus={gameStatus} /> : <DisplayStars count={stars} />}
        </div>
        <div className="right">
          {utils.range(1,9).map(number => 
          <PlayNumber key={number} number={number} status={numberStatus(number)} onClick={handleClick} /> )}
        </div>
      </div>
      <div className="timer">Time Remaining : {seconds}</div>
    </div>
  );
};

const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  return (<Game key={gameId} newGame={() => setGameId(gameId+1)} />); //to unmount and remount the game
}

const utils = {
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

ReactDOM.render(<StarMatch />, document.getElementById('root'));
