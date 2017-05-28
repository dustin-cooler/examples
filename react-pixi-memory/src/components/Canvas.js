import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import filter from 'lodash/filter';

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

    this.unaddedChildren = [];
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


    const stageTexture = PIXI.Texture.fromImage(this.props.stageBackground)

    this.background = new PIXI.Sprite(stageTexture);
    this.background.anchor.x = 0.5;
    this.background.anchor.y = 0.5;
    this.background.position.x = this.props.width / 2;
    this.background.position.y = this.props.height / 2;
    this.stage.addChild(this.background);

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
        {this.props.children.map((child) => (this.state.ready) ? React.cloneElement(child, { addToStage: this.addToStage, removeFromStage: this.removeFromStage }) : '')}
      </div>
    );
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const ConnectCanvas = connect(null, mapDispatchToProps)(Canvas);

export default ConnectCanvas;
