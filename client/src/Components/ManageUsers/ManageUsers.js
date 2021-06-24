import React, {useEffect, useState} from 'react';
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "./ManageUsers.css"
import Title from "antd/es/typography/Title";
import {ScrollPanel} from "primereact/scrollpanel";
import {deleteKeyRequest, getAllKeysRequest} from "../../Functions/keys";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Button, Input, InputNumber, message, Popconfirm, Select, Spin, Tooltip} from "antd";
import {CopyOutlined, DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import {Option} from "antd/es/mentions";


export default function ManageUsers() {

    const [keysRequest, setKeysRequest] = useState({
        loading: true,
        keys: null,
    });
    const [search, setSearch] = useState({
        message: "Search for an username",
        length: undefined
    })
    const [searchValue, setSearchValue] = useState(null)
    console.log(searchValue);
    function changeAttributeCategory(value){
        switch (value){
            case "nickname":
                setSearch("Search for an username")
                break;
            case "email":
                setSearch({
                    message: "Search for an email",
                    length: undefined
                })
                break;
            case "letter":
                setSearch({
                    message: "Search users by one letter",
                    length: 1
                })
                break;
        }
    }
    function copyToClipboardCreatorID(creatorID){
        if (creatorID){
            navigator.clipboard.writeText(creatorID)
            message.success({
                content: "Copied Creator ID!",
                style: {
                    float: "right"
                },
            });
        }else{
            message.error({
                content: "You can't copy an ID that does not exist !",
                style: {
                    float: "right"
                },
            });
        }
    }
    function copyToClipboard(key){
        if (key){
            navigator.clipboard.writeText(key)
            message.success({
                content: "Copied Invitation Key !",
                style: {
                    float: "right"
                },
            });
        }else{
            message.error({
                content: "You can't copy a key that you never generated !",
                style: {
                    float: "right"
                },
            });
        }
    }
    function deleteKey(key){
        deleteKeyRequest(key)
            .then(data => {
                if (data.status === 200){
                    message.success({
                        content: data.data.message,
                        style: {
                            float: "right"
                        },
                    });
                    setKeysRequest({loading: true})
                    getAllKeysRequest()
                        .then(data => {
                            setKeysRequest({
                                loading: false,
                                keys: data.data,
                            });
                        });
                }else{
                    console.log(data.data.error)
                    message.error({
                        content: data.data.error,
                        style: {
                            float: "right"
                        }
                    });
                }

            }).catch(error =>{
                message.error({
                    content: error.data.error,
                    style: {
                        float: "right"
                    },
                });
        })
    }
    useEffect(() => {
        getAllKeysRequest()
            .then(data => {
                setKeysRequest({
                    loading: false,
                    keys: data.data,
                });
            });
    }, []);

    const { loading, keys } = keysRequest;
    const keyArray = [];
    if (keys && keys.length !== 0){
        console.log(keys)
        keys.forEach(key => {
            const creationNotTreated = key.creationDate.split("T")
            let date = creationNotTreated[0]
            date = date.split("-");
            date = date[2] + "/" + date[1] + "/" + date[0];
            const expirationNotTreated = key.expirationDate.split("T")
            let date2 = expirationNotTreated[0]
            let horary = expirationNotTreated[1].split(".")[0]
            date2 = date2.split("-");
            date2 = date2[2] + "/" + date2[1] + "/" + date2[0] + "-" + horary;
            keyArray.push(
                <AccordionTab header={
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <div style={{textAlign:"left", width:"17%"}}>{key.creatorName}</div>
                      <div style={{textAlign:"center", width:"65%"}}>{key.UUID}</div>
                      <div style={{textAlign:"center", width:"10%"}}>{date}</div>
                    </div>
                }>
                    <div style={{backgroundColor:"#1d0040", marginBottom:"0px", display:"flex", flexDirection:"column", width:"100%", padding:"1%"}}>
                        <div style={{display:"flex",flexDirection:"row", width:"100%", justifyContent:"center", marginBottom:"3%"}}>
                            <div style={{width:"45%", marginRight:"2%", textAlign:"center"}}>
                                <Title style={{color:"#a02669"}} level={4}>Invitation Key</Title>
                                <Title level={5}>{key.APIKEY}</Title>
                            </div>
                            <div style={{width:"45%", textAlign:"center"}}>
                                <Title style={{color:"#a02669"}} level={4}>Encrypted Key</Title>
                                <Title level={5}>{key.UUID}</Title>
                            </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row", width:"100%", justifyContent:"center", marginBottom:"3%"}}>
                            <div style={{width:"45%", marginRight:"2%", textAlign:"center"}}>
                                <Title style={{color:"#a02669"}} level={4}>Expiration Date</Title>
                                <Title level={5}>{date2}</Title>
                            </div>
                            <div style={{width:"45%", textAlign:"center"}}>
                                <Title style={{color:"#a02669"}} level={4}>Creator</Title>
                                <Title level={5} onClick={() => copyToClipboardCreatorID(key.creatorID)}>{key.creatorName}</Title>
                            </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row", width:"100%", justifyContent:"center"}}>
                            <div style={{width:"45%", marginRight:"2%"}}>
                                <Button icon={<CopyOutlined />} type="primary" style={{width:"100%", fontSize:"130%", marginBottom:"2%", paddingBottom:"5%"}} onClick={() => copyToClipboard(key.APIKEY)}>
                                    Copy Key
                                </Button>
                            </div>
                            <div style={{width:"45%"}}>
                                <Button danger icon={<DeleteOutlined />} style={{width:"100%", fontSize:"130%", marginBottom:"2%", paddingBottom:"5%"}} onClick={() => deleteKey(key.APIKEY)}>
                                    Delete Key
                                </Button>
                            </div>
                        </div>
                    </div>
                </AccordionTab>
            )
        })
    }

    return(
        <div style={{display:"flex",justifyContent:"center", width:"100%"}}>
            <div style={{width:"85%", backgroundColor:"#100024", color:"white", height:"80vh", marginLeft:"5%", marginTop:"2%", borderRadius:"45px", display:"flex",flexDirection:"column", alignItems:"center", border:"3px #15002f", boxShadow:"3px 3px 3px 3px #15002f", textAlign:"center"}}>
                <Title style={{marginTop:"3%", fontSize:"400%", color:"white"}} >Manage Users</Title>
                <Input.Group compact style={{paddingBottom:"3%"}} >
                    <Select defaultValue="nickname" size="large" onChange={(value) => changeAttributeCategory(value)} >
                        <Option value="nickname">Username</Option>
                        <Option value="email">Email</Option>
                        <Option value="letter">Letter</Option>
                    </Select>
                    <Input style={{ width: '50%' }} maxLength={search.length} placeholder={search.message} size="large" onChange={(value) => setSearchValue(value.target.value)} allowClear/>
                    <Button type="primary" icon={<SearchOutlined />} size="large" />
                </Input.Group>
                {!loading && keyArray.length !== 0 ? (
                    <ScrollPanel style={{ width: '90%', height: '520px'}}>
                        <Accordion>
                            {keyArray}
                        </Accordion>
                    </ScrollPanel>
                ) : (
                    <div style={{textAlign:"center", marginTop:"15%", fontSize:"200%"}}>
                        <Spin size="large"/>
                    </div>
                )}


            </div>
        </div>
    );

}