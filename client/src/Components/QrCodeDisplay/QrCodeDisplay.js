import React, {useEffect, useState} from 'react';
import "primereact/resources/primereact.min.css"
import "./QrCodeDisplay.css"
import Title from "antd/es/typography/Title";
import {getQRCode} from "../../Functions/auth";
import {Image, Spin} from "antd";


export default function QrCodeDisplay() {
    const [qrCodeRequest, setQrCodeRequest] = useState({
        loading: false,
        qrCode: null
    });

    useEffect(() => {
        // Note that this replaces the entire object and deletes user key!
        setQrCodeRequest({ loading: true });
        getQRCode()
            .then(data => {
                setQrCodeRequest({
                    loading: false,
                    qrCode: data.data
                });
            });
    }, []);

    const { loading, qrCode } = qrCodeRequest;

    return(
        <div style={{display:"flex",justifyContent:"center", width:"100%"}}>
            <div style={{width:"50%", backgroundColor:"#100024", color:"white", height:"60vh", marginLeft:"5%", marginTop:"6%", borderRadius:"45px", display:"flex",flexDirection:"column", alignItems:"center", border:"3px #15002f", boxShadow:"3px 3px 3px 3px #15002f"}}>
                {loading ? (
                    <Spin style={{width:"100%", textAlign:"center", marginTop:"30%"}} size="large"/>
                ) : (
                    <div style={{width:"100%", display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <Title style={{marginTop:"11%", fontSize:"370%", color:"white", textAlign:"center"}} >Scan to connect on another device</Title>
                        <Image
                            style={{border:"3px solid #a02669"}}
                            width={300}
                            src={qrCode}
                        />
                    </div>
                )}
            </div>
        </div>
    );

}