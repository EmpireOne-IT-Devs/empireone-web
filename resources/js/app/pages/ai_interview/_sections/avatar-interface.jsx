import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';

const AvatarInterface = ({ audioUrl, visemes, onSpeakEnd, audioRef }) => {
    const [currentViseme, setCurrentViseme] = useState('sil');
    const frameRef = useRef();

    useEffect(() => {
        if (!audioUrl || !audioRef.current) return;

        const audio = audioRef.current;
        audio.src = audioUrl;
        audio.crossOrigin = "anonymous"; 

        const sync = () => {
            const now = audio.currentTime * 1000;
            const active = visemes?.find((v, i) => {
                const next = visemes[i + 1];
                return now >= v.timeMs && (!next || now < next.timeMs);
            });
            if (active) setCurrentViseme(active.value);
            frameRef.current = requestAnimationFrame(sync);
        };

        const handleEnded = () => {
            cancelAnimationFrame(frameRef.current);
            setCurrentViseme('sil');
            // Notify parent that the AI has stopped speaking
            if (onSpeakEnd) onSpeakEnd();
        };

        audio.addEventListener('ended', handleEnded);
        audio.play().then(() => {
            frameRef.current = requestAnimationFrame(sync);
        }).catch(err => console.error("Playback error", err));

        return () => {
            audio.removeEventListener('ended', handleEnded);
            cancelAnimationFrame(frameRef.current);
        };
    }, [audioUrl, visemes]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas camera={{ position: [0, 0, 2] }}>
                {/* <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} /> */}
                {/* Add your 3D Avatar component here: 
                  <AvatarModel currentViseme={currentViseme} /> 
                */}
            </Canvas>
        </div>
    );
};

export default AvatarInterface;