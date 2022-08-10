import { FunctionalComponent, h } from 'preact'
import { Route, Router } from 'preact-router'

import Todos from '../routes/todos'
import NotFoundPage from '../routes/notfound'
import { idToFormattedDate } from '../services'

const Main: FunctionalComponent = () => {
  const today = idToFormattedDate(new Date())

  return (
    <div id="preact_root">
      <Router>
        <Route path="/" component={Todos} date={today} />
        <Route path="/todos" component={Todos} date={today} />
        <Route path="/todos/:date" component={Todos} />
        <NotFoundPage default />
      </Router>
    </div>
  )
}

export default Main
