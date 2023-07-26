import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

import type { Metadata } from "next";
import { Figtree, Play } from "next/font/google";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongsByUserID from "@/actions/getSongsByUserID";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify",
  description: "Listen to music",
};

export const revalidate = 0; // no need to be cached

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSongs = await getSongsByUserID();
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <Sidebar songs={userSongs}>{children}</Sidebar>
            <Player />
            <ModalProvider />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
