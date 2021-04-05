import { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import {
  updateSlsDemoTwitterState as UpdateState
} from '../graphql/mutations';
import {
  getSlsDemoTwitterState as GetState
} from '../graphql/queries';
import {
  onUpdateSlsDemoTwitterState as onUpdateState
} from '../graphql/subscriptions';
import { Button, List } from 'antd';

export const StateMaintenance = () => {
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
      next: ({ provider, value }) => {
        console.log(provider, value);
        fetchState();
      },
      error: err => console.log(err);
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

    setState(arrayStateSorted);
    setLoading(false);
  }

  const resetItemLatestId = async (item) => {
    const updatedState = [...state];
    updatedState[updatedState.findIndex(i => i.hashTag === item.hashTag)].latestId = 0;
    
    const mapState = new Map(updatedState.map(i => [i.hashTag, i.latestId]));
    const jsonState = JSON.stringify(Object.fromEntries(mapState));

    try {
      await API.graphql({
        query: UpdateState,
        variables: { input: { namespace: 'aboczek', version: '1', state: jsonState }}
      });
    } catch (err) {
      console.log(err);
    }
    setState(updatedState);
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