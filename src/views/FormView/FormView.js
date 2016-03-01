/* @flow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { increment, doubleAsync } from '../../redux/modules/counter';
import style from './FormView.scss';
import './FormView.scss';
import {
  TextField
} from 'material-ui';
import $ from 'jquery';
import moment from 'moment';
import classnames from 'classnames';
import loading from '../../static/svg/loading-cylon.svg';
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

// We avoid using the `@connect` decorator on the class definition so
// that we can export the undecorated component for testing.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
export class FormView extends React.Component<void, Props, void> {

  constructor (props) {
    super(props);
    this.contact = {
      address: '50 Castlebrook Ln, Ottawa, ON K2G',
      phone: '613-266-2918'
    };

    this.originalState = {
      totalQuantity: 0,
      totalPrice: 0,
      sendingMail: false,
      mailSent: false,
      init: true,
      items: {
        dish1: {
          name: '凉皮',
          price: 5.99,
          quantity: 0
        },
        dish2: {
          name: '肉夹馍',
          price: 5.99,
          quantity: 0
        },
        dish3: {
          name: '荷叶饼',
          price: 5.99,
          quantity: 0
        },
        dish4: {
          name: '羊肉串',
          price: 5.99,
          quantity: 0
        },
        dish5: {
          name: '岐山面',
          price: 5.99,
          quantity: 0
        }
      },
      nameError: '',
      emailError: '',
      phoneError: '',
      name: '',
      email: '',
      phone: '',
      comment: ''
    };

    this.state = Object.assign({}, this.originalState);
  }

  static propTypes = {
    counter: PropTypes.number.isRequired,
    doubleAsync: PropTypes.func.isRequired,
    increment: PropTypes.func.isRequired
  };

  render () {
    const summaryClass = classnames(
      'summary',
      {
        active: this.state.totalPrice > 0
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
          <div className='title'>小鱼凉皮</div>
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
            <div className='summary3'>Total of {this.state.totalQuantity} {this.state.totalQuantity > 1 ? 'items' : 'item'}: ${this.state.totalPrice.toFixed(2)}</div>
          </div>
          <div className={infoClass}>
            <div className='info-row youyuan'>
              <i className='icons material-icons'>account_circle</i>
              <TextField ref='name' hintText='John Doe' value={this.state.init ? '' : this.state.name} floatingLabelText='姓名' disabled={this.state.sendingMail || this.state.mailSent} errorText={this.state.nameError} onChange={this._setValue.bind(this, 'name')}/>
            </div>
            <div className='info-row youyuan'>
              <i className='icons material-icons'>mail_outline</i>
              <TextField hintText='email@domain.com' value={this.state.init ? '' : this.state.email} floatingLabelText='邮件' disabled={this.state.sendingMail || this.state.mailSent}  errorText={this.state.emailError} onChange={this._setValue.bind(this, 'email')}/>
            </div>
            <div className='info-row youyuan'>
              <i className='icons material-icons'>phone</i>
              <TextField hintText='613-123-4567' value={this.state.init ? '' : this.state.phone} floatingLabelText='电话' disabled={this.state.sendingMail || this.state.mailSent} onChange={this._setValue.bind(this, 'phone')}/>
            </div>
            <div className='info-row youyuan'>
              <i className='icons material-icons' disabled={this.state.sendingMail || this.state.mailSent} >comment</i>
              <TextField
                hintText='Extra spicy'
                floatingLabelText='留言'
                style={{fontFamily: 'YouYuan1d5f112ff218'}}
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
                <div>正在发送 <img src={loading} /></div>
              }
              {
                // !this.state.sendingMail && this.state.mailSent &&
                this.state.sendingMail &&
                <div> 确认您的订单已经成功发送!</div>
              }
              {
                !this.state.sendingMail && !this.state.mailSent &&
                <div> 确认 </div>
              }
            </div>
            {
              // !this.state.sendingMail && this.state.mailSent &&
              this.state.sendingMail &&
              <div className='moreOrder youyuan' onClick={ this._startOver.bind(this) }> 再下一单 </div>
            }
          </div>
          
        </div>
      </div>
    );
  }

  _startOver() {
    // debugger;
    this.setState(this.originalState);
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
          <tr>
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

  _setValue(key, e) {
    const newState = {};
    newState[key] = e.target.value;
    newState.init = false;

    this.setState(newState);
  }

  _checkForm() {
    if (this.state.sendingMail || this.state.mailSent) {
      return;
    }

    if (this.state.name.length < 1) {
      this.setState({
        nameError: 'Please tell me your name'
      });
      return;
    } else {
      this.setState({
        nameError: ''
      });
    }

    if (this.state.email.length < 1 || !validateEmail(this.state.email)) {
      this.setState({
        emailError: 'I need a valid email address from you'
      });
      return;
    } else {
      this.setState({
        emailError: ''
      });
    }

    this.setState({
      sendingMail: true
    });

    let message = `
      <html>
        <head>
          <style>
            html {
              color: #555;
              font-size: 1.1em;
            }
            .customer-info {
              background: #f5f5f5;
              padding: 1em;
            }
            li {
              padding: 10px;
              font-size: 1.1em;
            }
            tr {
              line-height: 30px;
            }
            #navigator {
              display: none;
            }
          </style>
        </head><body>`;
    message += `<div class='customer-info'><ul>`;
    message += `<li>Name: ${this.state.name}</li>`;
    message += `<li>Email: ${this.state.email}</li>`;
    message += `<li>Phone: ${this.state.phone}</li>`;
    message += `<li>Comment: ${this.state.comment}</li>`;
    message += `</ul></div>`;

    message += `
      <table>
        <tr>
          <th>菜品</th>
          <th>数量</th>
        </tr>`;
    Object.keys(this.state.items).map(key => {
      const item = this.state.items[key];
      if (item.quantity > 0) {
        message += `<tr><td>${item.name}</td><td>${item.quantity}</td></tr>`;
      }
    });
    message += `</table>`;
    message += `<div class='total'>共计：$${this.state.totalPrice}</div>`;
    message += `<div id='navigator'>${JSON.stringify(window.navigator)}</div>`;
    message += `</body></html>`;
    $.ajax({
        type: 'POST',
        url: "sendemail.php",
        dataType: 'json',
        data: {
          name: this.state.name,
          email: this.state.email,
          subject: 'Order',
          message: message,
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
