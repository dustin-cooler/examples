import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import shuffle from 'lodash/shuffle';
import filter from 'lodash/filter';
import ConnectCanvas from './Canvas';
import Loading from './Loading';
import Menu from './Menu';
import Button from './Button';
import ConnectCard from './Card';

const PIXI = window.PIXI;

/* App component is the root component
 * It handles game setup, enforces game rules,
 * and determines when to transition between game states
 */

class App extends Component {
  static propTypes = {
    // game state, comes from redux store
    Status: PropTypes.string.isRequired,

    // list of images fetched from Pixabay API, comes from redux store
    Images: PropTypes.arrayOf(PropTypes.object),

    // list of card objects, comes from redux store
    Cards: PropTypes.arrayOf(PropTypes.object),

    // number of times a card has been flipped, comes from redux store
    Turns: PropTypes.number.isRequired,

    // FinishGame action creator
    FinishGame: PropTypes.func.isRequired,

    // ResetCards action creator
    ResetCards: PropTypes.func.isRequired,

    // RemoveCards action creator
    RemoveCards: PropTypes.func.isRequired,

    // SetCardImage action creator
    SetCardImage: PropTypes.func.isRequired,

    // StartGame action creator
    StartGame: PropTypes.func.isRequired
  }

  /* constructor method sets up a few properties and handles method binding
   */
  constructor(props) {
    super(props);

    // background image paths
    this.images = {
      cardBackground: '/inc/images/tic-tac-toe-1954446_640.jpg',
      stageBackground: '/inc/images/elephant-970456_640.jpg'
    }

    // search terms for the Pixabay API
    this.terms = [
      {
        label: 'Animals',
        query: 'animal'
      },
      {
        label: 'Places of Interest',
        query: 'place+of+interest'
      },
      {
        label: 'Landscapes',
        query: 'natural+landscape'
      }
    ];

    // method binding
    this.createBoard = this.createBoard.bind(this);
    this.imagesLoaded = this.imagesLoaded.bind(this);
    this.manageCards = this.manageCards.bind(this);
  }

  /* createBoard method preloads images using PIXI.loader and assigns images to cards
   * param nextProps: (Object) nextProps from componentWillReceiveProps
   */
  createBoard(nextProps) {
    const images = [];

    // we have to reset PIXI.loader on each game reset to prevent duplicate key errors
    PIXI.loader.reset();

    // add background images to PIXI.loader
    PIXI.loader.add('card-background', this.images.cardBackground);
    PIXI.loader.add('stage-background', this.images.stageBackground);

    // Pick random 8 images out of the list returned by the Pixabay API, add each image to the
    // local images array twice, and add each image to PIXI.loader
    shuffle(nextProps.Images.slice(0)).map((img, idx) => {
      if (idx < 8) {
        images.push(img);
        images.push(img);
        PIXI.loader.add('' + img.id, img.previewURL);
      }
    });

    // randomly assign each image to a card
    shuffle(images).map((img, idx) =>
      this.props.SetCardImage(idx, img.id, img.previewURL)
    );

    // load the images
    PIXI.loader.once('complete', this.imagesLoaded);
    PIXI.loader.load();
  }

  /* imagesLoaded method calls the StartGame action creator once the images have been loaded
   */
  imagesLoaded() {
    this.props.StartGame();
  }

  /* manageCards method handles card-related game logic - reset non-matching pairs, remove matching
   * pairs, and end the game when all the cards have been removed from play
   * param nextProps: (Object) nextProps from componentWillReceiveProps
   */
  manageCards(nextProps) {
    let flippedCards = filter(nextProps.Cards, {flipped: true});
    if (flippedCards.length > 1) {

      if (flippedCards[0].imageId === flippedCards[1].imageId) {
        this.props.RemoveCards();
      } else {
        this.props.ResetCards();
      }
    } else {
      if (filter(nextProps.Cards, {visible: true}).length === 0) {
        this.props.FinishGame();
      }
    }
  }

  /* componentWillReceiveProps method - react component lifecycle method, using it to wire game logic methods to props changes
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.Images && nextProps.Images.length > 7 && nextProps.Status === 'createboard') {
      this.createBoard(nextProps);
    }
    if (nextProps.Cards && nextProps.Cards.length && nextProps.Status === 'playing') {
      this.manageCards(nextProps);
    }
  }

  /* render method - react component lifecycle method, renders the game components based on game state
   */
  render() {
    // determine which component to show; using a string instead of assigning components directly to show
    // so that show can also be used as a css className
    let show;
    switch (this.props.Status) {
      case 'playing':
        show = 'canvas';
        break;

      case 'new':
        show = 'new';
        break;

      case 'finished':
        show = 'end';
        break;

      default:
        show = 'loading';
    }
    return (
      <div className={"App " + show}>
        {show === 'loading' ? <Loading /> : '' }
        {show === 'new' ?
          <Menu title="Start Game" className="new-game">
            {this.terms.map((term) =>
              <Button key={term.query} label={term.label} clickHandler={(e) => {e.preventDefault(); this.props.LoadImageList(term.query);}} />
            )}
          </Menu> : ''
        }
        {show === 'end' ?
          <Menu title={"You Finished in " + Math.floor(this.props.Turns / 2) + " Turns"} className="end-game">
            <Button label="Play Again" clickHandler={(e) => {e.preventDefault(); this.props.ResetAll();}} />
          </Menu> : ''
        }
        {show === 'canvas' ?
          <ConnectCanvas width={400} height={400} stageBackground={this.images.stageBackground}>
            {this.props.Cards.map((card, index) => (card.visible) ?
              <ConnectCard key={index} cardBackground={this.images.cardBackground} index={index} {...card} />
               : ''
            )}
          </ConnectCanvas>
           : ''
         }
      </div>
    );
  }
}

// use react-redux's connect to connect redux to the App component

function mapStateToProps ({Status, Images, Cards, Turns}) {
  return {
    Status,
    Images,
    Cards,
    Turns
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const ConnectApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default ConnectApp;
