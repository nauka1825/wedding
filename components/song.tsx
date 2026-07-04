"use client";
import { useEffect, useRef, useState } from "react";
import { MdMusicNote, MdMusicOff } from "react-icons/md";

export default function Song({ extra5 }: { extra5?: string | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const songSrc =
    extra5 === "jasjubailar" ? "/songs/jasjubailar.mp3" : "/songs/man.mp3";

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio
      .play()
      .then(() => {
        setPlaying(true);
      })
      .catch(() => {
        console.log("Autoplay blocked");
      });
  }, []);

  const toggle = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <button
        onClick={toggle}
        aria-label={playing ? "Музыканы тохтотуу" : "Музыка ойнотуу"}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          width: "100%",
          height: "100%",
          color: "inherit",
          transition: "color 0.3s ease",
        }}
      >
        {playing ? <MdMusicNote size={22} /> : <MdMusicOff size={22} />}
      </button>

      <audio ref={audioRef} loop key={songSrc}>
        <source src={songSrc} type="audio/mpeg" />
      </audio>
    </>
  );
}
