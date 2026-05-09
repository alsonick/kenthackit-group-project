"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import "./DrawingCanvas.css";

const COLORS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#6b7280",
  "#92400e",
];

const STROKE_SIZES = [2, 6, 12, 24];

type Tool = "pen" | "eraser";

export const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const [color, setColor] = useState("#000000");
  const [strokeSize, setStrokeSize] = useState(6);
  const [tool, setTool] = useState<Tool>("pen");

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawing.current = true;
    lastPos.current = getPos(e, canvas);
  }, []);

  const draw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || !lastPos.current) return;

      e.preventDefault();
      const pos = getPos(e, canvas);

      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.lineWidth = tool === "eraser" ? strokeSize * 3 : strokeSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      lastPos.current = pos;
    },
    [color, strokeSize, tool],
  );

  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Resize canvas to match container while preserving drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const imageData = canvas
        .getContext("2d")
        ?.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (imageData) ctx.putImageData(imageData, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Attach events directly to canvas element
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing]);

  return (
    <div className="drawing-canvas-container">
      <div className="drawing-toolbar">
        <div className="toolbar-group">
          <button
            className={`tool-btn ${tool === "pen" ? "active" : ""}`}
            onClick={() => setTool("pen")}
            title="Pen"
          >
            ✏️
          </button>
          <button
            className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
            onClick={() => setTool("eraser")}
            title="Eraser"
          >
            🧹
          </button>
          <button
            className="tool-btn clear-btn"
            onClick={clearCanvas}
            title="Clear"
          >
            🗑️
          </button>
        </div>

        <div className="toolbar-group color-palette">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`color-swatch ${color === c && tool === "pen" ? "selected" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => {
                setColor(c);
                setTool("pen");
              }}
            />
          ))}
        </div>

        <div className="toolbar-group stroke-sizes">
          {STROKE_SIZES.map((size) => (
            <button
              key={size}
              className={`stroke-btn ${strokeSize === size ? "active" : ""}`}
              onClick={() => setStrokeSize(size)}
              title={`${size}px`}
            >
              <span
                className="stroke-dot"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: tool === "eraser" ? "#aaa" : color,
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="canvas-area" ref={containerRef}>
        <canvas ref={canvasRef} className="drawing-canvas" />
      </div>
    </div>
  );
};
