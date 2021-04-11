import { useEffect, useReducer } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import {
  getSlsDemoTwitterState as GetState
} from '../graphql/queries';
import {
  onUpdateSlsDemoTwitterState as onUpdateState
} from '../graphql/subscriptions';
import { Button, List, Popconfirm } from 'antd';
import { DeleteFilled, QuestionCircleFilled, UndoOutlined } from '@ant-design/icons';
import { reducer } from './stateMaintenanceReducer';
import * as stateService from '../services/StateService';

const initialState = {
  hashTags: [],
  loading: true
}

export const StateMaintenance = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  useEffect(() => {
    if (state.hashTags.length > 0) stateService.updateState(state.hashTags);
  }, [state.hashTags]);

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

    dispatch({
      type: "SET_HASHTAGS",
      payload: arrayStateSorted
    });
  }

  const resetItemLatestId = async (item) => {
    dispatch({
      type: "RESET_HASHTAG",
      payload: item
    });
  }

  const deleteItem = (item) => {
    dispatch({
      type: "DELETE_HASHTAG",
      payload: item
    });
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
        bordered={false}
        loading={state.loading}
        dataSource={state.hashTags}
        renderItem={renderItem} />
    </>
  );
}