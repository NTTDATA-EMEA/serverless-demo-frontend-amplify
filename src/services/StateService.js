import { API, graphqlOperation } from 'aws-amplify';
import {
  updateSlsDemoTwitterState
} from '../graphql/mutations';

export const updateState = async (updatedState) => {
  try {
    await API.graphql({
      query: updateSlsDemoTwitterState,
      variables: { input: { namespace: 'aboczek', version: '1', state: transformStateToJson(updatedState) } }
    });
  } catch (err) {
    console.log(err);
  }
}

function transformStateToJson(inputState) {
  const mapState = new Map(inputState.map(i => [i.hashTag, i.latestId]));
  return JSON.stringify(Object.fromEntries(mapState));
}