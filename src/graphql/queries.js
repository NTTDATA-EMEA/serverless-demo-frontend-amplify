/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSlsDemoTwitterState = /* GraphQL */ `
  query GetSlsDemoTwitterState($namespace: String!, $version: Int!) {
    getSlsDemoTwitterState(namespace: $namespace, version: $version) {
      namespace
      version
      state
    }
  }
`;
export const listSlsDemoTwitterStates = /* GraphQL */ `
  query ListSlsDemoTwitterStates(
    $filter: TableSlsDemoTwitterStateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSlsDemoTwitterStates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        namespace
        version
        state
      }
      nextToken
    }
  }
`;
