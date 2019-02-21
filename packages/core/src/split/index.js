import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style/index.less';

export default class Split extends React.Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragging = this.onDragging.bind(this);
  }
  componentWillUnmount() {
    this.removeEvent();
  }
  removeEvent() {
    window.removeEventListener('mousemove', this.onDragging, false);
    window.removeEventListener('mouseup', this.onDragEnd, false);
  }
  onMouseDown(paneNumber, env) {
    this.paneNumber = paneNumber;
    this.startX = env.clientX;
    this.startY = env.clientY;
    this.move = true;
    this.target = env.target;
    const prevTarget = this.target.previousElementSibling;
    const nextTarget = this.target.nextElementSibling;
    this.preWidth = prevTarget.clientWidth;
    this.nextWidth = nextTarget.clientWidth;
    this.preHeight = prevTarget.clientHeight;
    this.nextHeight = nextTarget.clientHeight;
    window.addEventListener('mousemove', this.onDragging, false);
    window.addEventListener('mouseup', this.onDragEnd, false);
  }
  onDragging(env) {
    if (!this.move) {
      return;
    }
    const { mode, onChange } = this.props;
    const nextTarget = this.target.nextElementSibling;
    const prevTarget = this.target.previousElementSibling;
    const x = env.clientX - this.startX;
    const y = env.clientY - this.startY;
    if (mode === 'horizontal') {
      prevTarget.style.maxWidth = `${this.preWidth + x}px`;
      nextTarget.style.maxWidth = `${this.nextWidth - x}px`;
      onChange && onChange(this.preWidth + x, this.nextWidth - x, this.paneNumber);
    }
    if (mode === 'vertical') {
      prevTarget.style.maxHeight = `${this.preHeight + y}px`;
      nextTarget.style.maxHeight = `${this.nextHeight - y}px`;
      onChange && onChange(this.preWidth + x, this.nextWidth - x, this.paneNumber);
    }
  }
  onDragEnd() {
    this.move = false;
    this.removeEvent();
  }
  render() {
    const { prefixCls, className, children, mode, visiable, disable, ...other } = this.props;
    const cls = classnames(prefixCls, className, `${prefixCls}-${mode}`);
    const child = React.Children.toArray(children);
    return (
      <div className={cls} {...other} ref={node => this.warpper = node}>
        {React.Children.map(child, (element, idx) => {
          const count = React.Children.count(child);
          const props = Object.assign({}, element.props, {
            className: classnames(`${prefixCls}-pane`),
            style: { flexBasis: `${100 / count}%`, ...element.props.style },
          });
          const visiableBar = visiable === true || (visiable && visiable.includes(idx + 1)) ? true : false;
          const barProps = {
            className: `${prefixCls}-bar`,
            onMouseDown: this.onMouseDown.bind(this, idx + 1),
          };
          if (disable === true || (disable && disable.includes(idx + 1))) {
            barProps.className = classnames(`${prefixCls}-bar`, { disable });
            delete barProps.onMouseDown;
          }
          return (
            <React.Fragment>
              {idx !== 0 && visiableBar && React.createElement('div', { ...barProps })}
              {React.cloneElement(element, { ...props })}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

Split.propTypes = {
  prefixCls: PropTypes.string,
  onChange: PropTypes.func,
  disable: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  visiable: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  mode: PropTypes.oneOf(['horizontal', 'vertical']),
};

Split.defaultProps = {
  prefixCls: 'w-split',
  visiable: true,
  mode: 'horizontal',
};