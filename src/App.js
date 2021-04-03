import { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { getSlsDemoTwitterState as GetState } from './graphql/queries';
import { List } from 'antd';

function App() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState([]);

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
    const mapState = Object.entries(loadedState);
    const arrayState = Array.from(mapState, ([k, v]) => ({ k, v }));

    console.log(arrayState);
    setState(arrayState);
    setLoading(false);
  }

  return (
    <>
      <List 
        loading={loading}
        dataSource={state} />
    </>
  );
}

export default App;
