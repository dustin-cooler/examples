import { Component } from 'react';
import PropTypes from 'prop-types';

const PIXI = window.PIXI;

class Sprite extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    texture: PropTypes.object.isRequired,
    addToStage: PropTypes.func.isRequired,
    removeFromStage: PropTypes.func.isRequired,
    button: PropTypes.bool,
    interactive: PropTypes.bool,
    clickHandler: PropTypes.func,
    alpha: PropTypes.number
  }
  constructor(props) {
    super(props);

    this.state = {
      clickHandlersBound: false
    }

    this.mask = new PIXI.Graphics();
    this.mask.isMask = true;

    this.drawMask = this.drawMask.bind(this);
    this.setScale = this.setScale.bind(this);
    this.drawHitArea = this.drawHitArea.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setAlpha = this.setAlpha.bind(this);

    this.sprite = new PIXI.Sprite(this.props.texture);
    this.sprite.position.set(this.props.x, this.props.y);
    this.sprite.anchor.set(0.5, 0.5);
  }

  componentDidMount() {
    this.setScale();
    this.setAlpha();

    if (!isNaN(this.props.width) && !isNaN(this.props.height)) {
      this.drawMask();
    }

    if (this.props.button) {
      this.drawHitArea();
    }

    this.props.addToStage(this.sprite);
  }

  componentWillUnmount() {
    this.props.removeFromStage(this.sprite);
  }

  handleClick(e) {
    if (typeof this.props.clickHandler === 'function') {
      this.props.clickHandler(e);
    }
  }

  setAlpha() {
    this.sprite.alpha = (!isNaN(this.props.alpha)) ? this.props.alpha : 1;
  }

  drawHitArea() {
    if (this.props.button) {
      const w = (!isNaN(this.props.width)) ? Math.round(this.props.width / this.sprite.scale.x) : Math.round(this.sprite.width / this.sprite.scale.x);
      const h = (!isNaN(this.props.height)) ? Math.round(this.props.height / this.sprite.scale.y) : Math.round(this.sprite.height / this.sprite.scale.y);
      const x = w / 2 * -1;
      const y = h / 2 * -1;
      this.sprite.hitArea = new PIXI.Rectangle(x, y, w, h);

      if (this.props.interactive) {
        this.sprite.buttonMode = true;
        this.sprite.interactive = true;
        if (!this.state.clickHandlersBound) {
          this.setState({clickHandlersBound: true});
          this.sprite.on('mousedown', this.handleClick);
          this.sprite.on('touchstart', this.handleClick);
        }
      }
    }

    if (this.state.clickHandlersBound && !this.props.interactive) {
      this.sprite.buttonMode = false;
      this.sprite.interactive = false;
    }
  }

  drawMask() {
    const x = this.props.width / 2 * -1 + this.props.x;
    const y = this.props.height / 2 * -1 + this.props.y;

    this.mask.clear();
    this.mask.drawRect(x, y, this.props.width, this.props.height);
    this.sprite.mask = this.mask;
  }

  setScale() {
    const scaleX = (!isNaN(this.props.scaleX)) ? this.props.scaleX : 1;
    const scaleY = (!isNaN(this.props.scaleY)) ? this.props.scaleY : 1;

    this.sprite.scale.set(scaleX, scaleY);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.scaleX !== prevProps.scaleX || this.props.scaleY !== prevProps.scaleY) {
      this.setScale();
    }
    if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
      this.drawMask();
    }
    if (this.props.texture !== prevProps.texture) {
      this.sprite.texture = this.props.texture
    }
    if (this.props.button !== prevProps.button || this.props.interactive !== prevProps.interactive) {
      this.drawHitArea();
    }
    if (this.props.alpha !== prevProps.alpha) {
      this.setAlpha();
    }
  }

  render() {
    return null;
  }
}

export default Sprite;
