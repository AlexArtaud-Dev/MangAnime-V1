import React from 'react';
import {Link, useParams } from "react-router-dom";

export default function Home() {
    const { id } = useParams();


    return(
        <div>
            Ceci est la page HOME {id}
            <button><Link to={"/acac"}>Test</Link></button>
        </div>
    );

}