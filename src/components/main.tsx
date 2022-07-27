import { FunctionalComponent, h } from 'preact'
import { Route, Router } from 'preact-router'

import Todos from '../routes/todos'
import Home from '../routes/home'
import Profile from '../routes/profile'
import NotFoundPage from '../routes/notfound'
import { Header } from './header'

const days = ['Sun', 'M', 'T', 'W', 'R', 'F', 'Sat']

const Main: FunctionalComponent = () => {
  const today = new Date()
  const defaultDate = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()} ${days[today.getDay()]}`

  return (
    <div id="preact_root">
      <Header />
      <Router>
        <Route path="/" component={Todos} />
        <Route path="/todos" component={Todos} date={defaultDate} />
        <Route path="/todos/:date" component={Todos} />
        <Route path="/home" component={Home} />
        <Route path="/profile/" component={Profile} user="me" />
        <Route path="/profile/:user" component={Profile} />
        <NotFoundPage default />
      </Router>
    </div>
  )
}

export default Main
