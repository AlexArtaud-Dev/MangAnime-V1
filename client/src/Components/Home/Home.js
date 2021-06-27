import React, {useEffect, useState} from 'react';
// import {Link, useParams } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from 'antd';
import {
    UserOutlined,
    ExpandOutlined,
    SafetyOutlined,
    RiseOutlined,
    EyeOutlined,
    SearchOutlined,
    CrownOutlined,
    InfoCircleOutlined, KeyOutlined, PlusCircleOutlined, TeamOutlined,
} from '@ant-design/icons';
import "./Home.css"
import {logout} from "../../Functions/auth";
import Trending from "../Trending/Trending";
import {getUserInfos} from "../../Functions/user";
import Watched from "../Watched/Watched";
import ServerInfo from "../ServerInfo/ServerInfo";
import GenerateKey from "../GenerateKey/GenerateKey";
import ManageKeys from "../ManageKeys/ManageKeys";
import { useHistory } from "react-router-dom";
import ManageUsers from "../ManageUsers/ManageUsers";
import { message, Button } from 'antd';
import Search from "../Search/Search";
import AnimeToDisp from "../AnimeToDisp/AnimeToDisp";
import QrCodeDisplay from "../QrCodeDisplay/QrCodeDisplay";
const { Content, Sider } = Layout;
const { SubMenu } = Menu;


export default function Home() {
    // const { id } = useParams();
    let history = useHistory();
    function goHome(){
        setAnimeToDisp({
            anime: null,
            status: false
        })
        history.push("/home");
    }
    const [collapsed, setCollapsed] = useState(false)
    const [animeToDisp, setAnimeToDisp] = useState({
        anime: null,
        status: false
    })
    const pathname = window.location.pathname
    const decodedPath = decodeURI(pathname).split("/")
    if (decodedPath[1] && decodedPath[2] && decodedPath[1].toString() === "anime" && !animeToDisp.status){
        setAnimeToDisp({anime: <AnimeToDisp animeName={decodedPath[2]}/>, status: true })
    }
    const [itemToDisplay, setItemToDisplay] = useState(<Trending/>);
    function collapse(){
        if (collapsed === false){
            setCollapsed(true);
        }else{
            setCollapsed(false);
        }

    }
    const [userRequest, setUserRequest] = useState({
        loading: true,
        user: null,
    });

    useEffect(() => {
        getUserInfos()
            .then(data => {
                setUserRequest({
                    loading: false,
                    user: data.data,
                });
            });
    }, []);

    const { loading, user } = userRequest;


    return(
        <Layout style={{ minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={collapse} style={{ backgroundColor:"#100024", boxShadow:" 1px 0px 2px #1d0040" }}>
                <div className="logo" style={{fontSize:"200%", textAlign:"center", fontWeight:"bold", paddingTop:"10%",paddingBottom:"10%", borderBottom:"7px solid black", backgroundColor:"#1d0040", cursor:"pointer" }} onClick={goHome}>{!collapsed ? "MangAnime" : "M"}</div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item style={{ color:"white"}} key="1" icon={<RiseOutlined style={{fontSize:"100%"}}/>} onClick={() => {
                        setItemToDisplay(<Trending/>)
                        goHome();
                    }}>
                        Trending
                    </Menu.Item>
                    <Menu.Item style={{ color:"white"}} key="2" icon={<SearchOutlined style={{fontSize:"100%"}}/>} onClick={() => {
                        setItemToDisplay(<Search/>)
                        goHome();
                    }}>
                        Search
                    </Menu.Item>
                    <Menu.Item style={{ color:"white"}} key="3" icon={<EyeOutlined style={{fontSize:"100%"}}/>} onClick={() => {
                        setItemToDisplay(<Watched/>)
                        goHome();
                    }}>
                        Watched
                    </Menu.Item>
                    {!loading && user.authority.level === 10 ? (
                        <SubMenu style={{ color:"white"}} key="sub1" icon={<CrownOutlined style={{fontSize:"100%"}}/>} title="Admin Panel">
                            <Menu.Item style={{ color:"white"}} key="5" icon={<TeamOutlined style={{fontSize:"90%"}}/>} onClick={() => {
                                setItemToDisplay(<ManageUsers/>);
                                goHome();
                            }}>Users</Menu.Item>
                            <Menu.Item style={{ color:"white"}} key="6" icon={<PlusCircleOutlined style={{fontSize:"90%"}}/>} onClick={() => {
                                setItemToDisplay(<GenerateKey/>);
                                goHome();
                            }}>Generate Key</Menu.Item>
                            <Menu.Item style={{ color:"white"}} key="7" icon={<KeyOutlined style={{fontSize:"90%"}}/>} onClick={() => {
                                setItemToDisplay(<ManageKeys/>)
                                goHome();
                            }}>Manage Keys</Menu.Item>
                            <Menu.Item style={{ color:"white"}} key="8" icon={<InfoCircleOutlined style={{fontSize:"90%"}}/>} onClick={() => {
                                setItemToDisplay(<ServerInfo/>)
                                goHome();
                            }}>Global Infos</Menu.Item>
                        </SubMenu>
                    ) : (
                        <div/>
                    )}
                    <SubMenu style={{ color:"white"}} key="sub2" icon={<UserOutlined style={{fontSize:"100%"}}/>} title="Account">
                        <Menu.Item style={{ color:"white"}} key="9" icon={<SafetyOutlined style={{fontSize:"90%"}}/>}>Security</Menu.Item>
                        <Menu.Item style={{ color:"white"}} key="10" icon={<ExpandOutlined style={{fontSize:"90%"}}/>} onClick={() => {
                            setItemToDisplay(<QrCodeDisplay/>)
                            goHome();
                        }}>QR Login</Menu.Item>
                        <Menu.Item style={{ color:"white"}} key="11" icon={<UserOutlined style={{fontSize:"90%"}}/>} onClick={logout}>Disconnect</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Content style={{padding:"2%" }}>
                    {animeToDisp.status ? (animeToDisp.anime) : (itemToDisplay)}
                </Content>
                {/*<Footer style={{ textAlign: 'center' }}>Design ©2021 Created by AlexArtaud-Dev</Footer>*/}
            </Layout>
        </Layout>
    );

}