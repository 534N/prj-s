import React from 'react';
// import { Route, IndexRoute } from 'react-router';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'layouts/CoreLayout/CoreLayout';
import HomeView from 'views/HomeView/HomeView';
import FormView from 'views/FormView/FormView';

export default (store) => (

  <Route path='/yang' component={CoreLayout}>
    <IndexRoute component={HomeView} />
    <Route path='form' component={FormView} >
      <Route path=":userID" component={FormView}/>
    </Route>

  </Route>

);
// import React from 'react';
// import { render } from 'react-dom';
// import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';

// const ACTIVE = { color: 'red' };

// class App extends React.Component {
//   render() {
//     return (
//       <div>
//         <h1>APP!</h1>
//         <ul>
//           <li><Link      to="/yang/form"           activeStyle={ACTIVE}>/</Link></li>
//           <li><IndexLink to="/yang/form"           activeStyle={ACTIVE}>/ IndexLink</IndexLink></li>

//           <li><Link      to="/yang/form/users"      activeStyle={ACTIVE}>/users</Link></li>
//           <li><IndexLink to="/yang/form/users"      activeStyle={ACTIVE}>/users IndexLink</IndexLink></li>

//           <li><Link      to="/yang/form/users/ryan" activeStyle={ACTIVE}>/users/ryan</Link></li>
//           <li><Link      to={{ pathname: '/yang/form/users/ryan', query: { foo: 'bar' } }}
//                                           activeStyle={ACTIVE}>/users/ryan?foo=bar</Link></li>

//           <li><Link      to="/yang/form/about"      activeStyle={ACTIVE}>/about</Link></li>
//         </ul>

//         {this.props.children}
//       </div>
//     );
//   }
// }

// class Index extends React.Component {
//   render() {
//     return (
//       <div>
//         <h2>Index!</h2>
//       </div>
//     );
//   }
// }

// class Users extends React.Component {
//   render() {
//     return (
//       <div>
//         <h2>Users</h2>
//         {this.props.children}
//       </div>
//     );
//   }
// }

// class UsersIndex extends React.Component {
//   render() {
//     return (
//       <div>
//         <h3>UsersIndex</h3>
//       </div>
//     );
//   }
// }

// class User extends React.Component {
//   render() {
//     return (
//       <div>
//         <h3>User {this.props.params.id}</h3>
//       </div>
//     );
//   }
// }

// class About extends React.Component {
//   render() {
//     return (
//       <div>
//         <h2>About</h2>
//       </div>
//     );
//   }
// }

// render((
//   <Router history={browserHistory}>
//     <Route path="/yang/form" component={App}>
//       <IndexRoute component={Index}/>
//       <Route path="/about" component={About}/>
//       <Route path="users" component={Users}>
//         <IndexRoute component={UsersIndex}/>
//         <Route path=":id" component={User}/>
//       </Route>
//     </Route>
//   </Router>
// ), document.getElementById('root'));