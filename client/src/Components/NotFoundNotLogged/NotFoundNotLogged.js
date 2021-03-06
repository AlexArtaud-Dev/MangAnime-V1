import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from "react-router-dom";

export default function NotFoundNotLogged() {
    let history = useHistory();
    function goHome(){
        history.push("/home");
    }

    return(
            <Result
                style={{color:"#FFFFFF"}}
                status="404"
                title={<p style={{fontSize:"150%", color:"#FFF", marginBottom:"0px"}}>404</p>}
                subTitle={<p style={{fontSize:"150%"}}>Sorry, the page you visited does not exist.</p>}
                extra={<Button type="primary" shape="round" size={"large"} style={{width:"18%"}} onClick={goHome}>Back Home</Button>}
            />
    );

}