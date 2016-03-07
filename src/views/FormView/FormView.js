/* @flow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { increment, doubleAsync } from '../../redux/modules/counter';
import style from './FormView.scss';
import './FormView.scss';
import {
  TextField,
  SelectField,
  MenuItem
} from 'material-ui';
import $ from 'jquery';
import moment from 'moment';
import classnames from 'classnames';
import loading from '../../static/svg/loading-cylon.svg';
import xiaoyuliangpi from '../../static/xiaoyuliangpi.png';
import { createClass } from 'asteroid';

// We can use Flow (http://flowtype.org/) to type our component's props
// and state. For convenience we've included both regular propTypes and
// Flow types, but if you want to try just using Flow you'll want to
// disable the eslint rule `react/prop-types`.
// NOTE: You can run `npm run flow:check` to check for any errors in your
// code, or `npm i -g flow-bin` to have access to the binary globally.
// Sorry Windows users :(.
type Props = {
  counter: number,
  doubleAsync: Function,
  increment: Function
};

const Asteroid = createClass();
// Connect to a Meteor backend
const asteroid = new Asteroid({
    // endpoint: 'ws://localhost:8080/websocket'
  endpoint: 'ws://prj-sm.herokuapp.com/websocket'
});
// Use real-time collections
asteroid.subscribe('tasks');

asteroid.ddp.on('added', ({collection, id, fields}) => {
    console.log(`Element added to collection ${collection}`);
    console.log(id);
    console.log(fields);
});

// We avoid using the `@connect` decorator on the class definition so
// that we can export the undecorated component for testing.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
export class FormView extends React.Component<void, Props, void> {

  constructor (props) {
    super(props);
    this.originalState = {
      totalQuantity: 0,
      totalPrice: 0,
      sendingMail: false,
      mailSent: false,
      init: true,
      items: {},
      nameError: '',
      emailError: '',
      phoneError: '',
      name: '',
      email: '',
      phone: '',
      comment: ''
    };

    this.contact = {
      address: '50 Castlebrook Ln, Ottawa, ON K2G',
      phone: '613-266-2918'
    };

    this.pickupTimes = ['上午取 (11:00 - 13:00)', '下午取 (16:00 - 18:00)'];

    this.state = Object.assign({}, this.originalState);
  }

  static propTypes = {
    counter: PropTypes.number.isRequired,
    doubleAsync: PropTypes.func.isRequired,
    increment: PropTypes.func.isRequired
  };

  componentWillMount() {
    const setState = function(result) {
      let items = {};
      result.forEach((item, idx) => {
        item.quantity = 0;
        items[`dish${idx}`] = item;
      });
      this.items = items;

      this.originalState.items = items,
      this.setState({
        items: items
      });

    }.bind(this);

    asteroid.call('getDishes', 'xiaoyuliangpi')
      .then(result => {
        console.log('Success');
        console.log(result);
       
        setState(result);
          
      })
      .catch(error => {
        console.log('Error');
        console.error(error);
      });
  }

  render () {
    const summaryClass = classnames(
      'summary',
      {
        active: this.state.totalPrice > 0
      }
    );

    const errorClass = classnames(
      'error',
      {
        active: this.state.orderError
      }
    );

    const infoClass = classnames(
      'info',
      {
        'summary-active': this.state.totalPrice > 0
      }
    );

    const submitClass = classnames(
      'submit',
      'youyuan',
      {
        active: this.state.dataReady
      }
    );

    const contactClass = classnames(
      'contact',
      {
        'data-ready': this.state.dataReady
      }
    );

    return (
      <div id='form'>
        <div className='nav'>
        <img className='logo' src={xiaoyuliangpi} />
          <div className='contact'>
            <div className='address'>
              <i className='material-icons'>location_on</i>
              {this.contact.address}
            </div>
            <div className='phone'>
              <i className='material-icons'>local_phone</i>
              <a href={'tel:' + this.contact.phone}>{this.contact.phone}</a>
            </div>
          </div>
        </div>
        <div className='banner'>网络订单一律享受10%折扣</div>
        <div className='form container-fluid'>

          <div className='menu'>
            <table className='col-sm-12'>
              <thead>
                <tr>
                  <th className='youyuan'>菜品</th>
                  <th className='youyuan'>数量</th>
                  <th className='youyuan'>价格</th>
                </tr>
              </thead>
              <tbody>
              {
                this._renderRows()
              }
              </tbody>
            </table>
          </div>
          <div className={summaryClass}>
            <div className='summary3'>总数: {this.state.totalQuantity} 共计: ${this.state.totalPrice.toFixed(2)}</div>
          </div>
          <div className={errorClass}>
            <div className='statement'>{this.state.orderError}</div>
          </div>
          <div className={infoClass}>
            <div className='info-row youyuan'>
              <i className='icons material-icons'>phone</i>
              <TextField hintText='613-123-4567' value={this.state.init ? '' : this.state.phone} floatingLabelText='电话' disabled={this.state.sendingMail || this.state.mailSent} errorText={this.state.phoneError} onChange={this._setValue.bind(this, 'phone')}/>
            </div>
            <div className='info-row youyuan'>
              <i className='icons material-icons'>event</i>
              <SelectField value={this.state.init ? '' : this.state.pickup} errorText={this.state.pickupError} floatingLabelText="取货时间" onChange={this._setValue.bind(this, 'pickup')}>
                {
                  this._renderPickupTimes()
                }
              </SelectField>
            </div>
            <div className='info-row youyuan'>
              <i className='icons material-icons' disabled={this.state.sendingMail || this.state.mailSent} >comment</i>
              <TextField
                hintText='加辣'
                floatingLabelText='备注 (可不填)'
                multiLine={true}
                rows={1}
                disabled={this.state.sendingMail || this.state.mailSent} 
                value={this.state.comment}
                onChange={this._setValue.bind(this, 'comment')} />
            </div>
          </div>
          <div className={submitClass}>
            <div className='button youyuan' onClick={this._checkForm.bind(this)} disabled={this.state.sendingMail || this.state.mailSent} >
              {
                this.state.sendingMail &&
                <div className='youyuan'>正在发送 <img src={loading} /></div>
              }
              {
                !this.state.sendingMail && this.state.mailSent &&
                <div className='youyuan'> 确认您的订单已经成功发送!</div>
              }
              {
                !this.state.sendingMail && !this.state.mailSent &&
                <div className='youyuan'> 确认 </div>
              }
            </div>
            {
              !this.state.sendingMail && this.state.mailSent &&
              <div className='moreOrder youyuan' onClick={ this._startOver.bind(this) }> 再下一单 </div>
            }
          </div>
          
        </div>
      </div>
    );
  }

  _startOver() {
    Object.keys(this.originalState.items).forEach(key => {
      this.originalState.items[key].quantity = 0;
    });
    this.setState(this.originalState);
  }

  _renderPickupTimes() {
    return (
      this.pickupTimes.map((time, idx) => {
        return <MenuItem value={idx} primaryText={time} />;
      })
    );
  }

  _renderRows() {
    return (
      Object.keys(this.state.items).map(key => {
        const item = this.state.items[key];

        const quantityClass = classnames(
          'quantity',
          {
            inactive: item.quantity === 0
          }
        );

        const removeControlClass = classnames(
          'control',
          {
            active: item.quantity > 0
          }
        );

        return (
          <tr key={key}>
            <td className='item youyuan'>{item.name}</td>
            <td className='qty'>
              <div>
                <input type='text' size='2' maxLength='2' value={item.quantity}/>
              </div>
              <div className={removeControlClass} onClick={this._removeOrder.bind(this, key)}>
                <i className='material-icons remove'>remove_circle</i>
              </div>
            </td>
            <td className='price'>${item.price}</td>
            <td className='controls'>
              <div className='control' onClick={this._addOrder.bind(this, key)}>
                <i className='add material-icons'>add_circle</i>
              </div>

            </td>
          </tr>
        );
      })
    );
  }

  _setValue(key, e, value) {
    const newState = {};
    newState[key] = value !== undefined ? value : e.target.value;
    newState.init = false;
    console.debug('>>>', newState);
    this.setState(newState);
  }

  _checkForm() {
    if (this.state.sendingMail || this.state.mailSent) {
      return;
    }

    if (this.state.totalQuantity < 1) {
      this.setState({
        orderError: '您忘了点菜啦'
      });
      return;
    } else {
      this.setState({
        orderError: ''
      });
    }

    if (this.state.phone.length !== 10) {
      this.setState({
        phoneError: '请检查您输入的电话号码'
      });
      return;
    } else {
      this.setState({
        phoneError: ''
      });
    }

    if (this.state.pickup === undefined) {
      this.setState({
        pickupError: '请选择取货时间'
      });
      return;
    } else {
      this.setState({
        pickupError: ''
      });
    }

    // if (this.state.name.length < 1) {
    //   this.setState({
    //     nameError: '请输入您的姓名'
    //   });
    //   return;
    // } else {
    //   this.setState({
    //     nameError: ''
    //   });
    // }

    // if (this.state.email.length < 1 || !validateEmail(this.state.email)) {
    //   this.setState({
    //     emailError: '请输入正确邮件地址'
    //   });
    //   return;
    // } else {
    //   this.setState({
    //     emailError: ''
    //   });
    // }

    this.setState({
      sendingMail: true
    });

    let message = `\n\n`;
    message += `订单客户信息:\n---------------------\n`;
    message += `姓名: ${this.state.name}\n`;
    message += `邮件: ${this.state.email}\n`;
    message += `电话: ${this.state.phone}\n`;
    message += `备注: ${this.state.comment}\n`;
    message += `取货时间: ${this.state.pickup}\n`;

    message += `\n订单:\n-----------------------------------------------\n`;
    Object.keys(this.state.items).map(key => {
      const item = this.state.items[key];
      if (item.quantity > 0) {
        message += `${item.name} x ${item.quantity}\n`;
      }
    });
    message += `\n-----------------------------------------------\n`;
    message += `共计：$${this.state.totalPrice}\n`;

    const order = {
      items: this.state.items,
      customer: {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone
      },
      comment: this.state.comment,
      pickup: this.pickupTimes[this.state.pickup],
      totalPrice: this.state.totalPrice,
      totalQuantity: this.state.totalQuantity,
      owner: 'xiaoyuliangpi',
    };

    const setState = function() {
      this.setState({
        mailSent: true,
        sendingMail: false
      });

    }.bind(this);

    asteroid.call('addOrder', order)
      .then(result => {
        console.log('Success');
        console.log(result);
        
        setState();

        // asteroid.call('sendEmail', this.state.email, 'xiaofany@hotmail.com', 'Order', message})
        //   .then(result => {
        //     console.log('Success');
        //     console.log(result);
        //   })
        //   .catch(error => {
        //     console.log('Error');
        //     console.error(error);
        //   });

      })
      .catch(error => {
        console.log('Error');
        console.error(error);
      });

    $.ajax({
        type: 'POST',
        url: 'sendemail.php',
        dataType: 'json',
        data: {
          name: this.state.name,
          email: this.state.email,
          subject: 'Order',
          message: message,
          navigator: JSON.stringify({
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            appVersion: navigator.appVersion
          })
        },
        success: (data, textStatus, jqXHR) => {
          this.setState({
            mailSent: true,
            sendingMail: false
          });
        }
    });

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }

  _addOrder(key) {
    if (this.state.sendingMail || this.state.mailSent) {
      return;
    }

    this.state.items[key].quantity++;

    this.setState({
      totalQuantity: ++this.state.totalQuantity,
      totalPrice: this.state.totalPrice + this.state.items[key].price,
      items: this.state.items,
      orderError: ''
    });
  }

  _removeOrder(key) {
    if (this.state.sendingMail || this.state.mailSent) {
      return;
    }

    if (this.state.items[key].quantity === 0) {
      return;
    }

    this.state.items[key].quantity--;
    this.setState({
      totalQuantity: --this.state.totalQuantity,
      totalPrice: this.state.totalPrice - this.state.items[key].price,
      items: this.state.items
    });
  }
}

const mapStateToProps = (state) => ({
  counter: state.counter
});
export default connect((mapStateToProps), {
  increment: () => increment(1),
  doubleAsync
})(FormView);
