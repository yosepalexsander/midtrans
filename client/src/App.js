import { Switch, Route } from "react-router-dom";
import Products from "./pages/Products";
import { Container } from "@material-ui/core";
import Transactions from "./pages/Transactions";
import Home from "./pages/Home";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <div>
      <Header />
      <Container>
        <Switch>
          <Route path="/transactions">
            <Transactions />
          </Route>
          <Route path="/products">
            <Products />
          </Route>
          <Route path="/" component={Home} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
