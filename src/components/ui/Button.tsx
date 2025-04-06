// src/components/ui/Button.tsx
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { buttonVariants, buttonSizes } from './buttonStyles'; // 👈 import styles

export type BtnSize = 'xs' | 'extra-small' | 'sm' | 'small' | 'md' | 'medium' | 'lg' | 'large';
export type BtnStyle = 'default' | 'primary' | 'danger' | 'emphasis' | 'border' | 'flat' | 'link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  componentClass?: React.ElementType;
  variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'link';
  btnSize?: 'xs' | 'sm' | 'md' | 'lg';
  btnStyle?: BtnStyle;
  active?: boolean;
  hover?: boolean;
  focus?: boolean;
  disabled?: boolean;
  block?: boolean;
  compact?: boolean;
  iconOnly?: boolean;
  dropdownToggle?: boolean;
  className?: string;
  children?: React.ReactNode;
}

class Button extends PureComponent<ButtonProps> {

  static defaultProps = {
    componentClass: 'button',
    type: 'button',
    variant: 'default',
    btnSize: 'md',
    disabled: false,
  };

  render() {
    const {
      className,
      componentClass: Component = 'button',
      type,
      btnSize = 'md',
      variant = 'default',
      active,
      hover,
      focus,
      disabled,
      block,
      compact,
      iconOnly,
      dropdownToggle,
      children,
      ...props
    } = this.props;

    let btnStyle = this.props.btnStyle;

    if (this.props.variant) {
      switch (this.props.variant) {
        case 'primary':
          btnStyle = 'primary';
          break;
        case 'destructive':
          btnStyle = 'danger';
          break;
        case 'outline':
          btnStyle = 'border';
          break;
        case 'link':
          btnStyle = 'link';
          break;
        case 'default':
        default:
          btnStyle = 'default';
          break;
      }
    }

    const classes = classNames(
      'rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      buttonVariants[variant],
      buttonSizes[btnSize],
      className
    );


    return (
      <Component
        {...props}
        type={type}
        className={classes}
        disabled={disabled}
      >
        {children}
      </Component>
    );
  }
}

export default Button;
