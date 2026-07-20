import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A tiny Three.js pull-cord (drawn as a line) fixed to the top-right corner.
 * Drag the bead downward past a threshold and release to toggle the theme.
 */
export default function PullCordLamp() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const WIDTH = 80;
    const HEIGHT = 180;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -WIDTH / 2,
      WIDTH / 2,
      HEIGHT / 2,
      -HEIGHT / 2,
      -100,
      100,
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Ceiling anchor point (top of canvas)
    const anchor = new THREE.Vector3(0, HEIGHT / 2, 0);

    // Rest length of the cord
    const REST_LENGTH = 110;
    const MIN_LENGTH = REST_LENGTH - 80;
    const MAX_LENGTH = REST_LENGTH + 55;
    const MAX_OFFSET_X = 25;
    const TRIGGER_DELTA = 30;

    // Cord line
    const cordMaterial = new THREE.LineBasicMaterial({
      color: 0x9ca3af,
      linewidth: 2,
    });
    const cordGeometry = new THREE.BufferGeometry().setFromPoints([
      anchor,
      new THREE.Vector3(0, anchor.y - REST_LENGTH, 0),
    ]);
    const cord = new THREE.Line(cordGeometry, cordMaterial);
    scene.add(cord);

    // Bead (the pull handle)
    const beadGeometry = new THREE.SphereGeometry(6, 24, 24);
    const beadMaterial = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const bead = new THREE.Mesh(beadGeometry, beadMaterial);
    bead.position.set(0, anchor.y - REST_LENGTH, 0);
    scene.add(bead);

    // Current cord length (animates back to REST_LENGTH on release)
    let length = REST_LENGTH;
    let targetLength = REST_LENGTH;
    let offsetX = 0;
    let targetOffsetX = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartLength = REST_LENGTH;
    let dragStartOffsetX = 0;

    const canvas = renderer.domElement;
    canvas.style.cursor = "default";
    canvas.style.touchAction = "none";

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function toNDC(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function hitBead(e: PointerEvent) {
      toNDC(e);
      raycaster.setFromCamera(pointer, camera);
      // Expand bead hit area slightly
      const hits = raycaster.intersectObject(bead, false);
      if (hits.length > 0) return true;
      // Fallback: also accept hits near the bead in screen space
      const rect = canvas.getBoundingClientRect();
      const beadScreenY =
        rect.top + ((anchor.y - length - camera.top) / (camera.bottom - camera.top)) * rect.height;
      const beadScreenX =
        rect.left + rect.width / 2 + (offsetX / (camera.right - camera.left)) * rect.width;
      const dx = e.clientX - beadScreenX;
      const dy = e.clientY - beadScreenY;
      return dx * dx + dy * dy < 16 * 16;
    }

    function onPointerDown(e: PointerEvent) {
      if (!hitBead(e)) return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartLength = length;
      dragStartOffsetX = offsetX;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragging) {
        canvas.style.cursor = hitBead(e) ? "grab" : "default";
        return;
      }
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      targetLength = Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, dragStartLength + dy));
      targetOffsetX = Math.max(-MAX_OFFSET_X, Math.min(MAX_OFFSET_X, dragStartOffsetX + dx));
    }

    function toggleTheme() {
      const current = localStorage.getItem("theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      document.documentElement.classList[next === "dark" ? "add" : "remove"]("dark");
      document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
    }

    function onPointerUp(e: PointerEvent) {
      if (!dragging) return;
      dragging = false;
      canvas.releasePointerCapture?.(e.pointerId);
      canvas.style.cursor = hitBead(e) ? "grab" : "default";
      const pulled = targetLength - REST_LENGTH;
      targetLength = REST_LENGTH;
      targetOffsetX = 0;
      if (pulled >= TRIGGER_DELTA) {
        toggleTheme();
      }
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    // Sync bead color with current theme
    function syncBeadColor() {
      const isDark = document.documentElement.classList.contains("dark");
      beadMaterial.color.setHex(isDark ? 0x6b7280 : 0xf59e0b);
    }
    syncBeadColor();
    document.addEventListener("themechange", syncBeadColor);

    let frame = 0;
    function tick() {
      frame = requestAnimationFrame(tick);
      // Spring back toward target
      length += (targetLength - length) * 0.25;
      offsetX += (targetOffsetX - offsetX) * 0.25;

      // Update cord geometry
      const tip = new THREE.Vector3(offsetX, anchor.y - length, 0);
      const positions = cord.geometry.attributes.position as THREE.BufferAttribute;
      positions.setXYZ(0, anchor.x, anchor.y, anchor.z);
      positions.setXYZ(1, tip.x, tip.y, tip.z);
      positions.needsUpdate = true;

      bead.position.copy(tip);
      renderer.render(scene, camera);
    }
    tick();

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      document.removeEventListener("themechange", syncBeadColor);
      cordGeometry.dispose();
      cordMaterial.dispose();
      beadGeometry.dispose();
      beadMaterial.dispose();
      renderer.dispose();
      if (canvas.parentElement === mount) mount.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        right: 16,
        width: 80,
        height: 180,
        zIndex: 0,
        pointerEvents: "auto",
      }}
    />
  );
}
