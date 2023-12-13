import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";

export const Auth0ProviderWithNavigate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const redirectUri =
    process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL ||
    globalThis.location?.origin + "/patients";
  const audience = process.env.NEXT_PUBLIC_APP_AUTH0_AUDIENCE;

  if (!(domain && clientId && redirectUri)) {
    throw "Error not configured Auth0 provider!";
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: audience,
        redirect_uri: redirectUri,
        organization: "org_DFJ8phNPTZWumbyj",
      }}
      //   onRedirectCallback={(appState) => {
      //     console.log({aa: appState?.returnTo })
      //     redirect(appState?.returnTo || window.location.pathname);
      //   }}
    >
      {children}
    </Auth0Provider>
  );
};
