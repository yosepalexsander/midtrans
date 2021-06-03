import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import style from "./Header.module.css";

import clsx from "clsx";

const index = () => {
  return (
    <div className={style.root}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/" className={clsx(style.title, style.textWhite)}>
            <Typography variant="h6">Holyways</Typography>
          </Link>
          <Link
            to="/transactions"
            className={clsx(style.marginRight, style.textWhite)}
          >
            <Typography variant="h6">Transactions</Typography>
          </Link>
          <Link to="/products" className={style.textWhite}>
            <Typography variant="h6">Products</Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default index;
