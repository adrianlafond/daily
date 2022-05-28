import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Dropbox, DropboxAuth } from 'dropbox';
import { openTodosFile, getDefaultTodos } from '../../services';
import { parseQueryString } from '../../utils/parse-query-string';

import style from './style.css';

export interface DaysProps {
  date?: string;
}

const CLIENT_ID = 'ih3d422ruazvhwd';

const Days = ({ date }: DaysProps) => {
  const [count, setCount] = useState(0);
  function increment() {
    setCount(count + 1);
  }

  const [days, setDays] = useState(getDefaultTodos());
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    url: '',
  });

  const handleOpenFile = async () => {
    const data = await openTodosFile();
    if (data) {
      setDays(data);
    }
  };

  async function listFiles(accessToken: string) {
    const dbx = new Dropbox({ accessToken });
    try {
      const files = await dbx.filesListFolder({ path: '' });
      // eslint-disable-next-line no-console
      console.log(files);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async function setupAuth() {
    const dbxAuth = new DropboxAuth({ clientId: CLIENT_ID });
    const url = (await dbxAuth.getAuthenticationUrl(
      'http://localhost:8080'
    )) as string; // because "Type 'String' is not assignable to type 'string'"
    setAuth({
      isAuthenticated: true,
      url,
    });
  }

  useEffect(() => {
    const params = parseQueryString(window.location.hash);
    const token = params.access_token as string;
    const isAuthenticated = !!token;
    if (isAuthenticated) {
      listFiles(token);
    } else {
      setupAuth();
    }
  }, [typeof window !== 'undefined' ? window.location.href : null]);

  return (
    <div className={style.days}>
      <h1>{days.title}</h1>

      <p>count: {count}</p>

      <button onClick={increment}>increment</button>

      <h2>{date}</h2>
      <p>This is the Days component.</p>

      <button onClick={handleOpenFile}>Open local file</button>

      <hr />

      <h2>Dropbox</h2>

      {auth.isAuthenticated ? (
        <a href={auth.url}>Authenticate with Dropbox</a>
      ) : (
        <p>Congrats</p>
      )}
    </div>
  );
};

export default Days;
