/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { increment, doubleAsync } from '../../redux/modules/counter'
import style from './FormView.scss'
import {
  TextField
} from 'material-ui'
import $ from 'jquery'
import moment from 'moment'
import loading from '../../static/svg/loading-cylon.svg'
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
    super(props)
    this.contact = {
      address: '50 Castlebrook Ln, Ottawa, ON K2G',
      phone: '613-266-2918'
    }

    this.originalState = {
      totalQuantity: 0,
      totalPrice: 0,
      sendingMail: false,
      mailSent: false,
      init: true,
      items: {
        dish1: {
          name: 'Dish 1',
          price: 5.99,
          quantity: 0
        },
        dish2: {
          name: 'Dish 2',
          price: 5.99,
          quantity: 0
        },
        dish3: {
          name: 'Dish 3',
          price: 5.99,
          quantity: 0
        },
        dish4: {
          name: 'Dish 4',
          price: 5.99,
          quantity: 0
        },
        dish5: {
          name: 'Dish 5',
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
    }

    this.state = Object.assign(this.originalState);
  }

  static propTypes = {
    counter: PropTypes.number.isRequired,
    doubleAsync: PropTypes.func.isRequired,
    increment: PropTypes.func.isRequired
  };

  render () {
    return (
      <div id='form' className={style.form}>
        <div className={style.menu + ' row'}>
          <ul className='col-sm-12'>
            {
              this._renderItems()
            }
          </ul>
        </div>
        <div className={this.state.totalPrice > 0 ? style.summary : style.summary + ' ' + style.inactive}>
          <div className={style.summary3}>Total of {this.state.totalQuantity} items: ${this.state.totalPrice.toFixed(2)}</div>
        </div>
        <div className={style.info}>
          <div className={style.row}>
            <i className={style.icons + ' material-icons'}>account_circle</i>
            <TextField ref='name' hintText='John Doe' value={this.state.init ? '' : this.state.name} floatingLabelText='Name' disabled={this.state.sendingMail || this.state.mailSent} errorText={this.state.nameError} onChange={this._setValue.bind(this, 'name')}/>
          </div>
          <div className={style.row}>
            <i className={style.icons + ' material-icons'}>mail_outline</i>
            <TextField hintText='email@domain.com' value={this.state.init ? '' : this.state.email} floatingLabelText='Email' disabled={this.state.sendingMail || this.state.mailSent}  errorText={this.state.emailError} onChange={this._setValue.bind(this, 'email')}/>
          </div>
          <div className={style.row}>
            <i className={style.icons + ' material-icons'}>phone</i>
            <TextField hintText='613-123-4567' value={this.state.init ? '' : this.state.phone} floatingLabelText='Phone Number' disabled={this.state.sendingMail || this.state.mailSent} onChange={this._setValue.bind(this, 'phone')}/>
          </div>
          <div className={style.row}>
            <i className={style.icons + ' material-icons'} disabled={this.state.sendingMail || this.state.mailSent}  onChange={this._setValue.bind(this, 'comment')}>comment</i>
            <TextField
              hintText='Extra spicy'
              floatingLabelText='Comments'
              multiLine={true}
              rows={1}
              disabled={this.state.sendingMail || this.state.mailSent} 
              value={this.state.init ? '' : this.state.comment}
            />
          </div>
        </div>
        <div className={style.submit}>
          <div className={style.button} onClick={this._checkForm.bind(this)} disabled={this.state.sendingMail || this.state.mailSent} >
            {
              this.state.sendingMail &&
              <div>SENDING <img src={loading} /></div>
            }
            {
              !this.state.sendingMail && this.state.mailSent &&
              <div> Your order has been received at {moment().format('MMMM Do YYYY, h:mm:ss a')} </div>
            }
            {
              !this.state.sendingMail && !this.state.mailSent &&
              <div> SEND </div>
            }
          </div>
          {
            !this.state.sendingMail && this.state.mailSent &&
            <div className={style.moreOrder} onClick={ this._startOver.bind(this) }> Place Another Order </div>
          }
          
        </div>
        <div className={style.contact}>
          <div className={style.address}>
            <i className={'material-icons'}>location_on</i>
            {this.contact.address}
          </div>
          <div className={style.phone}>
            <i className={'material-icons'}>local_phone</i>
            {this.contact.phone}
          </div>
        </div>
      </div>
    )
  }

  _startOver() {
    debugger
    this.setState(this.originalState);
  }

  _renderItems() {
    return (
      Object.keys(this.state.items).map(key => {
        const item = this.state.items[key]

        return (
          <li>
            <div className={style.item}>{item.name}</div>
            <div className={style.control} onClick={this._addOrder.bind(this, key)}>
              <i className={style.add + ' material-icons'}>add_circle</i>
            </div>
            <div className={item.quantity > 0 ? style.quantity : style.inactive}>{item.quantity > 0 ? item.quantity : 0}</div>
            <div className={style.control} onClick={this._removeOrder.bind(this, key)}>
              <i className={item.quantity > 0 ? style.remove + ' material-icons' : style.removeInactive + ' material-icons'}>remove_circle</i>
            </div>
            <div className={style.price}>${item.price}</div>
            
          </li>
        )
      })
    )
  }

  _setValue(key, e) {
    const newState = {};
    newState[key] = e.target.value
    newState.init = false;

    this.setState(newState)
  }

  _checkForm() {
    if (this.state.sendingMail || this.state.mailSent) {
      return
    }

    if (this.state.name.length < 1) {
      this.setState({
        nameError: 'Please tell me your name'
      })
      return
    } else {
      this.setState({
        nameError: ''
      })
    }

    if (this.state.email.length < 1 || !validateEmail(this.state.email)) {
      this.setState({
        emailError: 'I need a valid email address from you'
      })
      return
    } else {
      this.setState({
        emailError: ''
      })
    }

    this.setState({
      sendingMail: true
    })

    let message = '\n';
    message += 'Name: ' + this.state.name + '\n';
    message += 'Email: ' + this.state.email + '\n';
    message += 'Phone: ' + this.state.phone + '\n';
    message += 'Comment: ' + this.state.comment + '\n\n----------------------------\n';

    Object.keys(this.state.items).map(key => {
      const item = this.state.items[key];
      if (item.quantity > 0) {
        message += item.name + ' x ' + item.quantity + '\n';
      }
    });
    message += '\nTotal of (' + this.state.totalQuantity + ' items): $' + this.state.totalPrice + '\n';

    $.ajax({
        type: 'POST',
        url: "sendemail.php",
        dataType: 'json',
        data: {
          name: this.state.name,
          email: this.state.email,
          subject: 'Order',
          message: message,
          navigator: Navigator()
        },
        success: (data, textStatus, jqXHR) => {
          this.setState({
            mailSent: true,
            sendingMail: false
          })
        }
    });

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }

  _addOrder(key) {
    if (this.state.sendingMail || this.state.mailSent) {
      return
    }

    this.state.items[key].quantity++;

    this.setState({
      totalQuantity: ++this.state.totalQuantity,
      totalPrice: this.state.totalPrice + this.state.items[key].price,
      items: this.state.items,
    })
  }

  _removeOrder(key) {
    if (this.state.sendingMail || this.state.mailSent) {
      return
    }

    if (this.state.items[key].quantity === 0) {
      return;
    }

    this.state.items[key].quantity--;
    this.setState({
      totalQuantity: --this.state.totalQuantity,
      totalPrice: this.state.totalPrice - this.state.items[key].price,
      items: this.state.items
    })
  }
}

const mapStateToProps = (state) => ({
  counter: state.counter
})
export default connect((mapStateToProps), {
  increment: () => increment(1),
  doubleAsync
})(FormView)
