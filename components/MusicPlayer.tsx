import { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={toggle}
        className="bg-white shadow-lg rounded-full p-4 text-sky-600"
      >
        {playing ? <FaPause /> : <FaPlay />}
      </button>

      <audio ref={audioRef} loop>
        <source src="/songs/women.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
