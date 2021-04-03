import { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { getSlsDemoTwitterState as GetState } from './graphql/queries';
import { Button, List } from 'antd';
import 'antd/dist/antd.css';

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
    const arrayState = Array.from(mapState, ([hashTag, latestId]) => ({ hashTag, latestId }));
    const arrayStateSorted = arrayState.sort((a, b) => a.hashTag < b.hashTag ? -1 : 1);

    console.log(arrayStateSorted);
    setState(arrayStateSorted);
    setLoading(false);
  }

  const renderItem = (item) => {
    return (
      <List.Item
        actions={[
          <Button type="danger">Reset</Button>
        ]}
      >
        <List.Item.Meta
          title={item.hashTag}
          description={item.latestId}
        />
      </List.Item>
    );
  }

  return (
    <>
      <List 
        style={{ padding: 20 }}
        loading={loading}
        dataSource={state}
        renderItem={renderItem} />
    </>
  );
}

export default App;
