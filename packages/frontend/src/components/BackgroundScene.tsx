import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useState, useRef, Suspense } from 'react';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';

function NodeField() {
    const ref = useRef<any>(null);
    const [sphere] = useState(() => random.inSphere(new Float32Array(6000), { radius: 1.5 }));

    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00FF88"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export default function BackgroundScene({ lowPower = false, ...props }: { lowPower?: boolean;[key: string]: any }) {
    if (lowPower) return <div className="fixed inset-0 bg-[#060608] -z-10" />;

    try {
        return (
            <div className="fixed inset-0 -z-10 bg-[#060608]" {...props}>
                <Canvas camera={{ position: [0, 0, 1] }} gl={{ alpha: false }}>
                    <Suspense fallback={null}>
                        <NodeField />
                    </Suspense>
                </Canvas>
            </div>
        );
    } catch (error) {
        console.error('BackgroundScene error:', error);
        return <div className="fixed inset-0 bg-[#060608] -z-10" />;
    }
}
