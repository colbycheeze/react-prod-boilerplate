import React from 'react';
import { Link } from 'react-router-dom';
import classes from './notFound.scss';

const NotFound = () => (
  <div className={classes.wrapper}>
    <div className={classes.content}>

      <div className={classes.error}>
        <div className={classes.code}>404</div>
        <div className={classes.message}>Page Not Found</div>
      </div>

      <div className={classes.options}>
        <div>Try going back <Link to="/" >Home</Link></div>
      </div>

    </div>
  </div>
);

export default NotFound;
