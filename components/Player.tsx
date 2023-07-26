"use client";

import useGetSongByID from "@/hooks/useGetSongByID";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";

const Player = () => {
  const player = usePlayer(); //4:07:00
  const { song } = useGetSongByID(player.activeID);

  const songUrl = useLoadSongUrl(song!); // song may be undefined

  if (!song || !songUrl || !player.activeID) {
    //avoid load player
    return null;
  }

  return (
    <div
      className="
        fixed
        bottom-0
        bg-black
        w-full
        py-2
        h-[80px]
        px-4
    "
    >
      <PlayerContent
        key={songUrl} //to laod the next song
        song={song}
        songUrl={songUrl}
      />
    </div>
  );
};

export default Player;
