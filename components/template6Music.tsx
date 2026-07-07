"use client";
import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

export default function Template6Music({ extra5 }: { extra5?: string | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const songSrc =
    extra5 === "jasjubailar" ? "/songs/jasjubailar.mp3" : "/songs/toi-jiri.mp3";

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
    <div className="fixed bottom-20 right-5 z-50">
      <button
        onClick={toggle}
        className="bg-white shadow-lg rounded-full p-4 text-sky-600"
      >
        {playing ? <FaPause /> : <FaPlay />}
      </button>

      <audio ref={audioRef} loop key={songSrc}>
        <source src={songSrc} type="audio/mpeg" />
      </audio>
    </div>
  );
}
