import React from 'react';
import PropTypes from 'prop-types';

/* Button component
 */
const Button = (props) => (
  <button className="btn" onClick={props.clickHandler}>{props.label}</button>
);

Button.propTypes = {
  // button ui text
  label: PropTypes.string.isRequired,

  // function to call when button is clicked
  clickHandler: PropTypes.func.isRequired
}

export default Button;
