import React, {useState} from 'react';
import logo from "../../Assets/Logo/manganime.png"
import shibi from "../../Assets/Logo/saberShibi.png"
import "./HomeNotLogged.css"
import { useHistory } from "react-router-dom";
import {Typography, Row, Button, Modal} from 'antd';
import { GithubOutlined } from '@ant-design/icons';
const { Title } = Typography;
const axios = require("axios")
const {IP, DNS} = require("../../config")

export default function HomeNotLogged() {
    let history = useHistory();
    const noLoading = localStorage.getItem("noLoading");
    function login(){
        history.push("/login");
    }
    function register(){
        history.push("/register");
    }
    function gitHub(){
       window.location.replace("https://github.com/AlexArtaud-Dev");
    }
    const [loading, setLoading] = useState(noLoading !== 'true');
    const [request, setRequest] = useState(true)
    const [secret, setSecret] = useState(0);
    const [secretInfos, setSecretInfos] = useState({
        IP: null,
        Region: null,
        CodeReg: null,
        CodePostal: null,
        Pays: null,
        CodePays: null,
        Continent: null,
        CodeContinent: null,
        latitude: null,
        longitude: null,
        useVPN: null,
        TimeZone: null,
        TimeZoneAbrev : null,
        GMT: null,
        HeureATM: null,
        Monnaie: null,
        CodeMonnaie: null,
        Operateur: null,
        ConnexionType: null
    })
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    if (secret === 5){
        setSecret(0);
        showModal()
    }

    if (loading){
        setTimeout(() =>{
            setLoading(false);
        },2000);
    }

    if (request){
        axios.get("https://ipgeolocation.abstractapi.com/v1/?api_key=1be9a6884abd4c3ea143b59ca317c6b2").then(data => {
            const infos = data.data
            setSecretInfos({
                IP: infos.ip_address,
                Region: infos.region,
                CodeReg: infos.region_iso_code,
                CodePostal: infos.postal_code,
                Pays: infos.country,
                CodePays: infos.country_code,
                Continent: infos.continent,
                CodeContinent: infos.continent_code,
                latitude: infos.latitude,
                longitude: infos.longitude,
                useVPN: infos.security.is_vpn,
                TimeZone: infos.timezone.name,
                TimeZoneAbrev : infos.timezone.abbreviation,
                GMT: infos.timezone.gmt_offset,
                HeureATM: infos.timezone.current_time,
                Monnaie: infos.currency.currency_name,
                CodeMonnaie: infos.currency.currency_code,
                Operateur: infos.connection.autonomous_system_organization,
                ConnexionType: infos.connection.connection_type
            })
            setRequest(false);
        }).catch(error => {})
    }



    return(
       <div onLoad={() => localStorage.removeItem("noLoading")} style={!loading ? {width:"100%",height:"100vh", backgroundImage: `url('${DNS}img/wavy-magenta-by-nouridio.svg')`, backgroundPosition:"bottom",backgroundRepeat:"no-repeat", backgroundAttachment:"fixed", backgroundSize:"2400px"} : {}}>
           {loading ? (
               <div style={{width:"100%",display:"flex", justifyContent:"center"}}>
                   <img style={{marginTop:"9%"}} className="logo" src={logo} alt={"MangAnime Logo"}/>
               </div>
           ) : (
              <div>
                  <Modal title="Don't be afraid we are not watching you !" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                      <p style={{fontSize:"120%"}}><b>IP</b>: {secretInfos.IP} | <b>VPN</b>: {secretInfos.useVPN ? "yes" : "no"}</p>
                      <p style={{fontSize:"120%"}}><b>Operator</b>: {secretInfos.Operateur} | <b>Connection</b>: {secretInfos.ConnexionType}</p>
                      <p style={{fontSize:"120%"}}><b>Region</b>: {secretInfos.Region} | <b>CodeReg</b>: {secretInfos.CodeReg}</p>
                      <p style={{fontSize:"120%"}}><b>Zip Code</b>: {secretInfos.CodePostal} | <b>State</b>: {secretInfos.Pays}</p>
                      <p style={{fontSize:"120%"}}><b>State Code</b>: {secretInfos.CodePays} | <b>Continent</b>: {secretInfos.Continent} | <b>Continent Code</b>: {secretInfos.CodeContinent}</p>
                      <p style={{fontSize:"120%"}}><b>Latitude</b>: {secretInfos.latitude} | <b>Longitude</b>: {secretInfos.longitude}</p>
                      <p style={{fontSize:"120%"}}><b>Time Zone</b>: {secretInfos.TimeZone} | <b>Time Zone Code</b>: {secretInfos.TimeZoneAbrev}</p>
                      <p style={{fontSize:"120%"}}><b>GMT</b>: {secretInfos.GMT} | <b>Time</b>: {secretInfos.HeureATM}</p>
                      <p style={{fontSize:"120%"}}><b>Currency</b>: {secretInfos.Monnaie} | <b>Currency Code</b>: {secretInfos.CodeMonnaie}</p>
                  </Modal>
                  <Row justify="space-between" style={{width:"100%", paddingLeft:"5%", paddingTop:"1%", backgroundColor:"rgba(12,0,25,0.9)"}}>
                      <Title level={1}>MangAnime</Title>
                      <div style={{width:"25%"}}>
                          <Button style={{width:"35%", fontSize:"140%", paddingBottom:"7%"}} type="primary" shape="round" size={'large'} ghost onClick={register}>Register</Button>
                          <Button style={{width:"35%", fontSize:"140%", paddingBottom:"7%", marginLeft:"5%"}} type="primary" shape="round" size={'large'} onClick={login}>Login</Button>
                      </div>
                  </Row>
                  <div className="container">
                      <div style={{marginTop:"13%", marginLeft:"8%", width:"50%"}}>
                          <Title>Join our application !</Title>
                          <p style={{fontSize:"140%", textAlign:"justify"}}>
                              To access our website, you need to register or login if you already have an account.<br/>
                              This website was developped to help people watch animes without any ads or any subscription.<br/>
                              MangAnime is not hosting any of the content that is displayed inside the website.
                          </p>
                          <Button style={{width:"38%", paddingBottom:"3.3%", fontSize:"140%"}} type="primary" shape="round" icon={<GithubOutlined />} size={'large'} onClick={gitHub} ghost>Github</Button>
                          <Button style={{width:"38%", paddingBottom:"3.3%", fontSize:"140%", marginLeft:"4%"}} type="primary" shape="round" size={'large'} onClick={login}>Login</Button>
                      </div>
                      <div style={{marginTop:"5%", width:"50%", display:"flex", justifyContent:"center"}}>
                          <img style={{width:"60%"}} src={`${DNS}img/saberShibiFull.png`} alt={"MangAnime Shibi"} onClick={() => setSecret(secret+1)}/>
                      </div>
                  </div>
              </div>
           )}
       </div>
    );

}