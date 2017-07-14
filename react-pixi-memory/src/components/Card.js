import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import Sprite from './Sprite';

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

    this.textures = {
      cardBackground: PIXI.Texture.fromImage(this.props.cardBackground),
      cardImage: PIXI.Texture.fromImage(this.props.imageUrl)
    }

    this.state = {
      animating: false,
      animation: 'none',
      start: 0,
      lastframe: 0,
      direction: -1,
      width: 80,
      height: 80,
      scaleX: 0.35,
      scaleY: 0.35,
      texture: this.textures.cardBackground,
      alpha: 1
    }

    this.delta = this.delta.bind(this);
    this.flip = this.flip.bind(this);
    this.flipEnd = this.flipEnd.bind(this);
    this.fade = this.fade.bind(this);
    this.fadeEnd = this.fadeEnd.bind(this);
    this.onClick = this.onClick.bind(this);

    this.duration = 250;
  }

  componentWillReceiveProps(nextProps) {
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
        const texture = (this.props.flipped) ? this.textures.cardImage : this.textures.cardBackground;
        const scaleX = (this.props.flipped) ? 1 : 0.35;
        const scaleY = (this.props.flipped) ? 1 : 0.35;
        this.setState({texture, scaleX, scaleY});
      }
    } else {
      let width = this.state.width;
      if (this.state.direction < 0) {
        width -= (80 * (delta.thisframe / this.duration));
      } else {
        width += (80 * (delta.thisframe / this.duration));
      }
      this.setState({width});
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
      const scaleX = (this.props.flipped) ? 1 : 0.35;
      const scaleY = (this.props.flipped) ? 1 : 0.35;
      const texture = (this.props.flipped) ? this.textures.cardImage : this.textures.cardBackground;
      const width = 80;
      this.setState({
        animating: false,
        start: 0,
        lastframe: 0,
        direction: -1,
        animation: 'none',
        scaleX,
        scaleY,
        texture,
        width
      });
    }
  }

  fade() {
    const delta = this.delta();
    if (delta.total > this.duration) {
      this.fadeEnd();
      return;
    }

    let alpha = this.state.alpha
    if (this.state.lastframe > 0) {
      if (this.state.direction < 0) {
        alpha -= (1 * (delta.thisframe / this.duration));
      } else {
        alpha += (1 * (delta.thisframe / this.duration));
      }
    }
    this.setState({alpha, lastframe: Date.now()});
  }

  fadeEnd() {
    if (this.state.direction < 0) {
      this.setState({alpha: 0});
      this.props.RemoveCard(this.props.index);
    } else {
      this.setState({alpha: 1});
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
    return (
      <Sprite
        button={true}
        interactive={(this.props.Interactive && !this.state.animating && !this.props.flipped)}
        width={this.state.width}
        height={this.state.height}
        x={this.props.x}
        y={this.props.y}
        scaleX={this.state.scaleX}
        scaleY={this.state.scaleY}
        texture={this.state.texture}
        addToStage={this.props.addToStage}
        removeFromStage={this.props.removeFromStage}
        alpha={this.state.alpha}
        clickHandler={this.onClick}
      />
    );
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
