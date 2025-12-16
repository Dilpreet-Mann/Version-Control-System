import React, { useEffect } from "react";
import {useNavigate, useRoutes} from 'react-router-dom'

// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepository from "./components/repository/CreateRepository";
import RepoDetail from "./components/repository/RepoDetail";
import Explore from "./components/explore/Explore";

// Footer Pages
import Terms from "./components/pages/Terms";
import Privacy from "./components/pages/Privacy";
import Security from "./components/pages/Security";
import Status from "./components/pages/Status";
import Docs from "./components/pages/Docs";
import Contact from "./components/pages/Contact";
import Community from "./components/pages/Community";
import Settings from "./components/pages/Settings";

// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = ()=>{
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        const publicPaths = ["/auth", "/signup", "/terms", "/privacy", "/security", "/status", "/docs", "/contact", "/community", "/settings"];
        if(!userIdFromStorage && !publicPaths.includes(window.location.pathname))
        {
            navigate("/auth");
        }

        if(userIdFromStorage && window.location.pathname=='/auth'){
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let element = useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
            path:"/create",
            element:<CreateRepository/>
        },
        {
            path:"/repo/:repoId",
            element:<RepoDetail/>
        },
        {
            path:"/explore",
            element:<Explore/>
        },
        {
            path:"/terms",
            element:<Terms/>
        },
        {
            path:"/privacy",
            element:<Privacy/>
        },
        {
            path:"/security",
            element:<Security/>
        },
        {
            path:"/status",
            element:<Status/>
        },
        {
            path:"/docs",
            element:<Docs/>
        },
        {
            path:"/contact",
            element:<Contact/>
        },
        {
            path:"/community",
            element:<Community/>
        },
        {
            path:"/settings",
            element:<Settings/>
        }
    ]);

    return element;
}

export default ProjectRoutes;