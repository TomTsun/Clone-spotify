"use client";

import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";

import { Song } from "@/types";

import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import { set } from "react-hook-form";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumnIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    // if no next song then reset
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeID);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setID(player.ids[0]);
    }

    player.setID(nextSong);
  };

  const onPlayPrevious = () => {
    // if no next song then reset
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeID);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      //load the very last song
      return player.setID(player.ids[-1]);
    }

    player.setID(previousSong);
  };

  const [play, { pause, sound }] = useSound(
    // if next song this hook cannot change Url
    // so use Key to destruct the component and relaoded
    songUrl,
    {
      volume: volume,
      onplay: () => setIsPlaying(true),
      onend: () => {
        setIsPlaying(false);
        onPlayNext();
      },
      onpause: () => setIsPlaying(false),
      format: ["mp3"],
    }
  );

  useEffect(() => {
    sound?.play(); //chaeck if exist

    return () => {
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div
        className="
            flex
            w-full
            justify-start
            "
      >
        <div
          className="
                    flex 
                    items-center
                    gap-x-4
                "
        >
          <MediaItem data={song} />
          <LikeButton songID={song.id} />
        </div>
      </div>

      <div
        className="
            flex
            md:hidden
            col-auto
            w-full
            justify-end
            items-center
            "
      >
        <div
          onClick={handlePlay}
          className="
                h-10
                w-10
                flex
                items-center
                rounded-full
                bg-white
                p-1
                cursor-pointer
            "
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>

      {/*>desktopview for controller */}
      <div
        className="
            hidden
            h-full
            md:flex
            justify-center
            items-center
            w-full
            max-w-[722px]
            gap-x-6
      "
      >
        <AiFillStepBackward
          onClick={onPlayPrevious}
          size={30}
          className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
            "
        />
        <div
          onClick={handlePlay}
          className="
            flex
            items-center
            justify-center
            h-10
            w-10
            rounded-full
            bg-white
            p-1
            cursor-pointer
            "
        >
          <Icon size={30} className="text-black" />
        </div>
        <AiFillStepForward
          onClick={onPlayNext}
          size={30}
          className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
            "
        />
      </div>

      <div
        className="
            hidden
            md:flex
            w-full
            justify-end
            pr-2
      "
      >
        <div
          className="
            flex
            items-center
            gap-x-2
            w-[120px]
        "
        >
          <VolumnIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={34}
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
