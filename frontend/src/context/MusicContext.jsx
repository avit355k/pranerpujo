import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const audioRef = useRef(null);
    const hasStartedRef = useRef(false);

    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        audio.loop = true;
        audio.volume = 0.45;

        const startMusic = async () => {
            try {
                await audio.play();

                hasStartedRef.current = true;
                setIsPlaying(true);

                removeListeners();
            } catch (error) {
                // Autoplay blocked.
                // Wait for user interaction.
            }
        };

        const handleFirstInteraction = async () => {
            if (hasStartedRef.current) return;

            try {
                await audio.play();

                hasStartedRef.current = true;
                setIsPlaying(true);

                removeListeners();
            } catch (error) {
                console.error("Unable to start music:", error);
            }
        };

        const removeListeners = () => {
            window.removeEventListener(
                "click",
                handleFirstInteraction
            );

            window.removeEventListener(
                "touchstart",
                handleFirstInteraction
            );

            window.removeEventListener(
                "keydown",
                handleFirstInteraction
            );

            window.removeEventListener(
                "pointerdown",
                handleFirstInteraction
            );
        };

        // Try autoplay
        startMusic();

        // Fallback for browser autoplay restrictions
        window.addEventListener(
            "click",
            handleFirstInteraction
        );

        window.addEventListener(
            "touchstart",
            handleFirstInteraction
        );

        window.addEventListener(
            "keydown",
            handleFirstInteraction
        );

        window.addEventListener(
            "pointerdown",
            handleFirstInteraction
        );

        return () => {
            removeListeners();
        };
    }, []);

    const toggleMusic = async () => {
        const audio = audioRef.current;

        if (!audio) return;

        if (audio.paused) {
            try {
                await audio.play();

                hasStartedRef.current = true;
                setIsPlaying(true);
            } catch (error) {
                console.error(
                    "Music could not play:",
                    error
                );
            }
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    return (
        <MusicContext.Provider
            value={{
                isPlaying,
                toggleMusic,
            }}
        >
            <audio
                ref={audioRef}
                src="/audio/Durga_Puja.mp3"
                loop
                preload="auto"
            />

            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);

    if (!context) {
        throw new Error(
            "useMusic must be used inside MusicProvider"
        );
    }

    return context;
};