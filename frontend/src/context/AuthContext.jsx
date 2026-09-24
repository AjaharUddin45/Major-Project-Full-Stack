import React from 'react'

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export default function  AuthContextProvider({ children }){
    const [currUser, setCurrUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await axios.get("/profile");

                setCurrUser(response.data.user);
            } catch (error) {
                setCurrUser(null);
            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currUser,
                setCurrUser,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};