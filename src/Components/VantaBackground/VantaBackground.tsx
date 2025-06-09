
// VantaBackground Component
// This component renders a Vanta.js animated background (net, birds, fog, or waves).
// It's used to add an animated visual effect behind page content.


// React imports for component, state, and lifecycle management
import React, { useState, useEffect, useRef } from "react";

// Three.js is required by Vanta.js for rendering WebGL animations
import * as THREE from "three";

// Importing different Vanta.js effects
import NET from "vanta/dist/vanta.net.min"; // NET animation (grid of points connected by lines)
import BIRDS from "vanta/dist/vanta.birds.min"; // Birds flying animation
import FOG from "vanta/dist/vanta.fog.min"; // Fog swirling animation
import WAVES from "vanta/dist/vanta.waves.min"; // Ocean wave animation

// Props interface allowing the parent to choose which effect to render
interface VantaProps {
  effect?: "net" | "birds" | "fog" | "waves"; // Optional prop: determines which Vanta effect to show
}

// Mapping between effect names and their corresponding Vanta function
const effectsMap: Record<string, any> = {
  net: NET,
  birds: BIRDS,
  fog: FOG,
  waves: WAVES,
};

// Functional component definition using React.FC and the defined props
const VantaBackground: React.FC<VantaProps> = ({ effect = "net" }) => {
  // State to store the Vanta effect instance so we can destroy it later
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  // useRef to get a reference to the DOM element where the Vanta effect will be applied
  const vantaRef = useRef<HTMLDivElement>(null);

  // useEffect will run once on mount and anytime `effect` or `vantaEffect` changes
  useEffect(() => {
    // Get the selected Vanta effect from the map
    const selectedEffect = effectsMap[effect.toLowerCase()];

    // Only initialize if there's no current effect and the target ref exists
    if (!vantaEffect && selectedEffect && vantaRef.current) {
      // Initialize the selected Vanta effect
      setVantaEffect(
        selectedEffect({
          el: vantaRef.current, // Target element
          THREE: THREE, // Pass THREE.js dependency
          vertexColors: false,
          color: 0x1a73e8, // Primary color of the effect (blue)
          backgroundColor: 0xf0f4f8, // Light background
          points: 10.0, // Controls number of points (for net)
          maxDistance: 20.0, // Distance between points (for net)
          spacing: 15.0, // Grid spacing (for net)
          mouseControls: true, // Enable mouse interaction
          touchControls: true, // Enable touch interaction
          gyroControls: false, // Disable gyroscope controls
        })
      );
    }

    // Cleanup: destroy the Vanta effect when the component unmounts or re-renders
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect, effect]); // Dependencies: rerun effect when effect or vantaEffect changes

  // Return the div that Vanta.js will attach the animation to
  return (
    <div
      ref={vantaRef} // The reference passed to Vanta.js
      style={{ width: "100%", height: "500px", position: "relative" }} // Full-width, fixed height container
    >
      {/* No content inside, this div is just a visual background */}
    </div>
  );
};

// Export the component for use in other parts of the app
export default VantaBackground;
