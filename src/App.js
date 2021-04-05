import { v4 as uuid } from 'uuid';
import 'antd/dist/antd.css';
import { StateMaintenance } from './components/StateMaintenance';

const CLIENT_ID = uuid();

function App() {

  return (
    <>
      <StateMaintenance />
    </>
  );
}

export default App;
