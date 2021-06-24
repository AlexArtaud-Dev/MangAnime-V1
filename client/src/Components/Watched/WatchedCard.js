import React from 'react';
import {Card, Tooltip} from 'antd';
import "./Watched.css"
import { useHistory } from "react-router-dom";

export default function WatchedCard({anime}) {
    let history = useHistory();

    function goToAnime(name){
        history.push(`/anime/${name}`);
    }

    return(
        <Tooltip placement="right" title={anime.name}>
            <Card hoverable onClick={() => goToAnime(anime.name)} style={{ width: 240, height:"340px", margin:"15px", backgroundColor:"#1d0040", textAlign:"center", fontsize:"" }} cover={<img style={{height:"340px"}} alt={anime.name} src={anime.picture} />}>
            </Card>
        </Tooltip>
    );

}