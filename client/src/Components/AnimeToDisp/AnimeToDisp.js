import React, {useEffect, useState} from 'react';
import "primereact/resources/primereact.min.css"
import "./AnimeToDisp.css"
import {getAnimeByName, getEpisode, upvoteAnime} from "../../Functions/animes";
import {Button, Carousel, Image, message, Rate, Spin} from 'antd';
import Title from "antd/es/typography/Title";
import {ScrollPanel} from "primereact/scrollpanel";
import {ArrowUpOutlined, DownloadOutlined, EditOutlined, LinkOutlined, TeamOutlined} from "@ant-design/icons";
import { Select } from 'antd';
import Modal from "antd/es/modal/Modal";
import AnimeToDispCharacterCard from "./AnimeToDispCharacterCard";
import AnimeToDispStaffCard from "./AnimeToDispStaffCard";
import {Option} from "antd/es/mentions";

export default function AnimeToDisp({animeName}) {

    const [anime, setAnime] = useState({
        loading: true,
        content: null
    })
    const [modals, setModals] = useState({
        modalOne : false,
        modalTwo: false,
        modalThree: false,
        modalFour: false
    })
    const [animeEpisode, setAnimeEpisode] = useState({
        streamStatus: false,
        streamEpisodes: null,
        downloadStatus: false,
        downloadEpisodes: null
    })
    const [streaming, setStreaming] = useState(1)
    const [download, setDownload] = useState(1)
    function upvoteAnimeFunc(name, url){
        if (!name) {
            message.info("Missing Anime Name to Upvote");
        }
        if (!url) {
            message.info("Missing Anime URL to Upvote");
        }
        upvoteAnime(name, url).then(data => {
            if (data.status === 200){
                message.success("Anime Upvoted");
            }else{
                message.info(data.data);
            }

        }).catch(error => {
            console.log(error)
        })
    }
    function handleStreamChange(value){
        setStreaming(value);
    }
    function handleDownloadChange(value){
        setDownload(value);
    }
    function resetAnime(){
        setAnimeEpisode({
            streamStatus: false,
            streamEpisodes: null,
            downloadStatus: false,
            downloadEpisodes: null
        })
    }
    function getStreamingLinks(name, episode){
        setAnimeEpisode({streamStatus: true});
        setModals({modalThree : true});
        getEpisode(name, episode).then(data => {
            if(data.status === 200){
                setAnimeEpisode({streamStatus: false, streamEpisodes: data.data})
            }else{
                setAnimeEpisode({streamStatus: false, streamEpisodes: []})
            }
        }).catch(error => {
            console.log(error);
        })
    }
    function getDownloadLinks(name, episode){
        setAnimeEpisode({downloadStatus: true});
        setModals({modalFour : true});
        getEpisode(name, episode).then(data => {
            if(data.status === 200){
                setAnimeEpisode({downloadStatus: false, downloadEpisodes: data.data})
            }else{
                setAnimeEpisode({downloadStatus: false, downloadEpisodes: []})
            }
        }).catch(error => {
            console.log(error);
        })
    }
    useEffect(() => {
        getAnimeByName(animeName).then(data => {
            setAnime({
                loading: false,
                content: data.data
            })
        }).catch(error => {
            message.error(error);
        })
    }, []);

    const {loading, content} = anime;
    const characterArray = [];
    const staffArray = [];
    const episodeArray = [];
    const streamingArray = [];
    const downloadArray = [];
    if (content){
        if (content.characters && content.characters.length !== 0){
            content.characters.forEach(character => {
                characterArray.push(<AnimeToDispCharacterCard character={character}/>)
            })
        }
        if (content.staff && content.staff.length !== 0){
            content.staff.forEach(staff => {
                staffArray.push(<AnimeToDispStaffCard staff={staff}/>)
            })
        }
        if (content.episodesNumber && content.episodesNumber !== 0){
            for (let i = 1; i <= content.episodesNumber; i++) {
                episodeArray.push(<Option value={i}>Episode {i}</Option>)
            }
        }
        if (animeEpisode.streamEpisodes){
            animeEpisode.streamEpisodes.videoLinks.streamingLinks.forEach(link => {
                streamingArray.push(<Button type="primary" style={{cursor:"pointer", width:"30%", textAlign:"center", fontSize:"120%", marginBottom:"3%", paddingBottom:"6%"}} onClick={() => {window.open(link.url,'_blank')}}>{link.server}</Button>)
            })
        }
        if (animeEpisode.downloadEpisodes){
            animeEpisode.downloadEpisodes.videoLinks.downloadLinks.forEach(link => {
                downloadArray.push(<Button type="primary" style={{cursor:"pointer", width:"30%", textAlign:"center", fontSize:"120%", marginBottom:"3%", paddingBottom:"6%"}} onClick={() => {window.open(link.url,'_blank')}}>{link.server}</Button>)
            })
        }
    }


    return(
        <div style={{width:"100%"}}>
            {animeName && loading ? (
                <div style={{width:"100%", textAlign:"center"}}>
                    <Title style={{color:"#a02669", marginBottom:"2%", marginTop:"17%"}} level={1}>Loading Anime Informations</Title>
                    <Spin size="large"/>
                </div>
            ) : (
                <div style={{width:"100%", display:"flex", flexDirection:"column"}}>
                    <div style={{width:"100%", height:"50vh", display:"flex", flexDirection:"row"}}>
                    <Modal title="Anime Characters" centered visible={modals.modalOne} okText="Close" onCancel={() => setModals({modalOne: false})} onOk={() => setModals({modalOne: false})}>
                        <Carousel autoplay={true}>
                            {characterArray}
                        </Carousel>
                    </Modal>
                    <Modal title="Anime Staff" centered visible={modals.modalTwo} okText="Close" onCancel={() => setModals({modalTwo: false})} onOk={() => setModals({modalTwo: false})}>
                        <Carousel autoplay={true}>
                            {staffArray}
                        </Carousel>
                    </Modal>
                    <div style={{width:"25%", textAlign:"center"}}>
                        <Image
                            style={{cursor:"pointer"}}
                            width={360}
                            height={470}
                            preview={false}
                            src={content.picture}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                            onClick={() => {window.open(content.trailer,'_blank');}}
                        />
                    </div>
                    <div style={{width:"65%"}}>
                        <div style={{display:"flex", flexDirection:"row", width:"100%", justifyContent:"space-between"}}>
                            <Title style={{color:"#a02669", marginBottom:"0%"}} level={1} >{content.name} ({content.diffusionType} - {content.status})</Title>
                            <Button style={{width:"15%", fontSize:"130%", paddingBottom:"2.5%"}} type="primary" shape="round" icon={<ArrowUpOutlined />} size="large" onClick={() => upvoteAnimeFunc(content.name, content.url)}>Upvote</Button>
                        </div>

                        <Title style={{color:"#a02669", margin:"0%"}} level={4}>{content.studios.join(" / ")} - {content.releaseDate}</Title>
                        <Rate disabled count={10} defaultValue={content.score} />
                        <Title style={{color:"#a02669", margin:"0%", marginTop:"1%"}} level={4}>Synopsis :</Title>
                        <ScrollPanel style={{ width: '100%', height: '140px', color:"white", fontSize:"135%", paddingLeft:"2%"}}>
                            {content.synopsis.replace("[Written by MAL Rewrite]", "")}
                        </ScrollPanel>
                        {content.genres && content.genres.length !== 0 ? (
                        <div style={{display:"flex", flexDirection:"row", width:"100%", marginTop:"1%"}}>
                            <Title style={{color:"#a02669", margin:"0%"}} level={4}>Genre :</Title>
                            <Title style={{color:"white", marginTop:"0%", marginLeft:"1%", fontSize:"135%"}} level={4}>{content.genres.join(" ,")}</Title>
                        </div>
                        ) : (
                            <div/>
                        )}
                        {content.episodesNumber ? (
                        <div style={{display:"flex", flexDirection:"row", width:"100%", marginTop:"1%"}}>
                            <Title style={{color:"#a02669", margin:"0%"}} level={4}>Episodes :</Title>
                            <Title style={{color:"white", marginTop:"0%", marginLeft:"1%", fontSize:"135%"}} level={4}>{content.episodesNumber} ({content.episodeDuration})</Title>
                        </div>
                        ) : (
                            <div/>
                        )}
                        {content.producers &&content.producers.length !== 0 ? (
                        <div style={{display:"flex", flexDirection:"row", width:"100%", marginTop:"1%"}}>
                            <Title style={{color:"#a02669", margin:"0%"}} level={4}>Studios :</Title>
                            <Title style={{color:"white", marginTop:"0%", marginLeft:"1%", fontSize:"135%"}} level={4}>{content.producers.join(' ,')}</Title>
                        </div>
                        ) : (
                            <div/>
                        )}
                        {content.broadcastTime ? (
                            <div style={{display:"flex", flexDirection:"row", width:"100%", marginTop:"1%"}}>
                                <Title style={{color:"#a02669", margin:"0%"}} level={4}>Broadcast Date :</Title>
                                <Title style={{color:"white", marginTop:"0%", marginLeft:"1%", fontSize:"135%"}} level={4}>{content.broadcastTime}</Title>
                            </div>
                        ) : (
                            <div/>
                        )}
                        <div style={{display:"flex", flexDirection:"row", width:"100%", marginTop:"1%", justifyContent:"right"}}>
                            {content.characters && content.characters.length !== 0 ? (
                                <Button style={{width:"15%", fontSize:"130%", paddingBottom:"2.5%"}} type="primary"  icon={<TeamOutlined />} size="large" onClick={() => setModals({modalOne: true})}>Characters</Button>
                            ) : (
                                <div/>
                            )}
                            {content.staff && content.staff.length !== 0 ? (
                                <Button style={{width:"15%", fontSize:"130%", paddingBottom:"2.5%", marginLeft:"2%"}} type="primary"  icon={<EditOutlined />} size="large" onClick={() => setModals({modalTwo: true})}>Staff</Button>
                            ) : (
                                <div/>
                            )}

                        </div>
                    </div>
                </div>
                    <div style={{width:"89%", height:"20vh", marginTop:"3%", marginLeft:"2%", borderTop:"2px solid #a02669", display:"flex",flexDirection:"row"}}>
                        <Modal title="Anime Streaming Links" centered visible={modals.modalThree} okText="Close" onCancel={() => {resetAnime();setModals({modalThree: false})}} onOk={() => {resetAnime();setModals({modalThree: false})}}>
                            {animeEpisode.streamStatus ? (
                                <div>
                                    <Title style={{color:"#a02669", marginBottom:"4%",textAlign:"center"}} level={4} >Scrapping NASA Database</Title>
                                    <Spin style={{width:"100%", textAlign:"center"}} size="large"/>
                                </div>
                            ) : (
                                <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap", justifyContent:"space-between"}}>
                                    {streamingArray}
                                </div>
                            )}
                        </Modal>
                        <Modal title="Anime Download Links" centered visible={modals.modalFour} okText="Close" onCancel={() => {resetAnime();setModals({modalFour: false})}} onOk={() => {resetAnime();setModals({modalFour: false})}}>
                            {animeEpisode.downloadStatus ? (
                                <div>
                                    <Title style={{color:"#a02669", marginBottom:"4%",textAlign:"center"}} level={4} >Scrapping NASA Database</Title>
                                    <Spin style={{width:"100%", textAlign:"center"}} size="large"/>
                                </div>
                            ) : (
                                <div style={{width:"100%"}}>
                                    {downloadArray.length === 0 ? (
                                        <Title style={{color:"#a02669"}} level={1} >Cloudflare Error (Fix Soon)</Title>
                                    ) : (
                                        <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap", justifyContent:"space-between"}}>
                                            {streamingArray}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Modal>
                        <div style={{width:"46%", marginLeft:"4%"}}>
                            <Title style={{color:"#a02669", marginBottom:"0%", marginTop:"4%", marginLeft:"2%"}} level={1} >Episode Stream</Title>
                            <div style={{marginLeft:"2%", width:"100%"}}>
                                <Select size="large" defaultValue={1} onChange={handleStreamChange} style={{ width: 320, marginLeft:"2%", marginTop:"1%" }}>
                                    {episodeArray}
                                </Select>
                                <Button style={{marginLeft:"2%", width:"15%"}} type="primary" icon={<LinkOutlined />} size="large" onClick={() => getStreamingLinks(content.name, streaming)}>
                                    Get Links
                                </Button>
                            </div>
                        </div>
                        <div style={{width:"43%", marginLeft:"7%"}}>
                            <Title style={{color:"#a02669", marginBottom:"0%", marginTop:"4%", marginLeft:"2%"}} level={1} >Episode Download</Title>
                            <div style={{marginLeft:"2%", width:"100%"}}>
                                <Select size="large" defaultValue={1} onChange={handleDownloadChange} style={{ width: 320, marginLeft:"2%", marginTop:"1%" }}>
                                    {episodeArray}
                                </Select>
                                <Button style={{marginLeft:"2%", width:"17%"}} type="primary" icon={<LinkOutlined />} size="large" onClick={() => getDownloadLinks(content.name, streaming)}>
                                    Get Links
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}