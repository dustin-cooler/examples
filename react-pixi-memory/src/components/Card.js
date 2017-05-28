import { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';

const PIXI = window.PIXI;

class Card extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    remove: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    addToStage: PropTypes.func.isRequired,
    removeFromStage: PropTypes.func.isRequired,
    cardBackground: PropTypes.string.isRequired,
    flipped: PropTypes.bool.isRequired,
    SelectCard: PropTypes.func.isRequired,
    Interactive: PropTypes.bool.isRequired,
    Ticked: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      animating: false,
      animation: 'none',
      start: 0,
      lastframe: 0,
      direction: -1
    }


    this.onClick = this.onClick.bind(this);
    this.delta = this.delta.bind(this);
    this.flip = this.flip.bind(this);
    this.flipEnd = this.flipEnd.bind(this);
    this.fade = this.fade.bind(this);
    this.fadeEnd = this.fadeEnd.bind(this);

    this.duration = 250;

    this.defaultMaskDimensions = {
      x: this.props.x - 40,
      y: this.props.y - 40,
      w: 80,
      h: 80
    }
  }

  componentDidMount() {
    this.textures = {
      cardBackground: PIXI.Texture.fromImage(this.props.cardBackground),
      cardImage: PIXI.Texture.fromImage(this.props.imageUrl)
    }

    this.mask = new PIXI.Graphics();
    this.mask.isMask = true;
    this.mask.drawRect(this.props.x - 40, this.props.y - 40, 80, 80);
    this.mask.dimensions = Object.assign({}, this.defaultMaskDimensions);

    this.sprite = new PIXI.Sprite(this.textures.cardBackground);
    this.sprite.hitArea = new PIXI.Rectangle(-114, -114, 228, 228);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.scale.x = 0.35;
    this.sprite.scale.y = 0.35;
    this.sprite.position.x = this.props.x;
    this.sprite.position.y = this.props.y;
    this.sprite.mask = this.mask;
    this.sprite.interactive = this.props.Interactive;
    this.sprite.buttonMode = this.props.Interactive;
    this.sprite.on('mousedown', this.onClick);
    this.sprite.on('touchstart', this.onClick);
    this.props.addToStage(this.sprite);
  }

  componentWillUnmount() {
    this.props.removeFromStage(this.sprite);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.Interactive !== this.props.Interactive && !this.state.animating) {
      this.sprite.buttonMode = (!nextProps.flipped && nextProps.Interactive);
      this.sprite.interactive = (!nextProps.flipped && nextProps.Interactive);
    }
    if (nextProps.flipped !== this.props.flipped) {
      this.setState({
        animating: true,
        animation: 'flip',
        start: Date.now(),
        lastframe: 0,
        direction: -1
      });
    }
    if (nextProps.remove && nextProps.remove !== this.props.remove) {
      this.setState({
        animating: true,
        animation: 'fade',
        start: Date.now(),
        lastframe: 0,
        direction: -1
      });
    }
    if (nextProps.Ticked !== this.props.Ticked && this.state.animating) {
      if (typeof this[this.state.animation] === 'function') {
        this[this.state.animation]();
      }
    }
  }

  flip() {
    const delta = this.delta();
    if (delta.total > this.duration) {
      this.flipEnd();
      return;
    }

    if (this.state.lastframe === 0) {
      if (this.state.direction > 0) {
        this.sprite.texture = (this.props.flipped) ? this.textures.cardImage : this.textures.cardBackground;
        this.sprite.scale.x = (this.props.flipped) ? 1 : 0.35;
        this.sprite.scale.y = (this.props.flipped) ? 1 : 0.35;
      }
      this.sprite.buttonMode = false;
      this.sprite.interactive = false;
    } else {
      if (this.state.direction < 0) {
        this.mask.dimensions.w -= (80 * (delta.thisframe / this.duration));
        this.mask.dimensions.x += (40 * (delta.thisframe / this.duration));
      } else {
        this.mask.dimensions.w += (80 * (delta.thisframe / this.duration));
        this.mask.dimensions.x -= (40 * (delta.thisframe / this.duration));
      }
      this.mask.clear();
      this.mask.drawRect(this.mask.dimensions.x, this.mask.dimensions.y, this.mask.dimensions.w, this.mask.dimensions.h);
    }
    this.setState({lastframe: Date.now()});
  }

  flipEnd() {
    if (this.state.direction < 0) {
      this.setState({
        animating: true,
        start: Date.now(),
        lastframe: 0,
        direction: 1,
        animation: 'flip'
      });
    } else {
      this.sprite.scale.x = (this.props.flipped) ? 1 : 0.35;
      this.sprite.scale.y = (this.props.flipped) ? 1 : 0.35;
      this.sprite.texture = (this.props.flipped) ? this.textures.cardImage : this.textures.cardBackground;
      this.mask.dimensions = Object.assign({}, this.defaultMaskDimensions);
      this.mask.clear();
      this.mask.drawRect(this.mask.dimensions.x, this.mask.dimensions.y, this.mask.dimensions.w, this.mask.dimensions.h);
      this.sprite.buttonMode = (!this.props.flipped && this.props.Interactive);
      this.sprite.interactive = (!this.props.flipped && this.props.Interactive);
      this.setState({
        animating: false,
        start: 0,
        lastframe: 0,
        direction: -1,
        animation: 'none'
      });
    }
  }

  fade() {
    const delta = this.delta();
    if (delta.total > this.duration) {
      this.fadeEnd();
      return;
    }

    if (this.state.lastframe > 0) {
      if (this.state.direction < 0) {
        this.sprite.alpha -= (1 * (delta.thisframe / this.duration));
        this.mask.dimensions.x += (40 * (delta.thisframe / this.duration));
      } else {
        this.sprite.alpha += (1 * (delta.thisframe / this.duration));
      }
    }
    this.setState({lastframe: Date.now()});
  }

  fadeEnd() {
    if (this.state.direction < 0) {
      this.sprite.alpha = 0;
      this.props.RemoveCard(this.props.index);
    } else {
      this.sprite.alpha = 1;
    }
    this.setState({
      animating: false,
      start: 0,
      lastframe: 0,
      direction: -1,
      animation: 'none'
    });
  }

  delta() {
    return {
      total: Date.now() - this.state.start,
      thisframe: Date.now() - this.state.lastframe
    };
  }

  onClick(event) {
    if (event.currentTarget.buttonMode) {
      this.props.SelectCard(this.props.index);
    }
  }

  render() {
    return null;
  }
}

function mapStateToProps ({Interactive, Ticked}) {
  return {
    Interactive,
    Ticked
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const ConnectCard = connect(mapStateToProps, mapDispatchToProps)(Card);

export default ConnectCard;
