import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AvatarModel({ currentViseme }) {
    // Update path to your specific avatar .glb file
    const { scene } = useGLTF('/avatar.glb'); 
    const headRef = useRef(null);

    useEffect(() => {
        if (!scene) return;
        
        // Traverse to find the mesh with morph targets (usually Wolf3D_Head or Wolf3D_Teeth)
        scene.traverse((child) => {
            if (child.isMesh && child.morphTargetDictionary) {
                // We lock onto the head mesh for facial visemes
                if (child.name.includes('Head') || child.name.includes('Teeth')) {
                    headRef.current = child;
                }
            }
        });
    }, [scene]);

    useFrame(() => {
        if (!headRef.current) return;

        const influences = headRef.current.morphTargetInfluences;
        const dictionary = headRef.current.morphTargetDictionary;

        // 1. Smoothly reset all visemes toward 0
        Object.keys(dictionary).forEach((key) => {
            if (key.startsWith('viseme_')) {
                influences[dictionary[key]] = THREE.MathUtils.lerp(influences[dictionary[key]], 0, 0.2);
            }
        });

        // 2. Smoothly ramp up the active viseme toward 1
        const activeKey = `viseme_${currentViseme}`;
        if (dictionary[activeKey] !== undefined) {
            influences[dictionary[activeKey]] = THREE.MathUtils.lerp(influences[dictionary[activeKey]], 1, 0.5);
        }
    });

    if (!scene) return null;

    return <primitive object={scene} scale={1.5} position={[0, -1.5, 0]} />;
}

// Optional: Preload the model so it doesn't pop in late
useGLTF.preload('/avatar.glb');