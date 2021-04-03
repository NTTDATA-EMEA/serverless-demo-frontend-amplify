import { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { 
  getSlsDemoTwitterState as GetState
} from './graphql/queries';
import { onUpdateSlsDemoTwitterState as onUpdateState } from './graphql/subscriptions';
import { Button, List } from 'antd';
import 'antd/dist/antd.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState([]);

  useEffect(() => {
    fetchState();
    const subscription = API.graphql(
      graphqlOperation(onUpdateState, {
      namespace: 'aboczek',
      version: 1
      })
    ).subscribe({
      next: stateData => {
        console.log(stateData);
        fetchState();
        // setState(stateData.value.data.onUpdateSlsDemoTwitterState);
      }
    })
    return () => subscription.unsubscribe();;
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

  const resetItemLatestId = (item) => {
    setLoading(true);
    console.log(item);

    setLoading(false);
  }

  const renderItem = (item) => {
    return (
      <List.Item
        actions={[
          <Button type="danger" onClick={() => resetItemLatestId(item)}>Reset</Button>
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
        size='small'
        bordered={true}
        loading={loading}
        dataSource={state}
        renderItem={renderItem} />
    </>
  );
}

export default App;
