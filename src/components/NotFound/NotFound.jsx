import React from 'react'
import { Link } from 'react-router'
import logoSvg from 'images/logo_only_white.svg'
import classes from './notFound.scss'

const NotFound = () => (
  <div className={classes.wrapper}>
    <div className={classes.content}>

      <img className={classes.logo} src={logoSvg} alt="Medspoke Logo" />

      <div className={classes.error}>
        <div className={classes.code}>404</div>
        <div className={classes.message}>Page Not Found</div>
      </div>

      <div className={classes.options}>
        <div>Try going back or visiting the <Link to="/provider" >dashboard</Link></div>
      </div>

    </div>
  </div>
)

export default NotFound
