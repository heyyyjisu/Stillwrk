import { useEffect, useRef, useState } from "react";

function App() {
  const [time, setTime] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [videoPlaying, setVideoPlaying] = useState<string>(
    "/videos/fireplace.mp4",
  );
  const [prevVideo, setPrevVideo] = useState<string>("");
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const count = setInterval(() => setCountdown((prev) => prev - 1), 1000);

    return () => {
      clearInterval(timer);
      clearInterval(count);
    };
  }, []);

  const sound = useRef(new Audio("/sounds/chime.mp3"));

  useEffect(() => {
    if (countdown === 0) {
      if (isBreak) {
        sound.current.currentTime = 0;
        sound.current.play().catch(() => {});
        setIsBreak(false);
        setCountdown(25 * 60);
      } else {
        sound.current.currentTime = 0;
        sound.current.play().catch(() => {});
        setIsBreak(true);
        setCountdown(5 * 60);
      }
    }
  }, [countdown]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const unlocked = useRef(false);

  const unlock = () => {
    if (!unlocked.current) {
      sound.current
        .play()
        .then(() => {
          sound.current.pause();
          sound.current.currentTime = 0;
          unlocked.current = true;
        })
        .catch(() => {});
    }
  };

  return (
    <div
      onClick={unlock}
      className="relative w-screen h-screen flex flex-col items-center justify-center gap-2"
    >
      {/* background video */}

      <video
        key={videoPlaying}
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-20"
      >
        <source src={videoPlaying} />
      </video>

      {prevVideo && (
        <video
          key={prevVideo}
          autoPlay
          loop
          muted
          playsInline
          className={`fixed top-0 left-0 w-full h-full object-cover -z-10 transition-opacity duration-1000 ${isFading ? "opacity-0" : "opacity-100"}`}
        >
          <source src={prevVideo} />
        </video>
      )}

      {/* overlay */}
      <div className="fixed inset-0 bg-black/30" style={{ zIndex: -5 }} />

      {/* time */}
      <div
        className="text-white/80 text-9xl tracking-tight text-center w-full"
        style={{
          fontFamily: "Nunito",
          fontWeight: 900,
          textShadow: "0 0 40px rgba(96, 95, 95, 0.4)",
        }}
      >
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </div>

      {/* timer */}
      <div
        className={` text-5xl tracking-widest tracking-tight drop-shadow-lg ${isBreak ? "text-green-300" : "text-orange-300"}`}
        style={{
          fontFamily: "Nunito",
          fontWeight: 900,
          textShadow: "0 0 40px rgba(42, 42, 42, 0.774)",
        }}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>

      {/* deep work / break */}
      <div
        className={`text-sm tracking-widest uppercase mt-1 ${isBreak ? "text-green-300" : "text-orange-300"}`}
        style={{ fontFamily: "Nunito" }}
      >
        {isBreak ? "Break" : "Deep Work"}
      </div>
      <button
        className="text-white/80 text-sm tracking-widest uppercase mt-1"
        style={{
          fontFamily: "Nunito",
          fontWeight: 900,
          textShadow: "0 0 40px rgba(96, 95, 95, 0.4)",
        }}
        onClick={() => {
          setCountdown(25 * 60);
          setIsBreak(false);
        }}
      >
        RESTART
      </button>

      <a
        href="https://buymeacoffee.com/heyyyjisu"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/40 text-xs tracking-widest uppercase mt-4 hover:text-white/70 transition-opacity"
        style={{ fontFamily: "Nunito" }}
      >
        ☕ Buy me a coffee
      </a>

      {/* buttons */}
      <div className="fixed bottom-8 flex gap-4">
        {[
          { src: "/videos/fireplace.mp4", emoji: "🔥" },
          { src: "/videos/ocean.mp4", emoji: "🌊" },
          { src: "/videos/rain.mp4", emoji: "🌧️" },
          { src: "/videos/wind.mp4", emoji: "🍃" },
        ].map((v) => (
          <button
            key={v.src}
            onClick={() => {
              setPrevVideo(videoPlaying);
              setIsFading(false);
              setVideoPlaying(v.src);
              setTimeout(() => setIsFading(true), 100);
            }}
            className={`text-2xl flex items-center justify-center rounded-full backdrop-blur-md transition-all w-12 h-12
            ${
              videoPlaying === v.src
                ? "bg-white/30 shadow-lg scale-110"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {v.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
