import { Layout, Menu, Breadcrumb } from 'antd';
import { StateMaintenance } from './components/StateMaintenance';
import 'antd/dist/antd.css';

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

function App() {

  return (
    <>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content">
            <StateMaintenance />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2021 NTT DATA Serverless Demo</Footer>
      </Layout>
    </>
  );
}

export default App;
