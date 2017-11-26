import React from 'react';
import { Component } from '../utils/';
import Transition from '../transition';
import Popper from '../popper/';
import DatePanelBody from './DatePanelBody';

export default class DatePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { visible, prefixCls, value, onPicked, handleClickOutside } = this.props;
    return (
      <Transition in={visible} sequence="fadeIn">
        <Popper
          className={this.classNames(`${prefixCls}-popper`)}
          clickOutside={handleClickOutside}
        >
          <DatePanelBody value={value} onPicked={onPicked} />
        </Popper>
      </Transition>
    );
  }
}
