import { StateMaintenance } from "./StateMaintenance";
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

const StateMaintenancePage = () => (
  <>
    <AmplifySignOut />
    <StateMaintenance />
  </>
);

export default withAuthenticator(StateMaintenancePage);