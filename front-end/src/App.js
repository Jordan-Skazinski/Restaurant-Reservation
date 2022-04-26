import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./layout/Layout";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */

 function App() {
  return (
    <div>
      <Switch>
      <Route path="/">
        <Layout />
      </Route>
    </Switch>
    </div>
  );
}


export default App;
