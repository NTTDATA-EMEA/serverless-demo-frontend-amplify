import { useEffect, useReducer } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import {
  getSlsDemoTwitterState as GetState
} from '../graphql/queries';
import {
  onUpdateSlsDemoTwitterState as onUpdateState
} from '../graphql/subscriptions';
import { Layout, Button, List, Popconfirm, Input, Form } from 'antd';
import { DeleteFilled, QuestionCircleFilled, UndoOutlined } from '@ant-design/icons';
import { reducer } from './stateMaintenanceReducer';
import * as stateService from '../services/StateService';

const initialState = {
  hashTags: [],
  isDirty: false,
  loading: true,
  error: false,
  form: { hashTag: '', latestId: 0 }
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
    if (state.isDirty) {
      stateService.updateState(state.hashTags);
    }
  }, [state]);

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
  };

  const resetItemLatestId = async (item) => {
    dispatch({
      type: "RESET_HASHTAG",
      payload: item
    });
  };

  const deleteItem = (item) => {
    dispatch({
      type: "DELETE_HASHTAG",
      payload: item
    });
  };

  const onChange = (e) => {
    dispatch({
      type: "SET_INPUT",
      payload: e.target.value.trim()
    });
  };

  const addItem = () => {
    const { form } = state;
    if (!form.hashTag) return alert("Hashtag must not be empty!");
    const newHashTag = { ...form };
    if (!newHashTag.hashTag.startsWith("#")) newHashTag.hashTag = "#" + newHashTag.hashTag;
    if (state.hashTags.some(h => h.hashTag === newHashTag.hashTag)) return alert(`Hashtag ${newHashTag.hashTag} is already present in the configuration.`);

    dispatch({ type: "RESET_INPUT" });
    dispatch({ type: "ADD_HASHTAG", payload: newHashTag });
  };

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
            <Button type="default" icon={<UndoOutlined />}>Reset latest Tweet Id</Button>
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
      <Form layout="inline" style={{ padding: 20 }}>
        <Form.Item label="Hashtag">
          <Input
            prefix="#"
            value={state.form.hashTag}
            onChange={(e) => onChange(e)}
            placeholder="Hashtag"
            name="hashTag"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={addItem}
          >Add Hashtag</Button>
        </Form.Item>
      </Form>
      <Layout>
        <List
          header={<h3>Hashtags with latest Tweet Id</h3>}
          size='small'
          bordered={true}
          loading={state.loading}
          dataSource={state.hashTags}
          renderItem={renderItem} />
      </Layout>
    </>
  );
}