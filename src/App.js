import { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Layout, Menu, PageHeader } from 'antd';
import { StateMaintenance } from './components/StateMaintenance';
import { HashtagDashboard } from './components/HashtagDashboard';
import 'antd/dist/antd.css';


const { Header, Content, Footer } = Layout;

function App() {
  const [selectedKey, setSelectedKey] = useState("1");

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Serverless Demo Client"
      />
      <Router>
        <Layout className="layout">
          <Header>
            <div className="logo"></div>
            <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]}>
              <Menu.Item key="1" onClick={() => setSelectedKey("1")}>
                <span>Dashboard</span>
                <Link to="/" />
              </Menu.Item>
              <Menu.Item key="2" onClick={() => setSelectedKey("2")}>
                <span>Admin</span>
                <Link to="/admin" />
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
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
