import React, {useState} from 'react';
// import {Link, useParams } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined, ExpandOutlined, SafetyOutlined, RiseOutlined, EyeOutlined, SearchOutlined,
} from '@ant-design/icons';
import "./Home.css"
import {logout} from "../../Functions/auth";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


export default function Home() {
    // const { id } = useParams();
    const [collapsed, setCollapsed] = useState(false)
    function collapse(){
        if (collapsed === false){
            setCollapsed(true);
        }else{
            setCollapsed(false);
        }

    }

    return(
        <Layout style={{ minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={collapse} style={{ backgroundColor:"#100024", boxShadow:" 1px 0px 2px #1d0040" }}>
                <div className="logo" style={{fontSize:"200%", textAlign:"center", fontWeight:"bold", paddingTop:"10%",paddingBottom:"10%", borderBottom:"7px solid black", backgroundColor:"#1d0040"}}>{!collapsed ? "MangAnime" : "M"}</div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item style={{ color:"white"}} key="1" icon={<RiseOutlined style={{fontSize:"100%"}}/>}>
                        Trending
                    </Menu.Item>
                    <Menu.Item style={{ color:"white"}} key="2" icon={<SearchOutlined style={{fontSize:"100%"}}/>}>
                        Search
                    </Menu.Item>
                    <Menu.Item style={{ color:"white"}} key="3" icon={<EyeOutlined style={{fontSize:"100%"}}/>}>
                        Watched
                    </Menu.Item>
                    <SubMenu style={{ color:"white"}} key="sub2" icon={<UserOutlined style={{fontSize:"100%"}}/>} title="Account">
                        <Menu.Item style={{ color:"white"}} key="4" icon={<SafetyOutlined style={{fontSize:"90%"}}/>}>Security</Menu.Item>
                        <Menu.Item style={{ color:"white"}} key="5" icon={<ExpandOutlined style={{fontSize:"90%"}}/>}>QR Login</Menu.Item>
                        <Menu.Item style={{ color:"white"}} key="6" icon={<UserOutlined style={{fontSize:"90%"}}/>} onClick={logout}>Disconnect</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        Bill is a cat.
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Design ©2021 Created by AlexArtaud-Dev</Footer>
            </Layout>
        </Layout>
    );

}