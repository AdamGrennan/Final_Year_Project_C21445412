'use client'

import React from "react";
import Chat from "../../components/Chat";
import { useUser } from "@/context/UserContext";

const Home = () => {
    const user = useUser();

    return(
        <div>
            <h2>Hello {user.email}!</h2>
            <Chat/>
        </div>
    );
}


export default Home;