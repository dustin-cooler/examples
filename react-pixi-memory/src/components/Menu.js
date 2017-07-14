import React from 'react';
import PropTypes from 'prop-types';

/* Menu component for game menu screens
 */
const Menu = (props) => (
  <div className={props.className}>
    <h2>{props.title}</h2>
    {props.children}
  </div>
);

Menu.propTypes = {
  // css class name for the menu's container div
  className: PropTypes.string.isRequired,

  // menu title text
  title: PropTypes.string.isRequired
}

export default Menu;
