import React from "react";
import {Container ,Row, Button} from 'reactstrap'
import { NavLink,Link } from "react-router-dom";
import logo from '../../assets/images/TTlogo.png'
const nav_links=[
    {
     path:'home',
     display:'Home'
    },

    {
     path:'#',
     display:'About us'
    },
   {
     path:'/profil',
     display:'Profil'
    },
]
const Header=()=>{
    return<header className="header">
        <Container>
            <Row>
                <div className="nav__wrapper d-flex align-items-center justify-content-between">
                    <div className="logo">
                        <img src={logo} alt="" width={100}/>
                    </div>
                    <div className="navigation">
                        <ul className="menu d-flex align-items-center gap-5">
                           {
                            nav_links.map((item,index)=>(
                                <li className="nav__item" key={index}>
                                   <NavLink to={item.path}>{item.display}</NavLink>
                                </li>
                            ))
                           }
                        </ul>
                    </div>
                    
                    <div className="nav_right d-flex align-item-center gap-4">
                        <div className="nav__btns d-flex align-item-center gap-4">
                               <Link to="/login">
                                    <Button className="btn secondary__btn">sign in</Button>
                                </Link>
                        </div>
                    </div>
                </div>
            </Row>
        </Container>
    </header>;
};
export default Header;