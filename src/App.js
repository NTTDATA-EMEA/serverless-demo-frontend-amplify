import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import { StateMaintenance } from './components/StateMaintenance';
import 'antd/dist/antd.css';
import { HashtagDashboard } from './components/HashtagDashboard';

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

function App() {

  return (
    <>
      <Router>
        <Layout className="layout">
          <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <span>Home</span>
                <Link to="/" />
              </Menu.Item>
              <Menu.Item key="2">
                <span>Admin</span>
                <Link to="/admin" />
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-content">
              <Route exact path="/" component={HashtagDashboard} />
              <Route path="/admin" component={StateMaintenance} />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>©2021 NTT DATA Serverless Demo</Footer>
        </Layout>
      </Router>
    </>
  );
}

export default App;
