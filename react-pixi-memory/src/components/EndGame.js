import React from 'react';
import PropTypes from 'prop-types';

/* EndGame component displays final turn count and provides a button to trigger
 * the ResetAll action creator on click, which resets the store to start a new game
 */
const EndGame = (props) => (
  <div className="end-game">
    <h2>You Finished in {Math.floor(props.Turns / 2)} Turns</h2>
    <button className="btn" onClick={ (e) => { e.preventDefault(); props.ResetAll(); } }>Play Again</button>
  </div>
);

EndGame.propTypes = {
  // number of times a card has flipped, divide by 2 to get turn count
  Turns: PropTypes.number.isRequired,

  // ResetAll action creator
  ResetAll: PropTypes.func.isRequired
}

export default EndGame;
