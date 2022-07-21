import { FunctionalComponent, h } from 'preact'
import { Link } from 'preact-router/match'
import style from './style.css'

export const Header: FunctionalComponent = () => (
  <header className={style.header}>
    <h1>Preact App</h1>
    <nav>
      <Link activeClassName={style.active} href="/">
        Index
      </Link>
      <Link activeClassName={style.active} href="/todos">
        Todos
      </Link>
      <Link activeClassName={style.active} href="/home">
        Home
      </Link>
      <Link activeClassName={style.active} href="/profile">
        Me
      </Link>
      <Link activeClassName={style.active} href="/profile/john">
        John
      </Link>
    </nav>
  </header>
)
