import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { handleDates } from "../date";
// import qs from "qs";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

export const useAuthApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  return () =>
    getAccessTokenSilently().then((accessToken) => {
      const api = axios.create({
        baseURL: apiUrl,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      api.interceptors.response.use((originalResponse) => {
        handleDates(originalResponse.data);
        return originalResponse;
      });

      return api;
    });
};
