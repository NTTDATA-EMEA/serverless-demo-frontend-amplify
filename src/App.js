import { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { getSlsDemoTwitterState as GetState } from './graphql/queries';
import { List } from 'antd';

function App() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({});

  useEffect(() => {
    fetchState();
  }, []);

  async function fetchState() {
    const stateData = await API.graphql(
      graphqlOperation(GetState, {
        namespace: 'aboczek',
        version: 1
      })
    );
    const loadedState = JSON.parse(stateData.data.getSlsDemoTwitterState.state);
    const hashes = Object.entries(loadedState);

    console.log(hashes);
    setState(loadedState);
    setLoading(false);
  }

  return (
    <>
      <List 
        loading={loading}
        dataSource={state} />
      {/* <div className="App">
        <ul>
          {Object.keys(state).length > 0 ? state.map(([k, v]) => <li key={k}>{k} - {v}</li>) : <li>no records</li>}
        </ul>
      </div> */}
    </>
  );
}

export default App;
