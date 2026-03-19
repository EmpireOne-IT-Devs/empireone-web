export default function DividerSection() {
    return (
        <>
            <style>{`
                @keyframes gradientSlide {
                    0%   { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                .divider-line {
                    height: 3px;
                    width: 100%;
                    background: linear-gradient(
                        to right,
                        rgba(99, 102, 241, 0),
                        rgba(139, 92, 246, 1),
                        rgba(227, 86, 25, 1),
                        rgba(99, 102, 241, 1),
                        rgba(59, 130, 246, 1),
                        rgba(59, 130, 246, 0)
                    );
                    background-size: 200% 100%;
                    animation: gradientSlide 4s linear infinite;
                    border: none;
                    outline: none;
                }
            `}</style>

            <div
                className="relative w-full"
                style={{ height: 12 }}
                aria-hidden="true"
            >
                <div
                    className="divider-line absolute"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
            </div>
        </>
    );
}