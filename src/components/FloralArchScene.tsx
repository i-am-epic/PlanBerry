"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FloralArchScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  // ── Scroll-driven camera progress ────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=100%",
      pin: true,
      pinSpacing: true,
      scrub: 1.4,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => st.kill();
  }, []);

  // ── Three.js scene ────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const testCanvas = document.createElement("canvas");
    const hasWebGL = !!(testCanvas.getContext("webgl2") || testCanvas.getContext("webgl"));
    if (!hasWebGL) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1 : 2);
    let mounted = true;
    let rafId: number | null = null;

    import("three").then((THREE) => {
      if (!mounted) return;

      // ─── Scene ────────────────────────────────────────────────────
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x080808);
      scene.fog = new THREE.FogExp2(0x080808, 0.018);

      const W = container.clientWidth || window.innerWidth;
      const H = container.clientHeight || window.innerHeight;

      // Camera starts outside arch, will fly through on scroll
      const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
      camera.position.set(0, 3.5, 14);
      camera.lookAt(0, 4.5, 0);

      const renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        powerPreference: isMobile ? "low-power" : "high-performance",
        alpha: false,
      });
      renderer.setSize(W, H);
      renderer.setPixelRatio(pixelRatio);
      renderer.shadowMap.enabled = !isMobile;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);

      // ─── Colors ───────────────────────────────────────────────────
      const BLUSH = 0xf5c6c6;
      const IVORY = 0xfff8f0;
      const ROSE_PINK = 0xe8879c;
      const DEEP_ROSE = 0xc45a7a;
      const GOLD = 0xd4a843;
      const WARM_WHITE = 0xfff5e6;
      const GREEN = 0x4a7c3f;

      // ─── Materials ────────────────────────────────────────────────
      const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.85, roughness: 0.15 });
      const roseMat = new THREE.MeshStandardMaterial({ color: ROSE_PINK, roughness: 0.65 });
      const deepRoseMat = new THREE.MeshStandardMaterial({ color: DEEP_ROSE, roughness: 0.6 });
      const blushMat = new THREE.MeshStandardMaterial({ color: BLUSH, roughness: 0.55 });
      const ivoryMat = new THREE.MeshStandardMaterial({ color: IVORY, roughness: 0.45 });
      const greenMat = new THREE.MeshStandardMaterial({ color: GREEN, roughness: 0.7, side: THREE.DoubleSide });
      const roseMats = [roseMat, deepRoseMat, blushMat, ivoryMat];

      // ─── Lighting ─────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffd4a8, 0.55));

      const key = new THREE.DirectionalLight(WARM_WHITE, 0.9);
      key.position.set(4, 14, 6);
      if (!isMobile) {
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.camera.near = 0.5;
        key.shadow.camera.far = 50;
        key.shadow.camera.left = -12;
        key.shadow.camera.right = 12;
        key.shadow.camera.top = 16;
        key.shadow.camera.bottom = -8;
        key.shadow.bias = -0.001;
      }
      scene.add(key);

      const fill = new THREE.DirectionalLight(0xffccaa, 0.4);
      fill.position.set(-6, 6, 4);
      scene.add(fill);

      const rim = new THREE.DirectionalLight(0xffeedd, 0.3);
      rim.position.set(0, 8, -10);
      scene.add(rim);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aisleLights: any[] = [];
      [-4, -2, 0, 2, 4].forEach((z) => {
        [-2.2, 2.2].forEach((x) => {
          const pl = new THREE.PointLight(0xffaa44, isMobile ? 0.25 : 0.5, 5);
          pl.position.set(x, 0.9, z);
          scene.add(pl);
          aisleLights.push(pl);
        });
      });

      const archLight = new THREE.PointLight(0xfff0dd, isMobile ? 0.4 : 0.9, 12);
      archLight.position.set(0, 10, -2);
      scene.add(archLight);

      // ─── Floor ────────────────────────────────────────────────────
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshStandardMaterial({ color: 0x100c18, roughness: 0.88, metalness: 0.04 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      // Blush aisle runner
      const runner = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 22),
        new THREE.MeshStandardMaterial({ color: BLUSH, roughness: 0.65, side: THREE.DoubleSide })
      );
      runner.rotation.x = -Math.PI / 2;
      runner.position.set(0, 0.01, 3);
      if (!isMobile) runner.receiveShadow = true;
      scene.add(runner);

      // ─── Helpers ──────────────────────────────────────────────────
      function createRose(color: number, size = 0.18) {
        const g = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.55, side: THREE.DoubleSide });
        const layers = 3;
        const petalsPerLayer = 6;
        for (let layer = 0; layer < layers; layer++) {
          const r = size * (0.3 + layer * 0.35);
          for (let p = 0; p < petalsPerLayer; p++) {
            const angle = (p / petalsPerLayer) * Math.PI * 2 + layer * 0.35;
            const petal = new THREE.Mesh(
              new THREE.SphereGeometry(size * (0.35 + layer * 0.12), 5, 4, 0, Math.PI),
              mat
            );
            petal.position.set(Math.cos(angle) * r, layer * size * 0.18, Math.sin(angle) * r);
            petal.rotation.set(0.4 + layer * 0.2, angle, 0);
            petal.scale.set(1, 0.28, 1);
            g.add(petal);
          }
        }
        const bud = new THREE.Mesh(new THREE.SphereGeometry(size * 0.3, 6, 6), mat);
        bud.position.y = size * 0.18;
        g.add(bud);
        return g;
      }

      function createLeaf(scale = 1) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0.12 * scale, 0.25 * scale, 0.08 * scale, 0.55 * scale, 0, 0.72 * scale);
        shape.bezierCurveTo(-0.08 * scale, 0.55 * scale, -0.12 * scale, 0.25 * scale, 0, 0);
        return new THREE.Mesh(new THREE.ShapeGeometry(shape, 5), greenMat);
      }

      // ─── Arch ─────────────────────────────────────────────────────
      const archGroup = new THREE.Group();
      archGroup.position.set(0, 0, -2);
      scene.add(archGroup);

      const ARCH_R = 4.2;
      const ARCH_SEGS = 32;
      const archPts: InstanceType<typeof THREE.Vector3>[] = [];
      for (let i = 0; i <= ARCH_SEGS; i++) {
        const theta = Math.PI - (i / ARCH_SEGS) * Math.PI;
        archPts.push(new THREE.Vector3(ARCH_R * Math.cos(theta), ARCH_R * Math.sin(theta), 0));
      }

      const archCurve = new THREE.CatmullRomCurve3(archPts);
      const archTube = new THREE.Mesh(
        new THREE.TubeGeometry(archCurve, 80, 0.055, 8, false),
        goldMat
      );
      if (!isMobile) archTube.castShadow = true;
      archGroup.add(archTube);

      [-ARCH_R, ARCH_R].forEach((x) => {
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.065, 0.5, 8),
          goldMat
        );
        pillar.position.set(x, 0.25, 0);
        archGroup.add(pillar);
      });

      // ─── Floral decoration ────────────────────────────────────────
      const rosetteCount = isMobile ? 14 : 30;
      for (let i = 0; i <= rosetteCount; i++) {
        const t = i / rosetteCount;
        const pt = archCurve.getPointAt(t);
        const tangent = archCurve.getTangentAt(t);
        const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();

        const rColor = roseMats[Math.floor(Math.random() * roseMats.length)].color.getHex();
        const rose = createRose(rColor, 0.14 + Math.random() * 0.1);
        rose.position.copy(pt);
        rose.position.addScaledVector(normal, (Math.random() - 0.5) * 0.3);
        rose.position.z += (Math.random() - 0.5) * 0.2;
        rose.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        archGroup.add(rose);

        if (i % 3 === 0) {
          for (let l = 0; l < 2; l++) {
            const leaf = createLeaf(0.28 + Math.random() * 0.18);
            leaf.position.copy(pt);
            leaf.position.add(new THREE.Vector3(
              (Math.random() - 0.5) * 0.4,
              (Math.random() - 0.5) * 0.25,
              (Math.random() - 0.5) * 0.25
            ));
            leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            archGroup.add(leaf);
          }
        }
      }

      // ─── Top cluster ──────────────────────────────────────────────
      const topCluster = new THREE.Group();
      const topPt = archCurve.getPointAt(0.5);
      topCluster.position.set(topPt.x, topPt.y - 2, -2);
      const clusterCount = isMobile ? 8 : 20;
      for (let i = 0; i < clusterCount; i++) {
        const a = (i / clusterCount) * Math.PI * 2;
        const r = Math.random() * 1.4;
        const rose = createRose([ROSE_PINK, DEEP_ROSE, BLUSH, IVORY][i % 4], 0.16 + Math.random() * 0.14);
        rose.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 0.7, Math.sin(a) * r * 0.5);
        rose.rotation.set(Math.random() * Math.PI, a, Math.random() * 0.4);
        topCluster.add(rose);
      }
      scene.add(topCluster);

      // ─── Silk ribbons ─────────────────────────────────────────────
      const drapeMat = new THREE.MeshStandardMaterial({
        color: IVORY, roughness: 0.2, transparent: true, opacity: 0.5, side: THREE.DoubleSide,
      });
      [-0.8, 0, 0.8].forEach((xOff, idx) => {
        const ribbonCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(xOff, topPt.y - 0.3, -2),
          new THREE.Vector3(xOff + 0.15 * (idx - 1), topPt.y - 1.2, -1.8),
          new THREE.Vector3(xOff + 0.1 * (idx - 1), topPt.y - 2.2, -1.6),
          new THREE.Vector3(xOff, topPt.y - 3.5, -1.4),
        ]);
        scene.add(new THREE.Mesh(new THREE.TubeGeometry(ribbonCurve, 12, 0.12, 4, false), drapeMat));
      });

      // ─── Candles ──────────────────────────────────────────────────
      [-4, -2, 0, 2, 4].forEach((z) => {
        [-2.2, 2.2].forEach((x) => {
          const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.75, 8), ivoryMat);
          candle.position.set(x, 0.375, z);
          if (!isMobile) candle.castShadow = true;
          scene.add(candle);
          const flame = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 5, 5),
            new THREE.MeshStandardMaterial({ color: 0xffdd44, emissive: 0xffaa22, emissiveIntensity: 2 })
          );
          flame.position.set(x, 0.82, z);
          scene.add(flame);
        });
      });

      // ─── Chandeliers ──────────────────────────────────────────────
      function makeChandelier(x: number, y: number, z: number, scale = 1) {
        const g = new THREE.Group();
        g.position.set(x, y, z);
        g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.2 * scale, 5), goldMat));
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7 * scale, 0.025, 8, 28), goldMat);
        ring.position.y = -0.6 * scale;
        g.add(ring);
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.42 * scale, 0.018, 8, 20), goldMat);
        ring2.position.y = -0.75 * scale;
        g.add(ring2);
        const crystalMat = new THREE.MeshStandardMaterial({
          color: 0xfff8f8, metalness: 0.05, roughness: 0.04, transparent: true, opacity: 0.75,
        });
        const crystalCount = isMobile ? 7 : 14;
        for (let i = 0; i < crystalCount; i++) {
          const a = (i / crystalCount) * Math.PI * 2;
          const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.065 * scale), crystalMat);
          crystal.position.set(Math.cos(a) * 0.7 * scale, -0.75 * scale - Math.random() * 0.3 * scale, Math.sin(a) * 0.7 * scale);
          g.add(crystal);
        }
        const cl = new THREE.PointLight(WARM_WHITE, isMobile ? 0.35 : 0.65, 9 * scale);
        cl.position.y = -0.6 * scale;
        g.add(cl);
        return g;
      }

      const c1 = makeChandelier(0, 12, -2, 1.1);
      const c2 = makeChandelier(-3.5, 11, 0, 0.85);
      const c3 = makeChandelier(3.5, 11, 0, 0.85);
      scene.add(c1, c2, c3);

      // ─── Falling petals ───────────────────────────────────────────
      const petalCount = isMobile ? 70 : 180;
      const petalGeo = new THREE.SphereGeometry(0.045, 4, 3, 0, Math.PI);
      const petalMat = new THREE.MeshStandardMaterial({ color: BLUSH, roughness: 0.7 });
      const petals = new THREE.InstancedMesh(petalGeo, petalMat, petalCount);
      petals.instanceMatrix.setUsage(35040);
      scene.add(petals);

      type PD = { x: number; y: number; z: number; vy: number; sy: number; sa: number; ph: number; rs: number; ir: number; sc: number };
      const pd: PD[] = Array.from({ length: petalCount }, () => ({
        x: (Math.random() - 0.5) * 16,
        y: Math.random() * 14,
        z: (Math.random() - 0.5) * 8,
        vy: 0.006 + Math.random() * 0.012,
        sy: 0.25 + Math.random() * 0.6,
        sa: 0.08 + Math.random() * 0.25,
        ph: Math.random() * Math.PI * 2,
        rs: 0.4 + Math.random() * 1.2,
        ir: Math.random() * Math.PI,
        sc: 0.6 + Math.random() * 1.3,
      }));
      const dummy = new THREE.Object3D();

      // ─── Post-processing ──────────────────────────────────────────
      let composer: { render: () => void; setSize: (w: number, h: number) => void } | null = null;
      if (!isMobile) {
        Promise.all([
          import("three/examples/jsm/postprocessing/EffectComposer.js"),
          import("three/examples/jsm/postprocessing/RenderPass.js"),
          import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
          import("three/examples/jsm/postprocessing/OutputPass.js"),
        ]).then(([{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }]) => {
          if (!mounted) return;
          const c = new EffectComposer(renderer);
          c.addPass(new RenderPass(scene, camera));
          c.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.28, 0.55, 0.85));
          c.addPass(new OutputPass());
          composer = c;
        });
      }

      // ─── Animation loop ───────────────────────────────────────────
      const startTime = performance.now();
      const animate = () => {
        if (!mounted) return;
        rafId = requestAnimationFrame(animate);
        const t = (performance.now() - startTime) / 1000;

        // Petals
        for (let i = 0; i < petalCount; i++) {
          const d = pd[i];
          d.y -= d.vy;
          if (d.y < -1) d.y = 13 + Math.random() * 3;
          dummy.position.set(
            d.x + Math.sin(t * d.sy + d.ph) * d.sa,
            d.y,
            d.z + Math.cos(t * d.sy * 0.65 + d.ph) * d.sa * 0.5
          );
          dummy.rotation.set(d.ir + t * d.rs, d.ir * 0.5 + t * d.rs * 0.5, t * d.rs * 0.28);
          dummy.scale.setScalar(d.sc);
          dummy.updateMatrix();
          petals.setMatrixAt(i, dummy.matrix);
        }
        petals.instanceMatrix.needsUpdate = true;

        // Chandelier sway
        c1.rotation.z = Math.sin(t * 0.28) * 0.009;
        c2.rotation.z = Math.sin(t * 0.28 + 1) * 0.009;
        c3.rotation.z = Math.sin(t * 0.24 + 2) * 0.007;
        c1.rotation.y = t * 0.045;
        c2.rotation.y = -t * 0.045;
        c3.rotation.y = t * 0.03;

        // Candle flicker
        aisleLights.forEach((l, i) => {
          l.intensity = (isMobile ? 0.25 : 0.5) * (0.85 + Math.sin(t * 8 + i * 1.7) * 0.15);
        });

        // ── Scroll-driven camera fly-through ──────────────────────
        // Ease-in-out cubic
        const raw = progressRef.current;
        const ep = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;

        // Camera path: outside arch (z=14) → through arch → inside (z=-8)
        camera.position.z = 14 + (-8 - 14) * ep;          // 14 → -8
        camera.position.y = 3.5 + (2.6 - 3.5) * ep;       // 3.5 → 2.6 (slightly lower as we pass through)
        camera.position.x = Math.sin(ep * Math.PI) * 0.4;  // subtle lateral drift

        // Look target rises as we enter (more dramatic ceiling view inside)
        const lookY = 4.5 + (6.0 - 4.5) * ep;
        const lookZ = 0 + (-5 - 0) * ep;
        camera.lookAt(0, lookY, lookZ);

        if (composer) composer.render();
        else renderer.render(scene, camera);
      };
      animate();

      // ─── Resize ───────────────────────────────────────────────────
      const ro = new ResizeObserver(() => {
        if (!container || !mounted) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer?.setSize(w, h);
      });
      ro.observe(container);

      return () => {
        mounted = false;
        if (rafId) cancelAnimationFrame(rafId);
        ro.disconnect();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    });

    return () => { mounted = false; };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="celebrations"
      className="relative overflow-hidden"
      style={{ height: "100vh", minHeight: 600, background: "#080808" }}
    >
      <div ref={containerRef} className="absolute inset-0" />

      {/* Fade edges into site background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #080808 0%, transparent 14%, transparent 80%, #080808 100%)",
        }}
      />

      {/* Scroll hint — fades as user scrolls in */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{ padding: "0 var(--pad-x) clamp(2.5rem, 5vh, 4.5rem)" }}
      >
        <div className="flex items-end justify-between">
          <div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(245,198,198,0.55)",
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              Celebrations
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(1.9rem, 3.8vw, 4.2rem)",
                fontVariationSettings: "'SOFT' 50, 'WONK' 1",
                lineHeight: 1.08,
                color: "#fff8f0",
                maxWidth: "18ch",
              }}
            >
              Where forever{" "}
              <span
                className="italic"
                style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1", color: "#f5c6c6" }}
              >
                begins
              </span>
            </h2>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "clamp(0.72rem, 0.85vw, 0.88rem)",
              color: "rgba(255,248,240,0.35)",
              lineHeight: 1.6,
              textAlign: "right",
              paddingBottom: "0.3rem",
            }}
          >
            scroll to enter
          </p>
        </div>
      </div>
    </section>
  );
}
