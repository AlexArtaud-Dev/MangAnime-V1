import React, {useEffect, useState} from 'react';
import "primereact/resources/primereact.min.css"
import "./GenerateKey.css"
import Title from "antd/es/typography/Title";
import {message, Button, Alert, Input} from 'antd';
import {InputMask} from "primereact/inputmask";
import {CopyOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined} from "@ant-design/icons";
import {deleteKeyRequest, generateKeyRequest} from "../../Functions/keys";

export default function GenerateKey() {
    const [key, setKey] = useState(null);
    function copyToClipboard(){
        if (key){
            navigator.clipboard.writeText(key)
            message.success({
                content: 'Copied to Clipboard',
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
    function generate(){
        generateKeyRequest()
            .then(data => {
                setKey(data.data.APIKEY);
                message.success({
                    content: 'Key Generated',
                    style: {
                        float: "right"
                    },
                });
            })
            .catch(error => {
                message.error({
                    content: error.message,
                    style: {
                        float: "right"
                    },
                });
            })
    }
    function deleteKey(key){
        if (key){
            deleteKeyRequest(key)
                .then(data => {
                    setKey(null);
                    message.success({
                        content: 'Key Deleted',
                        style: {
                            float: "right"
                        },
                    });
                })
                .catch(error => {
                    message.error({
                        content: error.message,
                        style: {
                            float: "right"
                        },
                    });
                })
        }else{
            message.error({
                content: "You must generate a key before trying to delete !",
                style: {
                    float: "right"
                },
            });
        }

    }

    return(
        <div style={{display:"flex",justifyContent:"center", width:"100%"}}>
            <div style={{width:"50%", backgroundColor:"#100024", color:"white", height:"60vh", marginLeft:"5%", marginTop:"6%", borderRadius:"45px", display:"flex",flexDirection:"column", alignItems:"center", border:"3px #15002f", boxShadow:"3px 3px 3px 3px #15002f"}}>
                <Title style={{marginTop:"11%", fontSize:"400%", color:"white"}} >Generate Invitation Key</Title>
                <InputMask style={{backgroundColor:"#1d0040", color:"white", border:"none", width:"45%", height:"30px", textAlign:"center", fontsize:"300%", marginTop:"5%"}} id="basic" mask="*******-*******-*******-*******" value={key} placeholder="XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX" readOnly/>
                <div style={{width:"45%", marginTop:"5%"}}>
                    <Button style={{width:"45%", marginRight:'10%', fontSize:"120%"}}  icon={<CopyOutlined />} size='large' onClick={copyToClipboard}>Copy</Button>
                    <Button style={{width:"45%", fontSize:"120%"}}  icon={<DeleteOutlined />} size='large' onClick={() => deleteKey(key)}>Delete</Button>
                </div>
                <Button style={{width:"45%", marginTop:"5%", fontSize:"150%", paddingBottom:"4%"}} type="primary" size='large' onClick={generate}>GENERATE</Button>
            </div>
        </div>
    );

}