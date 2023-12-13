"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import Loading from "./(components)/Loading";

export default function Home() {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return <Loading />;
}
