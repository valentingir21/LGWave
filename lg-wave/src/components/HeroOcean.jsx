import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing'

/* ─────────────────────────────────────────────────────────────────────────────
   VERTEX SHADER

   AVANT — problèmes :
   • wave3 pos.x * 2.30, wave4 pos.x * 6.00  → horizon accidenté (hautes fréquences
     sur tout le mesh, y compris le bord supérieur)
   • pas de masque → détails nerveux visibles jusqu'à l'horizon

   APRÈS — fixes :
   • Tous les multiplicateurs spatiaux > 2.0 divisés par 2 :
       wave3 : pos.x * 2.30 → 1.15,  pos.y * 1.90 reste (< 2.0)
       wave4 : pos.x * 6.00 → 3.00,  pos.y * 5.20 → 2.60
   • highFreqMask = 1.0 - smoothstep(0.3, 0.6, vUv.y)
     → wave3, wave4, FBM appliqués uniquement sur la partie basse (vUv.y < 0.3‑0.6)
   • wave1 + wave2 (fréquences < 1.1) façonnent seuls le bord horizon
     → courbe douce et ample, pas de crénelage
───────────────────────────────────────────────────────────────────────────── */
const vertexShader = `
  uniform float uTime;
  uniform float uMouseX;
  uniform float uMouseY;
  varying vec2  vUv;
  varying float vElevation;
  varying vec3  vWorldPos;

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }
  float gnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
          dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
      mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
          dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.50;
    mat2 R = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 4; i++) { v += a * gnoise(p); p = R * p; a *= 0.48; }
    return v;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    /* ── Low-frequency layers — shape the horizon (applied everywhere) ── */

    /* Layer 1 — primary rolling swell, slow & broad */
    float wave1 = sin(pos.x * 0.50 + uTime * 0.80) *
                  cos(pos.y * 0.38 + uTime * 0.60) * 0.50;

    /* Layer 2 — secondary crossed swell */
    float wave2 = sin(pos.x * 1.10 - uTime * 0.55) *
                  sin(pos.y * 0.85 + uTime * 0.65) * 0.18;

    /* ── High-frequency layers — surface detail, masked to lower UV ─────
       highFreqMask = 0 at vUv.y > 0.6 (horizon zone), 1 at vUv.y < 0.3
       Spatial multipliers > 2.0 all halved vs previous version.            */
    float highFreqMask = 1.0 - smoothstep(0.3, 0.6, vUv.y);

    /* Layer 3 — wind chop (was pos.x * 2.30 → now 1.15) */
    float wave3 = sin(pos.x * 1.15 + uTime * 2.20) *
                  cos(pos.y * 1.90 - uTime * 1.80) * 0.07;

    /* Layer 4 — micro-ripple (was pos.x * 6.00 → 3.00, pos.y * 5.20 → 2.60) */
    float wave4 = sin(pos.x * 3.00 + uTime * 6.00) *
                  sin(pos.y * 2.60 - uTime * 4.50) * 0.035;

    /* FBM — organic warping (also masked to lower half) */
    vec2 fc = vec2(pos.x * 0.22 + uTime * 0.18, pos.y * 0.18 + uTime * 0.14);
    float fbmV = fbm(fc) * 0.22;

    /* Mouse ripple */
    float md      = distance(vUv, vec2(uMouseX, uMouseY));
    float mRipple = (1.0 - smoothstep(0.0, 0.45, md)) *
                    sin(md * 14.0 - uTime * 5.0) * 0.18;

    float elev = wave1 + wave2 + (wave3 + wave4 + fbmV) * highFreqMask + mRipple;
    pos.z     += elev;

    vElevation = elev;
    vWorldPos   = (modelMatrix * vec4(pos, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/* ─────────────────────────────────────────────────────────────────────────────
   FRAGMENT SHADER

   AVANT — problèmes :
   • smoothstep ranges trop larges (0.45, 0.30…) → transitions molles, effet "nuage"
   • palette trop désaturée (#041628/#1a5fa8/#5b9de8)
   • specular exponent 160 → diffus et étalé
   • pas de microDetail → surface trop lisse/plastique

   APRÈS — fixes :
   • Palette recontrastée : deep #041628 / mid #0a2a52 / crest #1a6aaa / high #7ec8e3
   • Smoothstep ranges réduits de moitié → transitions nettes
   • microDetail = sin(vUv.x*80 + t*2) * sin(vUv.y*60 + t*1.5) * 0.04
     ajouté à vElevation pour le calcul couleur (texture de surface sans impacter géo)
   • Specular exponent 64 au lieu de 160 → reflet net et local
   • gl_FragColor = vec4(color * 1.1, alpha) → contraste global +10%
───────────────────────────────────────────────────────────────────────────── */
const fragmentShader = `
  uniform float uTime;
  varying vec2  vUv;
  varying float vElevation;
  varying vec3  vWorldPos;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.9898, 78.233))) * 43758.5453);
  }

  void main() {

    /* ── Palette — plus saturée et contrastée ────────────────────────── */
    vec3 colDeep  = vec3(0.016, 0.086, 0.157); /* #041628 — quasi-noir marin  */
    vec3 colMid   = vec3(0.039, 0.165, 0.322); /* #0a2a52 — bleu océan profond */
    vec3 colCrest = vec3(0.102, 0.416, 0.667); /* #1a6aaa — bleu vif crêtes   */
    vec3 colHigh  = vec3(0.494, 0.784, 0.890); /* #7ec8e3 — reflets lumineux  */
    vec3 colWhite = vec3(1.0);

    /* microDetail — texture de surface nette sans modifier la géométrie */
    float microDetail = sin(vUv.x * 80.0 + uTime * 2.0) *
                        sin(vUv.y * 60.0 + uTime * 1.5) * 0.04;
    float elevC = vElevation + microDetail;

    /* Smoothstep ranges resserrés (divisés par ~2) → transitions nettes */
    float t1 = smoothstep(-0.20,  0.05, elevC); /* deep → mid   */
    float t2 = smoothstep( 0.08,  0.22, elevC); /* mid → crest  */
    float t3 = smoothstep( 0.20,  0.38, elevC); /* crest → high */
    vec3 color = mix(colDeep, colMid,   t1);
    color      = mix(color,   colCrest, t2);
    color      = mix(color,   colHigh,  t3);

    /* ── Normal + View direction ─────────────────────────────────────── */
    vec3 N = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
    vec3 V = normalize(cameraPosition - vWorldPos);

    /* ── Fresnel ─────────────────────────────────────────────────────── */
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.5);
    color  = mix(color, colHigh,  fresnel * 0.55);
    color += colWhite * fresnel * fresnel * 0.35;

    /* ── Specular net (exponent 64 — reflet local et piqué) ─────────── */
    vec3 L1 = normalize(vec3(2.5 + sin(uTime * 0.18) * 0.4,  6.0, 2.5));
    vec3 L2 = normalize(vec3(-2.0 + cos(uTime * 0.14) * 0.5, 4.5, 3.0));
    float spec = pow(max(dot(N, normalize(L1 + V)), 0.0), 64.0)
               + pow(max(dot(N, normalize(L2 + V)), 0.0), 32.0) * 0.4;
    spec  *= smoothstep(0.05, 0.25, vElevation);
    color += vec3(0.8, 0.95, 1.0) * spec * 0.9;

    /* ── Bloom feed ─────────────────────────────────────────────────── */
    color += colHigh * smoothstep(0.28, 0.50, vElevation) * 0.45;

    /* ── Film grain ──────────────────────────────────────────────────── */
    color += (hash(vUv + fract(uTime * 0.07)) - 0.5) * 0.015;

    /* ── Alpha : fade haut + bords latéraux ──────────────────────────── */
    float alpha = smoothstep(0.5, 0.9, vUv.y)           /* fade en haut  */
                * smoothstep(0.0, 0.06, vUv.x)          /* bord gauche   */
                * smoothstep(1.0, 0.94, vUv.x)          /* bord droit    */
                * smoothstep(0.0, 0.02, vUv.y);         /* near (tiny)   */

    gl_FragColor = vec4(color * 1.1, alpha);
  }
