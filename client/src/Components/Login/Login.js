import React from 'react';
import {Form, Input, Button, Checkbox, Typography, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {goLocalLogin} from "../../Functions/auth"

import "./Login.css"
const { Title } = Typography;


export default function Login() {


    function goHome(){
        window.location.replace("https://localhost:3000/");
    }
    const onFinish = (values) => {
        const emailRegex = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');
        goLocalLogin(values.email, values.password, values.remember).then(result => {
            if (!emailRegex.test(values.email)){
                message
                    .loading('Trying to log you in..', 0.5)
                    .then(() => message.warning("Bad email format", 3))
            }else{
                if (result){
                    if (result.status === 200){
                        message
                            .loading('Trying to log you in..', 1)
                            .then(() => message.success(result.message, 3))
                            .then(() => {
                                message.info('Redirecting...', 1);
                                goHome();
                            });
                    }else{
                        message
                            .loading('Trying to log you in..', 1)
                            .then(() => message.error(result.message, 3))
                    }
                }
            }
        })
    };

    return(
        <div style={{display:"flex", justifyContent:"center", width:"100%", paddingTop:"13%"}} >
            <div style={{width:"20%", border:"2px solid #a02669", borderRadius:"25px", padding:"2%", paddingBottom:"1%", backgroundColor:"#0b0018",boxShadow:"6px 6px 6px #190036"}}>
                <Title style={{textAlign:"center", fontSize:"400%"}}>Login</Title>
                <Form name="normal_login" className="login-form" initialValues={{remember: true,}} onFinish={onFinish}>
                    <Form.Item name="email" rules={[{required: true, message: 'Please input your email!',},]}>
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{required: true, message: 'Please input your Password!',},]}>
                        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password"/>
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a style={{float:"right", fontSize:"110%"}} className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button style={{width:"100%", fontSize:"140%", paddingBottom:"10%"}} type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        <p style={{marginTop:"5px", fontSize:"110%", float:"right"}}><a href="">Register now!</a></p>
                    </Form.Item>
                </Form>
            </div>
        </div>


    );

}