import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import logo from "../../Assets/Logo/manganime.png"
import shibi from "../../Assets/Logo/saberShibi.png"
import "./HomeNotLogged.css"
import {Typography, Row, Col, Button} from 'antd';
import { GithubOutlined } from '@ant-design/icons';
const { Title } = Typography;



export default function HomeNotLogged() {
    let history = useHistory();
    function gitHub(){
       window.location.replace("https://github.com/AlexArtaud-Dev");
    }


    const [loading, setLoading] = useState(true);
    if (loading){
        setTimeout(() =>{
            setLoading(false);
        },3000);
    }

    return(
       <div style={!loading ? {width:"100%",height:"100vh", backgroundImage: `url('https://localhost:3000/img/wavy-magenta-by-nouridio.svg')`, backgroundPosition:"bottom",backgroundRepeat:"no-repeat", backgroundAttachment:"fixed", backgroundSize:"2400px"} : {}}>
           {loading ? (
               <div style={{width:"100%",display:"flex", justifyContent:"center"}}>
                   <img style={{marginTop:"9%"}} className="logo" src={logo} alt={"MangAnime Logo"}/>
               </div>
           ) : (
              <div>
                  <Row justify="space-between" style={{width:"100%", paddingLeft:"5%", paddingTop:"1%", backgroundColor:"rgba(12,0,25,0.9)"}}>
                      <Title level={1}>MangAnime</Title>
                      <div style={{width:"25%"}}>
                          <Button style={{width:"35%", fontSize:"140%", paddingBottom:"7%"}} type="primary" shape="round" size={'large'} ghost>Register</Button>
                          <Button style={{width:"35%", fontSize:"140%", paddingBottom:"7%", marginLeft:"5%"}} type="primary" shape="round" size={'large'} >Login</Button>
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
                          <Button style={{width:"25%", paddingBottom:"1.8%", fontSize:"140%"}} type="primary" shape="round" icon={<GithubOutlined />} size={'large'} onClick={gitHub} ghost>Github</Button>
                          <Button style={{width:"25%", paddingBottom:"1.8%", fontSize:"140%", marginLeft:"4%"}} type="primary" shape="round" size={'large'} >Login</Button>
                      </div>
                      <div style={{marginTop:"5%", width:"50%", display:"flex", justifyContent:"center"}}>
                          <img style={{width:"60%"}} src={shibi} alt={"MangAnime Shibi"}/>
                      </div>
                  </div>
              </div>
           )}

       </div>
    );

}