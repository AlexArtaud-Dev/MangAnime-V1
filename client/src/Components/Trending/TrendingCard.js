import React from 'react';
import {Card, Tooltip} from 'antd';
import "./TrendingCard.css"
import { useHistory } from "react-router-dom";

export default function TrendingCard({anime}) {
    let history = useHistory();

    function goToAnime(name){
        name = name.replaceAll("/","%2F")
        history.push(`/anime/${name}`);
    }

    return(
        <Tooltip placement="right" title={anime.name}>
            <Card hoverable onClick={() => goToAnime(anime.name)} style={{ width: 240, margin:"15px", backgroundColor:"#1d0040", textAlign:"center", fontsize:"" }} cover={<img style={{height:"340px"}} alt={anime.name} src={anime.image} />}>
            </Card>
        </Tooltip>
    );

}