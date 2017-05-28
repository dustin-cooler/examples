import React from 'react';
import PropTypes from 'prop-types';

/* NewGame component displays a set of buttons built from the terms prop which trigger
 * the LoadImagesList action creator on click
 */
const NewGame = (props) => (
  <div className="new-game">
    <h2>Start A New Game</h2>
    {props.terms.map((term) =>
      <button className="btn" key={term.query} onClick={ (e) => { e.preventDefault(); props.LoadImageList(term.query); } }>
        {term.label}
      </button>
    )}
  </div>
);

NewGame.propTypes = {
  // array of search terms
  terms: PropTypes.array.isRequired,

  // LoadImageList action creator
  LoadImageList: PropTypes.func.isRequired
}

export default NewGame;
