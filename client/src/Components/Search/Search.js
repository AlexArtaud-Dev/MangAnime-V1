import React, {useEffect, useState} from 'react';
import {message, Button, Input, Select, Spin} from "antd";
import { Card } from 'antd';
import { ScrollPanel } from 'primereact/scrollpanel';
import "primereact/resources/primereact.min.css"
import {getTrending, searchAnime} from "../../Functions/animes";
import SearchCard from "./SearchCard";
import Title from "antd/es/typography/Title";
import {Option} from "antd/es/mentions";
import {SearchOutlined} from "@ant-design/icons";
export default function Search() {
    const [searchRequest, setSearchRequest] = useState({
        loading: true,
        search: null,
        empty: true
    });
    const [searchValue, setSearchValue] = useState(null)
    const [searched, setSearched] = useState({
        status: false,
        component: <Title style={{color:"#a02669"}} level={1}>Start Searching</Title>
    })
    function onSearch(name){
        if (!searched.status){
            setSearched({
                status: true,
                component: <Spin size="large"/>
            })
        }
        setSearchRequest({loading: true})
        searchAnime(name).then(data => {
            console.log(data)
            setSearchRequest({
                loading: false,
                search: data.data
            })
        }).catch(error => {
            console.log(error)
        })
    }

    const { loading, search } = searchRequest;
    const searchArray = [];
    if (search && search.length !== 0){
        search.forEach(anime => {
            searchArray.push(<SearchCard anime={anime}/>)
        })
    }
    return(
            <div style={{color:"black"}}>
                <Input.Group compact style={{paddingBottom:"2%", paddingLeft:"1%", width:"50%"}} >
                    <Input style={{ width: '50%' }} placeholder={"Type an anime name to search"} size="large" onChange={(value) => setSearchValue(value.target.value)} onPressEnter={() => onSearch(searchValue)} allowClear/>
                    <Button type="primary" icon={<SearchOutlined />} size="large" onClick={() => onSearch(searchValue)}/>
                </Input.Group>
                {loading ? (
                    <div style={{textAlign:"center", marginTop:"22%", fontSize:"200%"}}>
                        {searched.component}
                    </div>
                ):(
                    <div>
                        {search.length === 0 ? (
                            <div style={{textAlign:"center", color:"white", fontSize:"300%", marginTop:"20%"}}>
                                Nothing Found
                            </div>
                        ) : (
                            <ScrollPanel style={{ width: '100%', height: '780px'}}>
                                <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
                                    {searchArray}
                                </div>
                            </ScrollPanel>
                        )}
                    </div>
                )}
            </div>
    );

}