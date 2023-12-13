import { Box } from "@mui/system";
import MenuDrawer2 from "./MenuDrawer2";
import { Providers } from "./Providers";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <MenuDrawer2>
        <Box sx={{ p: 2 }}>{children}</Box>
      </MenuDrawer2>
    </Providers>
  );
}
