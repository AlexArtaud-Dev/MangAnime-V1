import React, {useEffect, useState} from 'react';
import {Spin} from "antd";
import { Card } from 'antd';
import { ScrollPanel } from 'primereact/scrollpanel';
import "primereact/resources/primereact.min.css"
import {getTrending} from "../../Functions/animes";
import TrendingCard from "./TrendingCard";

const { Meta } = Card;
export default function Trending() {
    const [trendingRequest, setTrendingRequest] = useState({
        loading: true,
        trending: null,
    });

    useEffect(() => {
        getTrending(30)
            .then(data => {
                setTrendingRequest({
                    loading: false,
                    trending: data.data,
                });
            });
    }, []);

    const { loading, trending } = trendingRequest;
    const trendingArray = [];
    if (trending && trending.length !== 0){
        trending.forEach(anime => {
            trendingArray.push(<TrendingCard anime={anime}/>)
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
                        {trending.length === 0 ? (
                            <div style={{textAlign:"center", color:"white", fontSize:"300%", marginTop:"20%"}}>
                                Nothing Found
                            </div>
                        ) : (
                            <ScrollPanel style={{ width: '100%', height: '850px'}}>
                                <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
                                    {trendingArray}
                                </div>
                            </ScrollPanel>
                        )}
                    </div>
                )}
            </div>
    );

}