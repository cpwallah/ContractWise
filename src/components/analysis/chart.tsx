
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface OverallScoreChartProps {
  overallScore: number;
}

export default function OverallScoreChart({ overallScore }: OverallScoreChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; text: string }>({ visible: false, x: 0, y: 0, text: "" });

  // Strict validation for overallScore
  const validatedScore = Number.isFinite(overallScore) && !Number.isNaN(overallScore)
    ? Math.max(0, Math.min(100, Math.round(Number(overallScore))))
    : 0;

  // Diagnostic logging
  console.log("Chart.tsx: overallScore =", overallScore, "validatedScore =", validatedScore);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size based on container (responsive)
    const size = Math.min(canvas.clientWidth, canvas.clientHeight);
    canvas.width = size * 2; // High DPI for crisp rendering
    canvas.height = size * 2;
    ctx.scale(2, 2); // Scale for high DPI

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4; // 80% of half the size for inner/outer radius effect
    const innerRadius = radius * 0.5;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Calculate angles
    const opportunitiesPercentage = validatedScore / 100;
    const risksPercentage = 1 - opportunitiesPercentage;
    const total = Math.PI * 2;
    const opportunitiesEndAngle = opportunitiesPercentage * total - Math.PI / 2;
    const risksStartAngle = opportunitiesEndAngle;
    const risksEndAngle = total - Math.PI / 2;

    // Draw Opportunities (blue)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, opportunitiesEndAngle);
    ctx.arc(centerX, centerY, innerRadius, opportunitiesEndAngle, -Math.PI / 2, true);
    ctx.closePath();
    ctx.fillStyle = "#1D4ED8";
    ctx.fill();

    // Draw Risks (red)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, risksStartAngle, risksEndAngle);
    ctx.arc(centerX, centerY, innerRadius, risksEndAngle, risksStartAngle, true);
    ctx.closePath();
    ctx.fillStyle = "#EF4444";
    ctx.fill();

    // Draw center label
    ctx.font = `${size * 0.12}px sans-serif`; // Responsive font size
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#111827";
    ctx.fillText(`${validatedScore}%`, centerX, centerY - size * 0.05);
    ctx.font = `${size * 0.05}px sans-serif`;
    ctx.fillStyle = "#374151";
    ctx.fillText("Score", centerX, centerY + size * 0.05);
  }, [validatedScore]);

  // Handle mouse move for tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.min(canvas.clientWidth, canvas.clientHeight);
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    const innerRadius = radius * 0.5;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if mouse is within the donut ring
    if (distance >= innerRadius && distance <= radius) {
      const angle = (Math.atan2(dy, dx) + Math.PI / 2) % (Math.PI * 2);
      const opportunitiesPercentage = validatedScore / 100;
      const opportunitiesEndAngle = opportunitiesPercentage * Math.PI * 2;

      if (angle < opportunitiesEndAngle) {
        setTooltip({ visible: true, x: e.clientX, y: e.clientY, text: `Opportunities: ${validatedScore}%` });
      } else {
        setTooltip({ visible: true, x: e.clientX, y: e.clientY, text: `Risks: ${100 - validatedScore}%` });
      }
    } else {
      setTooltip({ visible: false, x: 0, y: 0, text: "" });
    }
  };

  // Fallback UI for invalid score
  if (validatedScore === 0 && overallScore !== 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] mx-auto bg-white border border-gradient-to-r from-blue-200 to-blue-300 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-center pt-6">
            <p className="text-sm sm:text-base font-semibold text-gray-900">Unable to Render Chart</p>
            <p className="text-sm text-gray-700 mt-2">Invalid score: {overallScore}</p>
            <p className="text-sm text-gray-700 mt-1">Please provide a score between 0 and 100.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] mx-auto bg-white border border-gradient-to-r from-blue-200 to-blue-300 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="p-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">Score Breakdown</h3>
          <p className="text-sm text-gray-700">Risks vs Opportunities</p>
        </div>
        <div className="p-6 pt-0 relative">
          <canvas
            ref={canvasRef}
            className="w-full aspect-square"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, text: "" })}
          />
          {tooltip.visible && (
            <div
              className="absolute bg-white text-gray-900 font-semibold border border-blue-200 rounded-lg p-2 text-xs sm:text-sm shadow-md pointer-events-none"
              style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
            >
              {tooltip.text}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
