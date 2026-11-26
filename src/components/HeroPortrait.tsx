import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { STUDIO_PROFILE } from '../data/portfolioData';

interface HeroPortraitProps {
  scrollProgress: MotionValue<number>;
}

/**
 * Eye focal origin for animated-cartoon.mp4 (16:9 widescreen character centered).
 * Matches his glossy eyes during the scroll-driven zoom transition.
 */
export const PORTRAIT_EYE_ORIGIN = {
  xPercent: 50,
  yPercent: 46,
};

const LERP_STIFFNESS = 0.08;
const MAX_TILT_Y_DEG = 3.0;
const MAX_TILT_X_DEG = 2.2;
const MAX_SHIFT_X_PX = 6.5;
const MAX_SHIFT_Y_PX = 4.0;

// Keep idle loop strictly in the composed bust-shot segment before the built-in zoom starts
const IDLE_LOOP_END_SEC = 7.65;
const ZOOM_START_SEC = 7.7;
const ZOOM_END_SEC = 9.55;

const VERTEX_SHADER = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

/**
 * Luminance + chroma-invariant studio-wall keyer with 5-tap edge erosion.
 * Eliminates both darker studio corners AND the brighter radial backdrop behind
 * the character's head (zero H.264 macroblock halo), while protecting the dark
 * sculpted hair/glasses, warm peach skin, blue plaid shirt, and inner eye sclera.
 */
