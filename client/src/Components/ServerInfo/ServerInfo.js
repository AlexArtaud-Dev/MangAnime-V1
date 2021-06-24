import React, {useEffect, useState} from 'react';
import { Knob } from 'primereact/knob';
import "primereact/resources/primereact.min.css"
import "./ServerInfo.css"
import {Progress} from "antd";
import Title from "antd/es/typography/Title";
import {getServerInfos} from "../../Functions/user";


export default function ServerInfo() {
    const [infos, setInfos] = useState({
        loading: true,
        cpuUsage: 0,
        ram: 0,
        elapsed: "00 : 00 : 00"
    })


    useEffect(() => {
        getServerInfos()
            .then(data => {
                let time = data.data.elapsed;
                time = time.replaceAll(":", " : ")
                setInfos({
                    loading: false,
                    cpuUsage: data.data.cpuUsage.toFixed(2),
                    ram: ((data.data.ram / 16000) * 100).toFixed(2),
                    elapsed: time
                });
            });

        setInterval(() => {
            getServerInfos()
                .then(data => {
                    let time = data.data.elapsed;
                    time = time.replaceAll(":", " : ")
                    setInfos({
                        cpuUsage: data.data.cpuUsage.toFixed(2),
                        ram: ((data.data.ram / 16000) * 100).toFixed(2),
                        elapsed: time
                    });
                });
        }, 30000)
    }, []);


    return(
            <div style={{width:"100%", height:"92vh", display:"flex", flexDirection:"column"}}>
                <div style={{display:"flex", flexDirection:"row", width:"100%", marginBottom:"2%"}}>
                    <div style={{width:"30%", backgroundColor:"#100024", color:"white", height:"44vh", marginRight:"10%", marginLeft:"15%", borderRadius:"45px", display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center", border:"3px #15002f", boxShadow:"3px 3px 3px 3px #15002f"}}>
                        <Title level={1}>CPU Usage</Title>
                        <Progress type="dashboard" trailColor="#2c0061" strokeColor={{'0%': '#ff0000', '100%': '#a02669'}}  percent={infos.cpuUsage} width="200px" strokeWidth={10} />
                    </div>
                    <div style={{width:"30%", backgroundColor:"#100024", height:"44vh", marginRight:"5%", borderRadius:"45px", display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center", border:"3px #15002f", boxShadow:"3px 3px 3px 3px #15002f"}}>
                        <Title level={1}>RAM Usage</Title>
                        <Progress type="dashboard" trailColor="#2c0061" strokeColor={{'0%': '#ff0000', '100%': '#a02669'}}  percent={infos.ram} width="200px" strokeWidth={10} />
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"row", width:"100%"}}>
                    <div style={{width:"30%", backgroundColor:"#100024", height:"44vh", marginRight:"10%", marginLeft:"15%", borderRadius:"45px", display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center", border:"3px #15002f", boxShadow:"3px 3px 3px 3px #15002f"}}>
                        <Title level={1}>Time Elapsed</Title>
                        <Title level={1}>{infos.elapsed}</Title>
                    </div>
                    <div style={{width:"30%", backgroundColor:"#100024", height:"44vh", marginRight:"5%", borderRadius:"45px", display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center", border:"3px #15002f", boxShadow:"3px 3px 3px 3px #15002f"}}>
                        4
                    </div>
                </div>
            </div>
    );

}