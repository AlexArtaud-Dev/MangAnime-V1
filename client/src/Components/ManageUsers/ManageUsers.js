import React, {useEffect, useState} from 'react';
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "./ManageUsers.css"
import Title from "antd/es/typography/Title";
import {ScrollPanel} from "primereact/scrollpanel";
import {deleteKeyRequest, getAllKeysRequest} from "../../Functions/keys";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Button, Input, InputNumber, message, Popconfirm, Select, Spin, Tooltip} from "antd";
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CopyOutlined,
    DeleteOutlined,
    FallOutlined,
    RiseOutlined,
    SearchOutlined
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import {Option} from "antd/es/mentions";
import {deleteUserOrAdmin, demote, elevate, searchUsers} from "../../Functions/user";
import Modal from "antd/es/modal/Modal";


export default function ManageUsers() {

    const [usersRequest, setUsersRequest] = useState({
        loading: true,
        users: null
    });
    const [status, setStatus] = useState(<Title style={{marginTop:"15%", fontSize:"200%", color:"white"}} >Search to get result</Title>)
    const [defaultInputVal, setDefaultInputVal] = useState(null);
    const [firstModal, setFirstModal] = useState({
        state: false,
        userID: "",
        ownerPassword: ""
    });
    const [secondModal, setSecondModal] = useState(false);
    const [search, setSearch] = useState({
        message: "Search for an username",
        index: "nickname",
        length: undefined
    })
    const [searchValue, setSearchValue] = useState(null)
    const [searchCache, setSearchCache] = useState({
        searchIndex: null,
        searchValue: null
    })
    function getUsers() {
        if (!searchValue) {
            message.error({
                content: "You can't search nothing !",
                style: {
                    float: "right"
                },
            });
        }else{
            setSearchCache({
                searchIndex: search.index,
                searchValue: searchValue
            })
            if (search.index === "email"){
                if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(searchValue.toString())){
                    setUsersRequest({loading: true})
                    searchUsers(null, searchValue.toLowerCase(), null).then(users => {
                        if (users.status === 200){
                            setStatus(null)
                            setUsersRequest({
                                loading: false,
                                users: users.data
                            })
                        }else{
                            setStatus(<Title style={{marginTop:"15%", fontSize:"200%", color:"white"}} >Nothing Found</Title>)
                        }
                    }).catch(error => {
                        message.error({
                            content: error.data.error,
                            style: {
                                float: "right"
                            },
                        });
                    })
                }else{
                    message.error({
                        content: "Please enter a valid email format",
                        style: {
                            float: "right"
                        },
                    });
                }
            }else{
                if (search.index === "letter"){
                    if (searchValue.length === 1){
                        setUsersRequest({loading: true})
                        searchUsers(null, null, searchValue).then(users => {
                            if (users.status === 200){
                                setStatus(null)
                                setUsersRequest({
                                    loading: false,
                                    users: users.data
                                })
                            }else{
                                setStatus(<Title style={{marginTop:"15%", fontSize:"200%", color:"white"}} >Nothing Found</Title>)
                            }
                        }).catch(error => {
                            message.error({
                                content: error.data.error,
                                style: {
                                    float: "right"
                                },
                            });
                        })
                    }else{
                        message.error({
                            content: "You must only use one letter for this search type !",
                            style: {
                                float: "right"
                            },
                        });
                    }
                }else{
                    setUsersRequest({loading: true})
                    searchUsers(searchValue, null, null).then(users => {
                        if (users.status === 200){
                            setStatus(null)
                            setUsersRequest({
                                loading: false,
                                users: users.data
                            })
                        }else{
                            setStatus(<Title style={{marginTop:"15%", fontSize:"200%", color:"white"}} >Nothing Found</Title>)
                        }
                    }).catch(error => {
                        message.error({
                            content: error.message,
                            style: {
                                float: "right"
                            },
                        });
                    })
                }
            }

        }

    }
    function changeAttributeCategory(value){
        setDefaultInputVal(null)
        switch (value){
            case "nickname":
                setSearch({
                    message: "Search for an username",
                    index: "nickname",
                    length: undefined
                })
                break;
            case "email":
                setSearch({
                    message: "Search for an email",
                    index: "email",
                    length: undefined
                })
                break;
            case "letter":
                setSearch({
                    message: "Search users by one letter",
                    index: "letter",
                    length: 1
                })
                break;
        }
    }
    function copyToClipboardUserID(userID){
        if (userID){
            navigator.clipboard.writeText(userID)
            message.success({
                content: "Copied User ID!",
                style: {
                    float: "right"
                },
            });
        }else{
            message.error({
                content: "You can't copy an ID that does not exist !",
                style: {
                    float: "right"
                },
            });
        }
    }
    function deleteUser(userID){
        deleteUserOrAdmin(userID).then(res => {
            if (res.status === 200){
                setUsersRequest({loading: true})
                let nickname, email, letter = null;
                switch (searchCache.searchIndex) {
                    case "nickname":
                        nickname = searchCache.searchValue;
                        break;
                    case "email":
                        email = searchCache.searchValue;
                        break;
                    case "letter":
                        letter = searchCache.searchValue;
                        break;
                }
                searchUsers(nickname, email, letter).then(users => {
                    if (users.status === 200) {
                        setStatus(null)
                        setUsersRequest({
                            loading: false,
                            users: users.data
                        })
                    } else {
                        setStatus(<Title style={{marginTop: "15%", fontSize: "200%", color: "white"}}>Nothing Found</Title>)
                    }
                })
                message.success({
                    content: "Deleted",
                    style: {
                        float: "right"
                    },
                });
            }else{
                message.error({
                    content: res.data.message,
                    style: {
                        float: "right"
                    },
                });
            }
        }).catch(error => {})
    }
    function deleteAdminModal(userID){
        setFirstModal({
            state: true,
            userID: userID.toString()
        })
    }
    function deleteAdmin(userID, ownerPassword){
        if (ownerPassword && userID){
            deleteUserOrAdmin(userID, ownerPassword).then(res => {
                if (res.status === 200){
                    setUsersRequest({loading: true})
                    let nickname, email, letter = null;
                    switch (searchCache.searchIndex) {
                        case "nickname":
                            nickname = searchCache.searchValue;
                            break;
                        case "email":
                            email = searchCache.searchValue;
                            break;
                        case "letter":
                            letter = searchCache.searchValue;
                            break;
                    }
                    searchUsers(nickname, email, letter).then(users => {
                        if (users.status === 200) {
                            setStatus(null)
                            setUsersRequest({
                                loading: false,
                                users: users.data
                            })
                        } else {
                            setStatus(<Title style={{marginTop: "15%", fontSize: "200%", color: "white"}}>Nothing Found</Title>)
                        }
                    })
                    message.success({
                        content: "Deleted",
                        style: {
                            float: "right"
                        },
                    });
                    setFirstModal({state: false})
                }else{
                    message.error({
                        content: res.data.message,
                        style: {
                            float: "right"
                        },
                    });
                }
            }).catch(error => {})
        }
    }
    function elevateUser(userID){
        elevate(userID).then(res => {
            if (res.status === 200){
                message.success({
                    content: "Elevated",
                    style: {
                        float: "right"
                    },
                });
                setUsersRequest({loading: true})
                let nickname, email, letter = null;
                switch (searchCache.searchIndex) {
                    case "nickname":
                        nickname = searchCache.searchValue;
                        break;
                    case "email":
                        email = searchCache.searchValue;
                        break;
                    case "letter":
                        letter = searchCache.searchValue;
                        break;

                }
                searchUsers(nickname, email, letter).then(users => {
                    if (users.status === 200) {
                        setStatus(null)
                        setUsersRequest({
                            loading: false,
                            users: users.data
                        })
                    } else {
                        setStatus(<Title style={{marginTop: "15%", fontSize: "200%", color: "white"}}>Nothing Found</Title>)
                    }
                })
            }else{
                message.error({
                    content: res.data.message,
                    style: {
                        float: "right"
                    },
                });
            }

        }).catch(error => {})
    }
    function demoteAdminModal(userID){
        setSecondModal({
            state: true,
            userID: userID.toString()
        })
    }
    function demoteAdmin(userID, ownerPassword){
        if (ownerPassword && userID){
            demote(userID, ownerPassword).then(res => {
                if (res.status === 200){
                    setUsersRequest({loading: true})
                    let nickname, email, letter = null;
                    switch (searchCache.searchIndex) {
                        case "nickname":
                            nickname = searchCache.searchValue;
                            break;
                        case "email":
                            email = searchCache.searchValue;
                            break;
                        case "letter":
                            letter = searchCache.searchValue;
                            break;
                    }
                    searchUsers(nickname, email, letter).then(users => {
                        if (users.status === 200) {
                            setStatus(null)
                            setUsersRequest({
                                loading: false,
                                users: users.data
                            })
                        } else {
                            setStatus(<Title style={{marginTop: "15%", fontSize: "200%", color: "white"}}>Nothing Found</Title>)
                        }
                    })
                    message.success({
                        content: "Demoted",
                        style: {
                            float: "right"
                        },
                    });
                    setSecondModal({state: false})
                }else{
                    message.error({
                        content: res.data.message,
                        style: {
                            float: "right"
                        },
                    });
                }
            }).catch(error => {})
        }
    }

    const { loading, users } = usersRequest;
    const userArray = [];
    if (users && users.length !== 0){
        users.forEach(user => {
            const creationNotTreated = user.creationDate.split("T")
            let date = creationNotTreated[0]
            date = date.split("-");
            date = date[2] + "/" + date[1] + "/" + date[0];
            userArray.push(
                <AccordionTab header={
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <div style={{textAlign:"left", width:"17%"}}>{user.nickname}</div>
                      <div style={{textAlign:"center", width:"10%"}}>{date}</div>
                    </div>
                }>
                    <div style={{backgroundColor:"#1d0040", marginBottom:"0px", display:"flex", flexDirection:"column", width:"100%", padding:"1%"}}>
                        <div style={{display:"flex",flexDirection:"row", width:"100%", justifyContent:"center", marginBottom:"3%"}}>
                            <div style={{width:"45%", marginRight:"2%", textAlign:"center"}}>
                                <Title style={{color:"#a02669"}} level={4}>Username</Title>
                                <Title level={5}>{user.nickname}</Title>
                            </div>
                            <div style={{width:"45%", textAlign:"center"}}>
                                <Title style={{color:"#a02669"}} level={4}>User ID</Title>
                                <Title level={5}>{user._id}</Title>
                            </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row", width:"100%", justifyContent:"center", marginBottom:"3%"}}>
                            <div style={{width:"45%", marginRight:"2%", textAlign:"center"}}>
                                <Title style={{color:"#a02669"}} level={4}>Email</Title>
                                <Title level={5}>{user.email}</Title>
                            </div>
                            <div style={{width:"45%", textAlign:"center"}}>
                                <Title style={{color:"#a02669"}} level={4}>Authority</Title>
                                <Title level={5}>{user.authorityLevel === 10 ? "Administrator" : "Member"}</Title>
                            </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row", width:"100%", justifyContent:"center"}}>
                            {user.authorityLevel && user.authorityLevel === 10 ? (
                                <div style={{width:"45%", marginRight:"2%"}}>
                                    <Button icon={<ArrowDownOutlined />} type="primary" style={{width:"100%", fontSize:"130%", marginBottom:"2%", paddingBottom:"5%"}} onClick={() => demoteAdminModal(user._id)}>
                                        Demote
                                    </Button>
                                </div>
                            ) : (
                                <div style={{width:"45%", marginRight:"2%"}}>
                                    <Button icon={<ArrowUpOutlined />} type="primary" style={{width:"100%", fontSize:"130%", marginBottom:"2%", paddingBottom:"5%"}} onClick={() => elevateUser(user._id)}>
                                        Promote
                                    </Button>
                                </div>
                            )}
                            {user.authorityLevel && user.authorityLevel === 10 ? (
                                <div style={{width:"45%"}}>
                                    <Button danger icon={<DeleteOutlined />} style={{width:"100%", fontSize:"130%", marginBottom:"2%", paddingBottom:"5%"}} onClick={() => deleteAdminModal(user._id)}>
                                        Delete Admin
                                    </Button>
                                </div>
                            ) : (
                                <div style={{width:"45%"}}>
                                    <Button danger icon={<DeleteOutlined />} style={{width:"100%", fontSize:"130%", marginBottom:"2%", paddingBottom:"5%"}} onClick={() => deleteUser(user._id)}>
                                        Delete User
                                    </Button>
                                </div>
                            )}


                        </div>
                    </div>
                </AccordionTab>
            )
        })
    }

    return(
        <div style={{display:"flex",justifyContent:"center", width:"100%"}}>
            <div style={{width:"85%", backgroundColor:"#100024", color:"white", height:"80vh", marginLeft:"5%", marginTop:"2%", borderRadius:"45px", display:"flex",flexDirection:"column", alignItems:"center", border:"3px #15002f", boxShadow:"3px 3px 3px 3px #15002f", textAlign:"center"}}>
                <Modal style={{paddingTop:"10%"}} title="Enter Owner Password" visible={firstModal.state} onOk={() => deleteAdmin(firstModal.userID, firstModal.ownerPassword)} onCancel={() => setFirstModal({state: false})} okText="Delete" cancelText="Cancel">
                    <Input style={{ width: '100%' }} placeholder="Owner Password" size="large" onChange={(value) => setFirstModal({state: true, userID: firstModal.userID, ownerPassword: value.target.value})} allowClear/>
                </Modal>
                <Modal style={{paddingTop:"10%"}} title="Enter Owner Password" visible={secondModal.state} onOk={() => demoteAdmin(secondModal.userID, secondModal.ownerPassword)} onCancel={() => setSecondModal({state: false})} okText="Demote" cancelText="Cancel">
                    <Input style={{ width: '100%' }} placeholder="Owner Password" size="large" onChange={(value) => setSecondModal({state: true, userID: secondModal.userID, ownerPassword: value.target.value})} allowClear/>
                </Modal>
                <Title style={{marginTop:"3%", fontSize:"400%", color:"white"}} >Manage Users</Title>
                <Input.Group compact style={{paddingBottom:"3%"}} >
                    <Select defaultValue="nickname" size="large" onChange={(value) => changeAttributeCategory(value)} >
                        <Option value="nickname">Username</Option>
                        <Option value="email">Email</Option>
                        <Option value="letter">Letter</Option>
                    </Select>
                    <Input style={{ width: '50%' }} defaultValue={defaultInputVal} maxLength={search.length} placeholder={search.message} size="large" onChange={(value) => setSearchValue(value.target.value)} onPressEnter={getUsers} allowClear/>
                    <Button type="primary" icon={<SearchOutlined />} size="large" onClick={getUsers}/>
                </Input.Group>
                {status ? (
                    status
                ) :(
                    <div style={{ width: '100%', display:"flex", justifyContent:"center"}}>
                        {!loading && userArray.length !== 0 ? (
                            <ScrollPanel style={{ width: '90%', height: '520px'}}>
                                <Accordion>
                                    {userArray}
                                </Accordion>
                            </ScrollPanel>
                        ) : (
                            <div style={{textAlign:"center", marginTop:"15%", fontSize:"200%"}}>
                                <Spin size="large"/>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

}