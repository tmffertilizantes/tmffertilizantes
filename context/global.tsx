import { useState, useContext, createContext, useEffect } from "react";
import useSWR from "swr";
import { parseCookies } from "nookies";
import axios from 'axios';

interface Props {
  children: React.ReactNode
}

const fetcher = (url = '', token = '') => axios.get(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(res => res.data)

const GlobalContext = createContext<{ token: string, user: any, user_api_error: any }>({ token: "", user: "", user_api_error: "" });

export const GlobalContextProvider = ({ children }: Props) => {
  const cookies = parseCookies();

  const { data: { user } = {}, error } = useSWR(
    [`${process.env.API_URL}/auth/me`, cookies["USER_TOKEN"]],
    fetcher
  );

  return (
    <GlobalContext.Provider value={{
      token: cookies["USER_TOKEN"],
      user,
      user_api_error: error
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => useContext(GlobalContext);
