import React from 'react';

const CameraPreview = ({ videoRef, isVisible }) => {
    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#333',
                display: isVisible ? 'block' : 'none',
                overflow: 'hidden',
                flex: 1
            }}
        />
    );
};

export default CameraPreview;