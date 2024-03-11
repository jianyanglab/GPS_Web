import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Monkey from './monkey';
import Mouse from './mouse';
import ERROR from './error'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/monkey" component={Monkey} />
        <Route exact path="/mouse" component={Mouse} />
        {/* 路由匹配失败兜底逻辑 */}
        <Route exact path="/404" component={ERROR} />
        <Redirect from="*" to="/404" />
      </Switch>
    </Router>
  ); 
}

export default App;