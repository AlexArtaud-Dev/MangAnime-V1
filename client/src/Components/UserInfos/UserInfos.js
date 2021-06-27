import React, {useEffect, useState} from 'react';
import "primereact/resources/primereact.min.css"
import "./UserInfos.css"
import Title from "antd/es/typography/Title";
import {getQRCode} from "../../Functions/auth";
import {Button, Image, Input, Spin, Tooltip, message} from "antd";
import {getUserInfos, updateUser} from "../../Functions/user";
import {EditOutlined} from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";


export default function UserInfos() {
    const [userInfosRequest, setUserInfosRequest] = useState({
        loading: false,
        user: null
    });
    const [modals, setModals] = useState({
        modalOne: false,
        modalTwo: false,
        modalThree: false
    })
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    function onChangeOne(value){
        setUsername(value)
    }
    function onChangeTwo(value){
        setEmail(value)
    }
    function onChangeThree(value){
        setPassword(value)
    }
    function handleCancel(){
        setModals({
            modalOne: false,
            modalTwo: false,
            modalThree: false,
        })
        setUsername(null);
        setEmail(null);
        setPassword(null);
    }
    function openModalOne(){
        setModals({
            modalOne: true,
        })
    }
    function openModalTwo(){
        setModals({
            modalTwo: true,
        })
    }
    function openModalThree(){
        setModals({
            modalThree: true,
        })
    }
    function handleUsername(){
        if (/^[a-zA-Z]+(\w{6,})$/.test(username.toString())){
            setModals({modalOne: false})
            updateUser(username, null, null).then(data => {
                if (data.status === 200){
                    message.success({
                        content: "Username Changed",
                        style: {
                            float: "right",
                        }
                    });
                    setUserInfosRequest({loading: true})
                    getUserInfos()
                        .then(data => {
                            setUserInfosRequest({
                                loading: false,
                                user: data.data
                            });
                        });
                }else{
                    message.error({
                        content: data.data,
                        style: {
                            float: "right",
                        }
                    });
                }
            }).catch(error => {
                console.log(error)
            })
        }else{
            setModals({modalOne: false})
            message.error({
                content: "Only letters without special characters (6 characters minimum)",
                style: {
                    float: "right",
                }
            });
        }
    }
    function handleEmail(){
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.toString())){
            setModals({modalThree: false})
            updateUser(null, email, null).then(data => {
                if (data.status === 200){
                    message.success({
                        content: "Email Changed",
                        style: {
                            float: "right",
                        }
                    });
                    setUserInfosRequest({loading: true})
                    getUserInfos()
                        .then(data => {
                            setUserInfosRequest({
                                loading: false,
                                user: data.data
                            });
                        });
                }else{
                    message.error({
                        content: data.data,
                        style: {
                            float: "right",
                        }
                    });
                }
            }).catch(error => {
                console.log(error)
            })
        }else{
            setModals({modalTwo: false})
            message.error({
                content: "Wrong Email Format",
                style: {
                    float: "right",
                }
            });
        }
    }
    function handlePassword(){
        if (/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password.toString())){
            setModals({modalThree: false})
            updateUser(null, null, password).then(data => {
                if (data.status === 200){
                    message.success({
                        content: "Password Changed",
                        style: {
                            float: "right",
                        }
                    });
                    setUserInfosRequest({loading: true})
                    getUserInfos()
                        .then(data => {
                            setUserInfosRequest({
                                loading: false,
                                user: data.data
                            });
                        });
                }else{
                    message.error({
                        content: data.data,
                        style: {
                            float: "right",
                        }
                    });
                }
            }).catch(error => {
                console.log(error)
            })
        }else{
            setModals({modalThree: false})
            message.error({
                content: "Your password must contain 1 upper letter, 1 lower letter, 1 digit, 1 special char and 8 characters",
                style: {
                    float: "right",
                }
            });
        }
    }
    useEffect(() => {
        setUserInfosRequest({ loading: true });
        getUserInfos()
            .then(data => {
                setUserInfosRequest({
                    loading: false,
                    user: data.data
                });
            });
    }, []);

    const { loading, user } = userInfosRequest;

    return(
        <div style={{display:"flex",justifyContent:"center", width:"100%"}}>
            <Modal title="Change Username" style={{marginTop:"10%"}} visible={modals.modalOne} onOk={handleUsername} onCancel={handleCancel}>
                <Input placeholder="New Username" defaultValue={null} onChange={(value => {onChangeOne(value.target.value)})} onPressEnter={handleUsername}/>
            </Modal>
            <Modal title="Change Email" style={{marginTop:"10%"}} visible={modals.modalTwo} onOk={handleEmail} onCancel={handleCancel}>
                <Input placeholder="New Email" defaultValue={null} onChange={(value => {onChangeTwo(value.target.value)})} onPressEnter={handleEmail}/>
            </Modal>
            <Modal title="Change Password" style={{marginTop:"10%"}} visible={modals.modalThree} onOk={handlePassword} onCancel={handleCancel}>
                <Input.Password visibilityToggle onChange={(value => {onChangeThree(value.target.value)})} onPressEnter={handlePassword}/>
            </Modal>
            <div style={{width:"50%", backgroundColor:"#100024", color:"white", height:"60vh", marginLeft:"5%", marginTop:"6%", borderRadius:"45px", display:"flex",flexDirection:"column", alignItems:"center", border:"3px #15002f", boxShadow:"3px 3px 3px 3px #15002f"}}>
                {loading ? (
                    <Spin style={{width:"100%", textAlign:"center", marginTop:"30%"}} size="large"/>
                ) : (
                    <div style={{width:"100%", display:"flex",flexDirection:"column", marginTop:"4%", marginLeft:"5%"}}>
                        <Title style={{textAlign:"center"}} level={1}>User Informations</Title>
                        {user ? (
                            <div>
                                <div style={{marginTop:"4%", display:"flex",flexDirection:"column", width:"100%", alignItems:"center"}}>
                                    <Title style={{color :"#a02669"}} level={2}>Username</Title>
                                    <Tooltip placement="right" title="Click To Change">
                                        <Title style={{color :"white",marginTop:"0%", marginLeft:"2%", marginRight:"3%", cursor:"pointer"}} level={3} onClick={() => openModalOne()}>{user.nickname}</Title>
                                    </Tooltip>
                                </div>
                                <div style={{marginTop:"4%", display:"flex",flexDirection:"column", width:"100%", alignItems:"center"}}>
                                    <Title style={{color :"#a02669"}} level={2}>Email</Title>
                                    <Tooltip placement="right" title="Click To Change">
                                        <Title style={{color :"white",marginTop:"0%", marginLeft:"2%", marginRight:"3%", cursor:"pointer"}} level={3} onClick={() => openModalTwo()}>{user.email}</Title>
                                    </Tooltip>
                                </div>
                                <div style={{marginTop:"4%", display:"flex",flexDirection:"column", width:"100%", alignItems:"center"}}>
                                    <Title style={{color :"#a02669"}} level={2}>Password</Title>
                                    <Button style={{width:"20%"}} type="primary" icon={<EditOutlined />} onClick={() => openModalThree()}>Change Password</Button>
                                </div>
                            </div>
                        ) :
                        (
                            <div/>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

}