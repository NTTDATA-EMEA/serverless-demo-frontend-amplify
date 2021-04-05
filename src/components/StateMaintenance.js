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
import { Button, List, Popconfirm } from 'antd';
import { DeleteFilled, QuestionCircleFilled, UndoOutlined } from '@ant-design/icons';

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
      error: err => console.log(err)
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

    try {
      await API.graphql({
        query: UpdateState,
        variables: { input: { namespace: 'aboczek', version: '1', state: transformStateToJson(updatedState) } }
      });
    } catch (err) {
      console.log(err);
    }
    setState(updatedState);
  }

  const deleteItem = async (item) => {
    const index = state.findIndex(i => i.hashTag === item.hashTag);
    const updatedState = [
      ...state.slice(0, index),
      ...state.slice(index + 1)
    ];

    setState(updatedState);
  }

  function transformStateToJson(inputState) {
    const mapState = new Map(inputState.map(i => [i.hashTag, i.latestId]));
    return JSON.stringify(Object.fromEntries(mapState));
  }

  const renderItem = (item) => {
    return (
      <List.Item
        actions={[
          <Popconfirm
            placement="topRight"
            title="Are you sure to set id to 0?"
            onConfirm={() => resetItemLatestId(item)}
            okText="yes"
            cancelText="no"
            icon={<QuestionCircleFilled />}
          >
            <Button type="default" icon={<UndoOutlined />}>Reset</Button>
          </Popconfirm>,
          <Popconfirm
            placement="topRight"
            title={`Are you sure to delete ${item.hashTag}?`}
            onConfirm={() => deleteItem(item)}
            okText="yes"
            cancelText="no"
            icon={<QuestionCircleFilled />}
          >
            <Button type="danger" icon={<DeleteFilled />}>Delete</Button>
          </Popconfirm>
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