`

/* ─────────────────────────────────────────────────────────────────────────────
   OceanSurface

   AVANT — useFrame :
     uniforms.uTime.value = state.clock.elapsedTime
     (accès via le closure useMemo — correct en théorie mais aucun frameloop
     garanti, ce qui bloquerait l'animation si Canvas n'est pas en "always")

   APRÈS — useFrame :
     meshRef sur le mesh → mesh.current.material.uniforms accès direct
     state.clock.getElapsedTime() explicite
     Canvas frameloop="always" → render loop garanti à chaque frame
───────────────────────────────────────────────────────────────────────────── */
function OceanSurface() {
  const meshRef = useRef(null)
  const { mouse } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime:          { value: 0 },
      uMouseX:        { value: 0.5 },
      uMouseY:        { value: 0.5 },
    }),
    []
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const u = meshRef.current.material.uniforms
    u.uTime.value       = state.clock.getElapsedTime()
    u.uMouseX.value    += (mouse.x * 0.5 + 0.5 - u.uMouseX.value) * 0.05
    u.uMouseY.value    += (mouse.y * 0.5 + 0.5 - u.uMouseY.value) * 0.05
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1.4, 0]}>
      <planeGeometry args={[16, 11, 256, 256]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}

export default function HeroOcean() {
  return (
    <Canvas
      frameloop="always"
      className="hero-ocean-canvas"
      dpr={Math.min(window.devicePixelRatio, 2)}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.1, 5.2], fov: 42 }}
    >
      <color attach="background" args={['#081d3a']} />
      <fog attach="fog" args={[0x081d3a, 8, 20]} />
      <Suspense fallback={null}>
        <OceanSurface />
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
          <ChromaticAberration offset={[0.0005, 0.0005]} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
