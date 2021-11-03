import { initializeApp } from "firebase/app"
import {
  Switch,
  Route
} from 'react-router-dom'
import SignIn from './SignIn'
import MenuBuilder from './MenuBuilder'
import './App.css';
import { ProvideAuth } from "./useAuth";

function App() {
  return (
    <ProvideAuth>
      <Switch>
        <Route path='/login'>
          <SignIn></SignIn>
        </Route>
        <Route path='/menu'>
          <MenuBuilder></MenuBuilder>
        </Route>
      </Switch>
    </ProvideAuth>
  );
}

export default App;