const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D uVideo;
  uniform vec2 uTexel;
  uniform float uZoomProgress;
  varying vec2 vUv;

  float sampleForeground(vec2 uv) {
    vec3 col = texture2D(uVideo, uv).rgb;
    float maxC = max(col.r, max(col.g, col.b));
    float minC = min(col.r, min(col.g, col.b));
    float sat = maxC - minC;
    float luma = dot(col, vec3(0.299, 0.587, 0.114));

    // Character features vs. neutral light-beige wall:
    // - Wall has luma > 0.62, low saturation (< 0.095), and very low warm/cool tilt
    // - Skin has warm peach (r - b > 0.085), shirt has blue (b - r > 0.045), hair/glasses have luma < 0.55
    float warmSkin = smoothstep(0.078, 0.135, col.r - col.b);
    float coolShirt = smoothstep(0.032, 0.075, col.b - col.r);
    float darkFeature = 1.0 - smoothstep(0.46, 0.64, luma);
    float saturated = smoothstep(0.082, 0.145, sat);

    float fg = max(max(warmSkin, coolShirt), max(darkFeature, saturated));

    // Inner core protection strictly for white sclera & smile teeth inside the head
    vec2 faceDelta = (uv - vec2(0.50, 0.44)) / vec2(0.115, 0.185);
    float faceCore = 1.0 - smoothstep(0.72, 1.0, length(faceDelta));
    fg = max(fg, faceCore);

    return clamp(fg, 0.0, 1.0);
  }

  void main() {
    vec3 col = texture2D(uVideo, vUv).rgb;

    // 5-tap neighborhood sampling to eliminate 1-2px bright fringe & compression blocks
    float aC = sampleForeground(vUv);
    float aL = sampleForeground(vUv - vec2(uTexel.x * 1.5, 0.0));
    float aR = sampleForeground(vUv + vec2(uTexel.x * 1.5, 0.0));
    float aT = sampleForeground(vUv - vec2(0.0, uTexel.y * 1.5));
    float aB = sampleForeground(vUv + vec2(0.0, uTexel.y * 1.5));

    // Soft morphological erosion shaves pale fringe while preserving smooth silhouette
    float minNeighbor = min(min(aL, aR), min(aT, aB));
    float avgNeighbor = (aL + aR + aT + aB + aC) * 0.2;
    float alpha = mix(avgNeighbor, min(aC, minNeighbor), 0.55);
    alpha = smoothstep(0.24, 0.78, alpha);

    // During deep eye zoom, transition smoothly to full-frame opacity
    alpha = max(alpha, smoothstep(0.32, 0.72, uZoomProgress));

    // Soft bottom & side edge feather so shirt melts naturally into #0B0C0E
    float bottomFade = smoothstep(1.0, 0.87, vUv.y);
    float sideFade = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
    alpha *= bottomFade * sideFade;

    // Gentle edge despill on semi-transparent boundary pixels
    float edgeMask = alpha * (1.0 - alpha) * 4.0;
    col = mix(col, col * 0.65, edgeMask * 0.6);

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

export function HeroPortrait({ scrollProgress }: HeroPortraitProps) {
  const prefersReducedMotion = useReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglReady, setWebglReady] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    video.muted = true;
    video.play().catch(() => {});

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });

    if (!gl) {
      setWebglReady(false);
      return;
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      setWebglReady(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setWebglReady(false);
      return;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setWebglReady(false);
      return;
    }
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posLoc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const texelLoc = gl.getUniformLocation(program, 'uTexel');
    const zoomLoc = gl.getUniformLocation(program, 'uZoomProgress');

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const handlePointerMove = (event: PointerEvent) => {
      if (prefersReducedMotion || scrollProgress.get() > 0.015 || window.scrollY > 4) {
        target.x = 0;
        target.y = 0;
        return;
      }
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      target.x = Math.max(-1, Math.min(1, nx));
      target.y = Math.max(-1, Math.min(1, ny));
    };

    const handlePointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    let rafId = 0;
    let lastSeekTime = 0;

    const renderFrame = (now: number) => {
      const sp = scrollProgress.get();
      const isScrollLocked = sp > 0.015 || window.scrollY > 4;

      if (!prefersReducedMotion && video.readyState >= 2) {
        if (!isScrollLocked) {
          if (video.paused) {
            video.play().catch(() => {});
          }
          if (video.currentTime >= IDLE_LOOP_END_SEC) {
            video.currentTime = 0.05;
          }
        } else if (sp <= 0.34) {
          if (!video.paused) {
            video.pause();
          }
          const zoomNorm = Math.max(0, Math.min(1, (sp - 0.015) / 0.21));
          const targetVideoTime =
            ZOOM_START_SEC + zoomNorm * (ZOOM_END_SEC - ZOOM_START_SEC);
          if (
            Math.abs(video.currentTime - targetVideoTime) > 0.035 &&
            now - lastSeekTime > 28
          ) {
            video.currentTime = targetVideoTime;
            lastSeekTime = now;
          }
        }
      }

      if (!prefersReducedMotion && stageRef.current) {
        const effX = isScrollLocked ? 0 : target.x;
        const effY = isScrollLocked ? 0 : target.y;
        const stiffness = isScrollLocked ? 0.18 : LERP_STIFFNESS;

        current.x += (effX - current.x) * stiffness;
        current.y += (effY - current.y) * stiffness;

        const rotY = current.x * MAX_TILT_Y_DEG;
        const rotX = -current.y * MAX_TILT_X_DEG;
        const tx = current.x * MAX_SHIFT_X_PX;
        const ty = current.y * MAX_SHIFT_Y_PX;

        stageRef.current.style.transform =
          `perspective(1100px) translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) ` +
          `rotateY(${rotY.toFixed(3)}deg) rotateX(${rotX.toFixed(3)}deg)`;
      }

      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          gl.viewport(0, 0, canvas.width, canvas.height);
        }

        gl.uniform2f(texelLoc, 1.0 / canvas.width, 1.0 / canvas.height);
        const zoomUniform = Math.max(0, Math.min(1, (sp - 0.04) / 0.18));
        gl.uniform1f(zoomLoc, zoomUniform);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      rafId = window.requestAnimationFrame(renderFrame);
    };

    rafId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      gl.deleteTexture(texture);
      gl.deleteBuffer(posBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [prefersReducedMotion, scrollProgress]);

  return (
    <div
      ref={stageRef}
      className="relative aspect-video h-[38vh] max-h-[580px] min-h-[240px] w-auto max-w-[92vw] select-none will-change-transform sm:h-[48vh] md:h-[58vh] lg:h-[62vh]"
      style={{
        transformOrigin: `${PORTRAIT_EYE_ORIGIN.xPercent}% ${PORTRAIT_EYE_ORIGIN.yPercent}%`,
      }}
    >
      <video
        ref={videoRef}
        src={STUDIO_PROFILE.characterVideoPath}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        aria-label="Animated 3D character of Isaac Chong"
        className={
          webglReady
            ? 'pointer-events-none absolute h-px w-px opacity-0'
            : 'pointer-events-none h-full w-full rounded-xl object-contain'
        }
      />

      {webglReady && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none h-full w-full object-contain"
        />
      )}
    </div>
  );
}
