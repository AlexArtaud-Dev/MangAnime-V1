import React, {useEffect, useState} from 'react';
import {Spin} from "antd";
import { ScrollPanel } from 'primereact/scrollpanel';
import "primereact/resources/primereact.min.css"
import {getWatched} from "../../Functions/animes";
import WatchedCard from "./WatchedCard";


export default function Watched() {
    const [watchedRequest, setWatchedRequest] = useState({
        loading: true,
        watched: null,
    });

    useEffect(() => {
        getWatched()
            .then(data => {
                setWatchedRequest({
                    loading: false,
                    watched: data.data,
                });
            });
    }, []);

    const { loading, watched } = watchedRequest;
    const watchedArray = [];
    if (watched && watched.length !== 0){
        watched.forEach(anime => {
            watchedArray.push(<WatchedCard anime={anime}/>)
        })
    }
    return(
            <div style={{color:"black"}}>
                {loading ? (
                    <div style={{textAlign:"center", marginTop:"25%", fontSize:"200%"}}>
                        <Spin size="large"/>
                    </div>
                ):(
                    <div>
                        {watched.length === 0 ? (
                            <div style={{textAlign:"center", color:"white", fontSize:"300%", marginTop:"20%"}}>
                                Nothing Found
                            </div>
                        ) : (
                            <ScrollPanel style={{ width: '100%', height: '850px'}}>
                                <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
                                    {watchedArray}
                                </div>
                            </ScrollPanel>
                        )}
                    </div>
                )}
            </div>
    );

}