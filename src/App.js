import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import "./App.css";

import HomePage from "./pages/homepage/HomePage.component";
import ShopPage from "./pages/shop/shop.component";
import SignInAndSignUpPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import Header from "./components/header/header.component";
import CheckoutPage from "./pages/checkout/checkout.component";
import { auth, createUserProfileDocument } from "./firebase/firebase.utils";
import { setCurrentUser } from "./redux/user/user.action";
import { selectCurrentUser } from "./redux/user/user.selector";

class App extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     currentUser: null,
  //   };
  // }

  unsubscriberFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;

    this.unsubscriberFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscriberFromAuth();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />

          <Route exact path="/checkout" component={CheckoutPage} />
          <Route
            exact
            path="/signin"
            render={() =>
              this.props.currentUser ? (
                <Redirect to="/" />
              ) : (
                <SignInAndSignUpPage />
              )
            }
          />
        </Switch>
      </div>
    );
  }
}

// const HomePage = (props) => {
//   console.log(props);
//   return (
//     <div>
//       <button onclick={() => props.history.push("/topics")}> Topics</button>
//       <h1>HOME PAGE</h1>
//     </div>
//   );
// };

// const TopicsList = (props) => {
//   return (
//     <div>
//       <h1>TOPIC LIST PAGE</h1>
//       <Link to={`{props.match.url}/13`}> TO TOPIC 13</Link>
//       <Link to={`{props.match.url}/17`}> TO TOPIC 17</Link>
//       <Link to={`{props.match.url}/21`}> TO TOPIC 21</Link>
//     </div>
//   );
// };
// const TopicDetails = (props) => {
//   console.log(props);
//   return (
//     <div>
//       <h1>TOPIC DETAIL PAGE:{props.match.params.topicId}</h1>
//     </div>
//   );
// };

// function App() {
//   return (
//     <div>
//       <Route exact path="/" component={HomePage} />
//       <Route exact path="/BLOG/ASDQW/topics" component={TopicsList} />
//       <Route
//         exact
//         path="/BLOG/ASDQW/topics/:topicId"
//         component={TopicDetails}
//       />
//       <Route exact path="/BLOG/topics" component={TopicsList} />
//       <Route exact path="/BLOG/topics/:topicId" component={TopicDetails} />
//     </div>
//   );
// }

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
