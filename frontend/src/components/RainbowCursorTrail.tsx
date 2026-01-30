import React, { useEffect } from "react";

const RainbowCursorTrail: React.FC = () => {
  useEffect(() => {
    const canvas = document.getElementById("cursorCanvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    interface TrailPoint {
      x: number;
      y: number;
      size: number;
      alpha: number;
    }

    const trail: TrailPoint[] = [];
    const pastelRainbow: string[] = [
      "#ff005dff",
      "#ff6f00ff",
      "#ffd900ff",
      "#00ff6aff",
      "#00aeffff",
      "#6a00ffff",
    ];

    let colorIndex = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      trail.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = pastelRainbow[(colorIndex + i) % pastelRainbow.length];
        ctx.globalAlpha = point.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const update = () => {
      trail.forEach((point) => {
        point.alpha -= 0.02;
        point.size *= 0.98;
      });
      while (trail.length > 0 && trail[0].alpha <= 0) {
        trail.shift();
      }
    };

    const animate = () => {
      update();
      draw();
      requestAnimationFrame(animate);
    };

    const handleMove = (e: MouseEvent) => {
      trail.push({
        x: e.clientX,
        y: e.clientY,
        size: 8,
        alpha: 0.6,
      });
      colorIndex = (colorIndex + 1) % pastelRainbow.length;
    };

    window.addEventListener("mousemove", handleMove);
    animate();

    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <>
      {/* Inline CSS injected here */}
      <style>
        {`
          #cursorCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
          }
        `}
      </style>
      <canvas id="cursorCanvas" />
    </>
  );
};

export default RainbowCursorTrail;
