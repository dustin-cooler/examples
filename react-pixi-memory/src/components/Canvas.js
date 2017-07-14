import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import filter from 'lodash/filter';
import Sprite from './Sprite';

const PIXI = window.PIXI;

class Canvas extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    stageBackground: PropTypes.string.isRequired,
    Tick: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      ready: false
    }

    this.addToStage = this.addToStage.bind(this);
    this.removeFromStage = this.removeFromStage.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    // set up PIXI's canvas
    this.renderer = PIXI.autoDetectRenderer(this.props.width, this.props.height);
    this.renderer.autoResize = true;
    this._canvas.appendChild(this.renderer.view);

    // create the stage
    this.stage = new PIXI.Container();
    this.stage.width = this.props.width;
    this.stage.height = this.props.height;

    this.setState({ready: true});

    this.animate();
  }

  addToStage(child) {
    if (this.state.ready) {
      this.stage.addChild(child);
    }
  }

  removeFromStage(child) {
    if (this.state.ready) {
      this.stage.removeChild(child);
    }
  }

  animate() {
    this.props.Tick();
    this.renderer.render(this.stage);
    this.frame = requestAnimationFrame(this.animate);
  }

  render() {
    return (
      <div id="pixi-canvas" ref={(element) => this._canvas = element}>
        {this.state.ready ?
          <Sprite
            x={this.props.width / 2}
            y={this.props.height / 2}
            texture={PIXI.Texture.fromImage(this.props.stageBackground)}
            addToStage={this.addToStage}
            removeFromStage={this.removeFromStage}
          /> : ''
        }
        {this.props.children.map((child) => (this.state.ready && child) ? React.cloneElement(child, { addToStage: this.addToStage, removeFromStage: this.removeFromStage }) : '')}
      </div>
    );
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const ConnectCanvas = connect(null, mapDispatchToProps)(Canvas);

export default ConnectCanvas;
