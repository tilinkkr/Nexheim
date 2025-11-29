import React, { useRef, useEffect, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

const AntigravityGraph = ({ data }) => {
    const fgRef = useRef();

    // Auto-rotate camera
    useEffect(() => {
        let frameId;
        const rotate = () => {
            if (fgRef.current) {
                const angle = Date.now() * 0.0005;
                fgRef.current.cameraPosition({
                    x: 200 * Math.sin(angle),
                    z: 200 * Math.cos(angle)
                });
            }
            frameId = requestAnimationFrame(rotate);
        };
        rotate();
        return () => cancelAnimationFrame(frameId);
    }, []);

    // Memoize graph data to prevent unnecessary re-renders
    const graphData = useMemo(() => {
        if (!data || !data.nodes || data.nodes.length === 0) return { nodes: [], links: [] };
        return {
            nodes: data.nodes.map(n => ({ ...n })), // Clone to avoid mutation issues
            links: data.links.map(l => ({ ...l }))
        };
    }, [data]);

    if (!data || !data.nodes || data.nodes.length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-screen bg-[#050510] text-cyan-400 font-mono text-xl animate-pulse">
                Scanning Insider Bundles...
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen bg-[#050510]">
            <ForceGraph3D
                ref={fgRef}
                graphData={graphData}
                nodeLabel="id"
                nodeColor={node => node.color}
                nodeThreeObject={node => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 32;
                    canvas.height = 32;
                    const ctx = canvas.getContext('2d');

                    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
                    gradient.addColorStop(0, node.color);
                    gradient.addColorStop(1, 'rgba(0,0,0,0)');

                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, 32, 32);

                    const texture = new THREE.CanvasTexture(canvas);
                    const material = new THREE.SpriteMaterial({ map: texture });
                    const sprite = new THREE.Sprite(material);
                    sprite.scale.set(12, 12, 1);
                    return sprite;
                }}
                linkDirectionalParticles={4}
                linkDirectionalParticleSpeed={0.006}
                linkWidth={1.5}
                linkColor={() => 'rgba(100, 200, 255, 0.3)'}
                backgroundColor="#050510"
                showNavInfo={false}
            />

            {/* Risk Score Overlay */}
            <div className="absolute top-24 right-8 bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                <h3 className="text-gray-400 text-sm font-mono mb-2">BUNDLE RISK SCORE</h3>
                <div className="flex items-end gap-2">
                    <span className={`text-5xl font-black ${data.risk_score > 50 ? 'text-red-500' : 'text-green-400'}`}>
                        {data.risk_score}
                    </span>
                    <span className="text-gray-500 mb-1">/ 100</span>
                </div>
            </div>
        </div>
    );
};

export default AntigravityGraph;
