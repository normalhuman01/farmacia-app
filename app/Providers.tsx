"use client";
import { Auth0ProviderWithNavigate } from "./(components)/Auth0ProviderWithNavigate";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Auth0ProviderWithNavigate>{children}</Auth0ProviderWithNavigate>;
};
