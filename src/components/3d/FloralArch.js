import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a0f1e);
scene.fog = new THREE.FogExp2(0x1a0f1e, 0.012);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 5, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
const root = document.getElementById('root') ?? document.body;
root.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.05;
controls.minDistance = 8;
controls.maxDistance = 30;
controls.target.set(0, 3, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.3;

// Post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.4, 0.6, 0.85);
composer.addPass(bloomPass);
composer.addPass(new SMAAPass(window.innerWidth, window.innerHeight));
composer.addPass(new OutputPass());

// Colors
const BLUSH = 0xf5c6c6;
const IVORY = 0xfff8f0;
const ROSE_PINK = 0xe8879c;
const DEEP_ROSE = 0xc45a7a;
const GOLD = 0xd4a843;
const WARM_WHITE = 0xfff5e6;
const GREEN = 0x4a7c3f;
const DARK_GREEN = 0x2d5a27;

// Materials
const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.9, roughness: 0.2 });
const crystalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.7 });
const roseMat = new THREE.MeshStandardMaterial({ color: ROSE_PINK, roughness: 0.6 });
const deepRoseMat = new THREE.MeshStandardMaterial({ color: DEEP_ROSE, roughness: 0.6 });
const blushMat = new THREE.MeshStandardMaterial({ color: BLUSH, roughness: 0.5 });
const ivoryMat = new THREE.MeshStandardMaterial({ color: IVORY, roughness: 0.4 });
const greenMat = new THREE.MeshStandardMaterial({ color: GREEN, roughness: 0.7 });
const darkGreenMat = new THREE.MeshStandardMaterial({ color: DARK_GREEN, roughness: 0.7 });
const silkMat = new THREE.MeshStandardMaterial({ color: IVORY, roughness: 0.3, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
const chinaMat = new THREE.MeshStandardMaterial({ color: 0xfefefe, roughness: 0.15, metalness: 0.05 });
const fabricMat = new THREE.MeshStandardMaterial({ color: IVORY, roughness: 0.5, side: THREE.DoubleSide });

// ====== LIGHTING ======
const ambientLight = new THREE.AmbientLight(0xffd4a8, 0.3);
ambientLight.name = 'ambientLight';
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(WARM_WHITE, 0.6);
mainLight.name = 'mainLight';
mainLight.position.set(5, 15, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(2048, 2048);
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 50;
mainLight.shadow.camera.left = -20;
mainLight.shadow.camera.right = 20;
mainLight.shadow.camera.top = 20;
mainLight.shadow.camera.bottom = -20;
mainLight.shadow.bias = -0.001;
mainLight.shadow.normalBias = 0.02;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xffe0d0, 0.25);
fillLight.name = 'fillLight';
fillLight.position.set(-5, 8, -3);
scene.add(fillLight);

// ====== FLOOR ======
const floorGeo = new THREE.CircleGeometry(40, 64);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x2a1f2e, roughness: 0.8, metalness: 0.1 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.name = 'floor';
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Decorative floor runner (aisle carpet)
const runnerGeo = new THREE.PlaneGeometry(3, 25);
const runnerMat = new THREE.MeshStandardMaterial({ color: BLUSH, roughness: 0.6, side: THREE.DoubleSide });
const runner = new THREE.Mesh(runnerGeo, runnerMat);
runner.name = 'aisleRunner';
runner.rotation.x = -Math.PI / 2;
runner.position.set(0, 0.01, 2);
scene.add(runner);

// ====== ROSE CREATION FUNCTION ======
function createRose(color, size = 0.2) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.55, side: THREE.DoubleSide });
    const petalCount = 12;
    for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const ring = Math.floor(i / 4);
        const petalGeo = new THREE.SphereGeometry(size * (0.5 + ring * 0.2), 6, 6, 0, Math.PI);
        const petal = new THREE.Mesh(petalGeo, mat);
        petal.position.set(
            Math.cos(angle) * size * ring * 0.25,
            ring * size * 0.1,
            Math.sin(angle) * size * ring * 0.25
        );
        petal.rotation.set(0.3 + ring * 0.25, angle, 0);
        petal.scale.set(1, 0.3, 1);
        group.add(petal);
    }
    // center bud
    const budGeo = new THREE.SphereGeometry(size * 0.35, 8, 8);
    const bud = new THREE.Mesh(budGeo, mat);
    bud.position.y = size * 0.1;
    group.add(bud);
    return group;
}

// ====== LEAF CREATION ======
function createLeaf(scale = 1) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.15 * scale, 0.3 * scale, 0.1 * scale, 0.6 * scale, 0, 0.8 * scale);
    shape.bezierCurveTo(-0.1 * scale, 0.6 * scale, -0.15 * scale, 0.3 * scale, 0, 0);
    const geo = new THREE.ShapeGeometry(shape, 6);
    const leaf = new THREE.Mesh(geo, greenMat);
    return leaf;
}

// ====== FLORAL ARCH (Hero Element) ======
const archGroup = new THREE.Group();
archGroup.name = 'floralArch';
archGroup.position.set(0, 0, -2);
scene.add(archGroup);

// Arch structure
const archCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.5, 0, 0),
    new THREE.Vector3(-3.5, 5, 0),
    new THREE.Vector3(-2.5, 7.5, 0),
    new THREE.Vector3(0, 8.5, 0),
    new THREE.Vector3(2.5, 7.5, 0),
    new THREE.Vector3(3.5, 5, 0),
    new THREE.Vector3(3.5, 0, 0)
]);

const archTubeGeo = new THREE.TubeGeometry(archCurve, 60, 0.12, 12, false);
const archFrame = new THREE.Mesh(archTubeGeo, goldMat);
archFrame.name = 'archFrame';
archFrame.castShadow = true;
archGroup.add(archFrame);

// Second arch layer (depth)
const archCurve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.2, 0, 0.5),
    new THREE.Vector3(-3.2, 4.8, 0.5),
    new THREE.Vector3(-2.3, 7.2, 0.5),
    new THREE.Vector3(0, 8.1, 0.5),
    new THREE.Vector3(2.3, 7.2, 0.5),
    new THREE.Vector3(3.2, 4.8, 0.5),
    new THREE.Vector3(3.2, 0, 0.5)
]);
const archTube2 = new THREE.Mesh(new THREE.TubeGeometry(archCurve2, 60, 0.08, 12, false), goldMat);
archTube2.name = 'archFrame2';
archGroup.add(archTube2);

// Roses on arch
const archPoints = archCurve.getSpacedPoints(45);
archPoints.forEach((pt, i) => {
    const colors = [ROSE_PINK, DEEP_ROSE, BLUSH, IVORY, 0xf2a5b8];
    const rose = createRose(colors[i % colors.length], 0.15 + Math.random() * 0.12);
    rose.position.copy(pt);
    rose.position.x += (Math.random() - 0.5) * 0.5;
    rose.position.z += (Math.random() - 0.5) * 0.4;
    rose.rotation.set(Math.random() * 0.5, Math.random() * Math.PI * 2, Math.random() * 0.5);
    archGroup.add(rose);

    // Add leaves
    if (Math.random() > 0.5) {
        const leaf = createLeaf(0.3 + Math.random() * 0.2);
        leaf.position.copy(pt);
        leaf.position.x += (Math.random() - 0.5) * 0.6;
        leaf.position.z += (Math.random() - 0.5) * 0.3;
        leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        archGroup.add(leaf);
    }
});

// Greenery vines trailing down
for (let side = -1; side <= 1; side += 2) {
    for (let v = 0; v < 4; v++) {
        const vineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(side * 3.5, 4 - v * 0.8, 0.2),
            new THREE.Vector3(side * 3.6, 3 - v * 0.8, 0.3 + Math.random() * 0.3),
            new THREE.Vector3(side * 3.4, 2 - v * 0.8, 0.1),
            new THREE.Vector3(side * 3.5, 1 - v * 0.5, 0.2 + Math.random() * 0.2)
        ]);
        const vineGeo = new THREE.TubeGeometry(vineCurve, 12, 0.02, 6, false);
        const vine = new THREE.Mesh(vineGeo, darkGreenMat);
        vine.name = `vine_${side}_${v}`;
        archGroup.add(vine);

        // Leaves on vine
        const vPoints = vineCurve.getSpacedPoints(5);
        vPoints.forEach((vp, li) => {
            const leaf = createLeaf(0.15 + Math.random() * 0.1);
            leaf.position.copy(vp);
            leaf.rotation.set(Math.random(), Math.random(), Math.random());
            archGroup.add(leaf);
        });
    }
}

// ====== CHANDELIERS ======
function createChandelier(x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Main frame
    const ringGeo = new THREE.TorusGeometry(0.8, 0.04, 12, 24);
    const ring1 = new THREE.Mesh(ringGeo, goldMat);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(0.5, 0.03, 12, 24);
    const ring2 = new THREE.Mesh(ring2Geo, goldMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 0.3;
    group.add(ring2);

    // Vertical supports
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const supportGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 6);
        const support = new THREE.Mesh(supportGeo, goldMat);
        support.position.set(Math.cos(angle) * 0.5, 0.15, Math.sin(angle) * 0.5);
        group.add(support);
    }

    // Chain to ceiling
    const chainGeo = new THREE.CylinderGeometry(0.01, 0.01, 3, 6);
    const chain = new THREE.Mesh(chainGeo, goldMat);
    chain.position.y = 1.8;
    group.add(chain);

    // Crystal drops
    const crystalGeo = new THREE.ConeGeometry(0.04, 0.2, 6);
    const crystalSphereGeo = new THREE.SphereGeometry(0.035, 8, 8);
    for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const r = i < 9 ? 0.8 : 0.5;
        const yOff = i < 9 ? -0.15 : 0.15;

        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.set(Math.cos(angle) * r, yOff - 0.15, Math.sin(angle) * r);
        group.add(crystal);

        const sphere = new THREE.Mesh(crystalSphereGeo, crystalMat);
        sphere.position.set(Math.cos(angle) * r, yOff, Math.sin(angle) * r);
        group.add(sphere);
    }

    // Central crystal
    const bigCrystalGeo = new THREE.OctahedronGeometry(0.12, 0);
    const bigCrystal = new THREE.Mesh(bigCrystalGeo, crystalMat);
    bigCrystal.position.y = -0.3;
    group.add(bigCrystal);

    // Light
    const light = new THREE.PointLight(0xffd699, 2.5, 15, 1.5);
    light.position.y = -0.1;
    light.castShadow = true;
    light.shadow.mapSize.set(512, 512);
    light.shadow.bias = -0.002;
    group.add(light);

    // Glow sphere
    const glowGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffeebb, transparent: true, opacity: 0.3 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = -0.1;
    group.add(glow);

    return group;
}

const chandelier1 = createChandelier(-2.5, 8, 2);
chandelier1.name = 'chandelier1';
scene.add(chandelier1);

const chandelier2 = createChandelier(2.5, 8, 2);
chandelier2.name = 'chandelier2';
scene.add(chandelier2);

const chandelier3 = createChandelier(0, 9.5, -1.5);
chandelier3.name = 'chandelier3';
chandelier3.scale.setScalar(1.2);
scene.add(chandelier3);

// ====== BANQUET TABLE ======
const tableGroup = new THREE.Group();
tableGroup.name = 'banquetTable';
tableGroup.position.set(0, 0, 5);
scene.add(tableGroup);

// Table top
const tableTopGeo = new THREE.BoxGeometry(6, 0.1, 1.8);
const tableTopMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.3, metalness: 0.1 });
const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
tableTop.name = 'tableTop';
tableTop.position.y = 1.0;
tableTop.castShadow = true;
tableTop.receiveShadow = true;
tableGroup.add(tableTop);

// Table legs
for (let x = -1; x <= 1; x += 2) {
    for (let z = -1; z <= 1; z += 2) {
        const legGeo = new THREE.CylinderGeometry(0.06, 0.08, 1, 8);
        const leg = new THREE.Mesh(legGeo, tableTopMat);
        leg.name = `tableLeg_${x}_${z}`;
        leg.position.set(x * 2.7, 0.5, z * 0.7);
        leg.castShadow = true;
        tableGroup.add(leg);
    }
}

// Tablecloth draping
const clothGeo = new THREE.BoxGeometry(6.3, 0.02, 2.1);
const clothMat = new THREE.MeshStandardMaterial({ color: IVORY, roughness: 0.4 });
const cloth = new THREE.Mesh(clothGeo, clothMat);
cloth.name = 'tablecloth';
cloth.position.y = 1.06;
tableGroup.add(cloth);

// Runner on table
const tRunnerGeo = new THREE.BoxGeometry(6.4, 0.01, 0.6);
const tRunnerMat = new THREE.MeshStandardMaterial({ color: BLUSH, roughness: 0.5 });
const tRunner = new THREE.Mesh(tRunnerGeo, tRunnerMat);
tRunner.name = 'tableRunner';
tRunner.position.y = 1.08;
tableGroup.add(tRunner);

// Place settings
function createPlaceSetting(x, z, side) {
    const g = new THREE.Group();
    g.position.set(x, 1.1, z);

    // Plate
    const plateGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 24);
    const plate = new THREE.Mesh(plateGeo, chinaMat);
    g.add(plate);

    // Plate rim (gold ring)
    const rimGeo = new THREE.TorusGeometry(0.21, 0.008, 8, 24);
    const rim = new THREE.Mesh(rimGeo, goldMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.01;
    g.add(rim);

    // Inner plate
    const innerGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.015, 24);
    const inner = new THREE.Mesh(innerGeo, new THREE.MeshStandardMaterial({ color: BLUSH, roughness: 0.2 }));
    inner.position.y = 0.015;
    g.add(inner);

    // Wine glass
    const glassGroup = new THREE.Group();
    glassGroup.position.set(0.18 * side, 0, -0.15);
    const bowlGeo = new THREE.SphereGeometry(0.06, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.5);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0.05 });
    const bowl = new THREE.Mesh(bowlGeo, glassMat);
    bowl.position.y = 0.15;
    glassGroup.add(bowl);
    const stemGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.12, 6);
    const stem = new THREE.Mesh(stemGeo, glassMat);
    stem.position.y = 0.08;
    glassGroup.add(stem);
    const baseGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.008, 12);
    const base = new THREE.Mesh(baseGeo, glassMat);
    base.position.y = 0.015;
    glassGroup.add(base);
    g.add(glassGroup);

    // Silverware
    const knifeGeo = new THREE.BoxGeometry(0.01, 0.005, 0.18);
    const knife = new THREE.Mesh(knifeGeo, goldMat);
    knife.position.set(0.28, 0, 0);
    g.add(knife);

    const forkGeo = new THREE.BoxGeometry(0.01, 0.005, 0.18);
    const fork = new THREE.Mesh(forkGeo, goldMat);
    fork.position.set(-0.28, 0, 0);
    g.add(fork);

    // Napkin
    const napkinGeo = new THREE.BoxGeometry(0.12, 0.04, 0.12);
    const napkinMat = new THREE.MeshStandardMaterial({ color: BLUSH, roughness: 0.6 });
    const napkin = new THREE.Mesh(napkinGeo, napkinMat);
    napkin.position.set(-0.28, 0.02, -0.15);
    g.add(napkin);

    return g;
}

for (let i = 0; i < 6; i++) {
    const x = -2.2 + i * 0.88;
    const setting1 = createPlaceSetting(x, -0.55, 1);
    setting1.name = `placeSetting_front_${i}`;
    tableGroup.add(setting1);
    const setting2 = createPlaceSetting(x, 0.55, -1);
    setting2.name = `placeSetting_back_${i}`;
    tableGroup.add(setting2);
}

// Floral centerpiece on table
function createCenterpiece(x) {
    const g = new THREE.Group();
    g.position.set(x, 1.15, 0);

    // Vase
    const vaseGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.2, 12);
    const vaseMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.7, roughness: 0.3 });
    const vase = new THREE.Mesh(vaseGeo, vaseMat);
    g.add(vase);

    // Roses
    for (let j = 0; j < 7; j++) {
        const colors = [ROSE_PINK, DEEP_ROSE, BLUSH, IVORY];
        const rose = createRose(colors[j % colors.length], 0.1);
        rose.position.set(
            (Math.random() - 0.5) * 0.2,
            0.12 + Math.random() * 0.15,
            (Math.random() - 0.5) * 0.2
        );
        rose.rotation.set(Math.random() * 0.3, Math.random() * Math.PI * 2, Math.random() * 0.3);
        g.add(rose);
    }

    // Greenery
    for (let j = 0; j < 5; j++) {
        const leaf = createLeaf(0.2);
        leaf.position.set(
            (Math.random() - 0.5) * 0.25,
            0.1 + Math.random() * 0.1,
            (Math.random() - 0.5) * 0.25
        );
        leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        g.add(leaf);
    }

    // Candle
    const candleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.2, 8);
    const candleMat = new THREE.MeshStandardMaterial({ color: IVORY, roughness: 0.5 });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.set(0.12, 0.15, 0);
    g.add(candle);

    const flameGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffcc44 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0.12, 0.27, 0);
    flame.name = `flame_${x}`;
    g.add(flame);

    const candleLight = new THREE.PointLight(0xffcc44, 0.5, 3, 2);
    candleLight.position.set(0.12, 0.3, 0);
    g.add(candleLight);

    return g;
}

for (let i = 0; i < 3; i++) {
    const cp = createCenterpiece(-1.5 + i * 1.5);
    cp.name = `centerpiece_${i}`;
    tableGroup.add(cp);
}

// ====== STAGE BACKDROP (Background) ======
const backdropGroup = new THREE.Group();
backdropGroup.name = 'stageBackdrop';
backdropGroup.position.set(0, 0, -8);
scene.add(backdropGroup);

// Ornate entry frame - pillars
for (let side = -1; side <= 1; side += 2) {
    const pillarGeo = new THREE.CylinderGeometry(0.3, 0.35, 9, 16);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xf0e6d8, roughness: 0.4 });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.name = `pillar_${side}`;
    pillar.position.set(side * 4, 4.5, 0);
    pillar.castShadow = true;
    backdropGroup.add(pillar);

    // Pillar cap
    const capGeo = new THREE.BoxGeometry(0.9, 0.3, 0.9);
    const cap = new THREE.Mesh(capGeo, goldMat);
    cap.position.set(side * 4, 9.1, 0);
    backdropGroup.add(cap);

    // Pillar base
    const baseGeo = new THREE.BoxGeometry(0.9, 0.3, 0.9);
    const bse = new THREE.Mesh(baseGeo, pillarMat);
    bse.position.set(side * 4, 0.15, 0);
    backdropGroup.add(bse);

    // Inner pillars
    const innerPillarGeo = new THREE.CylinderGeometry(0.18, 0.22, 8, 12);
    const innerPillar = new THREE.Mesh(innerPillarGeo, pillarMat);
    innerPillar.name = `innerPillar_${side}`;
    innerPillar.position.set(side * 2.8, 4, 0.3);
    innerPillar.castShadow = true;
    backdropGroup.add(innerPillar);
}

// Top beam / arch
const beamCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4, 9.2, 0),
    new THREE.Vector3(-2, 10, 0),
    new THREE.Vector3(0, 10.3, 0),
    new THREE.Vector3(2, 10, 0),
    new THREE.Vector3(4, 9.2, 0)
]);
const beamGeo = new THREE.TubeGeometry(beamCurve, 30, 0.15, 12, false);
const beam = new THREE.Mesh(beamGeo, goldMat);
beam.name = 'topBeam';
backdropGroup.add(beam);

// Decorative scrollwork pattern
for (let i = 0; i < 8; i++) {
    const t = i / 7;
    const pt = beamCurve.getPointAt(t);
    const scrollGeo = new THREE.TorusGeometry(0.15, 0.02, 8, 12);
    const scroll = new THREE.Mesh(scrollGeo, goldMat);
    scroll.position.copy(pt);
    scroll.position.y -= 0.3;
    scroll.rotation.y = Math.PI / 2;
    backdropGroup.add(scroll);
}

// Background drape panels
for (let i = -3; i <= 3; i++) {
    const drapeGeo = new THREE.PlaneGeometry(1.2, 9);
    const drapeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? IVORY : BLUSH,
        roughness: 0.45,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
    });
    const drape = new THREE.Mesh(drapeGeo, drapeMat);
    drape.name = `backdropDrape_${i}`;
    drape.position.set(i * 1.15, 4.5, -0.5);
    backdropGroup.add(drape);
}

// ====== SILK DRAPERY & RIBBONS ======
function createDrape(startX, startY, startZ, endX, endY, endZ, sag) {
    const midY = Math.min(startY, endY) - sag;
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX, startY, startZ),
        new THREE.Vector3((startX + endX) / 2, midY, (startZ + endZ) / 2 + 0.5),
        new THREE.Vector3(endX, endY, endZ)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 30, 0.08, 8, false);
    return new THREE.Mesh(tubeGeo, silkMat);
}

// Draped silk between chandeliers
const drape1 = createDrape(-2.5, 8, 2, 0, 9.5, -1.5, 1.5);
drape1.name = 'silkDrape1';
scene.add(drape1);

const drape2 = createDrape(2.5, 8, 2, 0, 9.5, -1.5, 1.5);
drape2.name = 'silkDrape2';
scene.add(drape2);

// Additional decorative ribbons
for (let i = 0; i < 6; i++) {
    const ribbonCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4 + i * 1.6, 7 + Math.random(), -2 + Math.random() * 8),
        new THREE.Vector3(-3.5 + i * 1.6, 5.5 + Math.random(), -1 + Math.random() * 6),
        new THREE.Vector3(-3 + i * 1.6, 4 + Math.random(), 0 + Math.random() * 4)
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 20, 0.015, 6, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? BLUSH : GOLD,
        roughness: 0.3,
        metalness: i % 2 === 0 ? 0.0 : 0.6
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.name = `ribbon_${i}`;
    scene.add(ribbon);
}

// ====== CASCADING PETALS ======
const petalInstances = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.08, 0.08),
    new THREE.MeshStandardMaterial({
        color: ROSE_PINK,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        roughness: 0.5
    }),
    200
);
petalInstances.name = 'petalParticles';

const petalData = [];
const dummy = new THREE.Object3D();
for (let i = 0; i < 200; i++) {
    const data = {
        x: (Math.random() - 0.5) * 16,
        y: Math.random() * 14,
        z: (Math.random() - 0.5) * 16 + 2,
        rotSpeed: 0.5 + Math.random() * 2,
        fallSpeed: 0.003 + Math.random() * 0.008,
        swayAmp: 0.2 + Math.random() * 0.5,
        swaySpeed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        initRot: Math.random() * Math.PI * 2,
        scale: 0.5 + Math.random() * 1
    };
    petalData.push(data);

    dummy.position.set(data.x, data.y, data.z);
    dummy.rotation.set(data.initRot, data.initRot * 0.5, 0);
    dummy.scale.setScalar(data.scale);
    dummy.updateMatrix();
    petalInstances.setMatrixAt(i, dummy.matrix);

    // Vary colors
    const colors = [new THREE.Color(ROSE_PINK), new THREE.Color(BLUSH), new THREE.Color(IVORY), new THREE.Color(0xf2a5b8)];
    petalInstances.setColorAt(i, colors[i % colors.length]);
}
petalInstances.instanceMatrix.needsUpdate = true;
petalInstances.instanceColor.needsUpdate = true;
scene.add(petalInstances);

// ====== SIDE DECORATIONS - Floral Pedestals ======
for (let side = -1; side <= 1; side += 2) {
    const pedGroup = new THREE.Group();
    pedGroup.name = `floralPedestal_${side}`;
    pedGroup.position.set(side * 5.5, 0, 3);

    // Pedestal
    const pedGeo = new THREE.CylinderGeometry(0.35, 0.4, 1.5, 16);
    const pedMat = new THREE.MeshStandardMaterial({ color: 0xf0e6d8, roughness: 0.4 });
    const ped = new THREE.Mesh(pedGeo, pedMat);
    ped.position.y = 0.75;
    ped.castShadow = true;
    pedGroup.add(ped);

    // Large floral arrangement on top
    for (let r = 0; r < 12; r++) {
        const angle = (r / 12) * Math.PI * 2;
        const rad = 0.2 + Math.random() * 0.15;
        const colors = [ROSE_PINK, DEEP_ROSE, BLUSH, IVORY];
        const rose = createRose(colors[r % colors.length], 0.13);
        rose.position.set(Math.cos(angle) * rad, 1.6 + Math.random() * 0.2, Math.sin(angle) * rad);
        rose.rotation.set(Math.random() * 0.3, angle, Math.random() * 0.3);
        pedGroup.add(rose);
    }

    // Greenery
    for (let l = 0; l < 8; l++) {
        const leaf = createLeaf(0.25);
        const angle = (l / 8) * Math.PI * 2;
        leaf.position.set(Math.cos(angle) * 0.3, 1.55, Math.sin(angle) * 0.3);
        leaf.rotation.set(-0.5, angle, 0);
        pedGroup.add(leaf);
    }

    scene.add(pedGroup);
}

// ====== AMBIENT PARTICLE LIGHTS (firefly-like warm glow) ======
const glowParticlesGeo = new THREE.BufferGeometry();
const glowCount = 80;
const glowPositions = new Float32Array(glowCount * 3);
const glowParticleData = [];
for (let i = 0; i < glowCount; i++) {
    glowPositions[i * 3] = (Math.random() - 0.5) * 18;
    glowPositions[i * 3 + 1] = 1 + Math.random() * 10;
    glowPositions[i * 3 + 2] = -6 + Math.random() * 18;
    glowParticleData.push({
        speed: 0.002 + Math.random() * 0.005,
        phase: Math.random() * Math.PI * 2,
        amp: 0.3 + Math.random() * 0.5
    });
}
glowParticlesGeo.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3));
const glowParticlesMat = new THREE.PointsMaterial({
    color: 0xffd699,
    size: 0.12,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const glowParticles = new THREE.Points(glowParticlesGeo, glowParticlesMat);
glowParticles.name = 'ambientGlow';
scene.add(glowParticles);

// ====== GROUND ROSE PETALS (scattered on floor) ======
const groundPetalGeo = new THREE.CircleGeometry(0.05, 6);
for (let i = 0; i < 100; i++) {
    const colors = [ROSE_PINK, BLUSH, DEEP_ROSE, 0xf2a5b8];
    const mat = new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.5, side: THREE.DoubleSide });
    const petal = new THREE.Mesh(groundPetalGeo, mat);
    petal.name = `groundPetal_${i}`;
    petal.position.set(
        (Math.random() - 0.5) * 10,
        0.02,
        -2 + Math.random() * 15
    );
    petal.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    petal.rotation.z = Math.random() * Math.PI * 2;
    petal.scale.setScalar(0.5 + Math.random() * 1.5);
    scene.add(petal);
}

// ====== ANIMATION ======
const clock = new THREE.Clock();

function animate() {
    const t = clock.getElapsedTime();

    // Animate falling petals
    for (let i = 0; i < 200; i++) {
        const d = petalData[i];
        d.y -= d.fallSpeed;
        if (d.y < -0.5) d.y = 12 + Math.random() * 3;

        dummy.position.set(
            d.x + Math.sin(t * d.swaySpeed + d.phase) * d.swayAmp,
            d.y,
            d.z + Math.cos(t * d.swaySpeed * 0.7 + d.phase) * d.swayAmp * 0.5
        );
        dummy.rotation.set(
            d.initRot + t * d.rotSpeed,
            d.initRot * 0.5 + t * d.rotSpeed * 0.5,
            t * d.rotSpeed * 0.3
        );
        dummy.scale.setScalar(d.scale);
        dummy.updateMatrix();
        petalInstances.setMatrixAt(i, dummy.matrix);
    }
    petalInstances.instanceMatrix.needsUpdate = true;

    // Animate ambient glow particles
    const gPos = glowParticles.geometry.attributes.position.array;
    for (let i = 0; i < glowCount; i++) {
        const d = glowParticleData[i];
        gPos[i * 3] += Math.sin(t * d.speed * 50 + d.phase) * 0.003;
        gPos[i * 3 + 1] += Math.sin(t * d.speed * 30 + d.phase * 2) * 0.002;
        gPos[i * 3 + 2] += Math.cos(t * d.speed * 40 + d.phase) * 0.003;
    }
    glowParticles.geometry.attributes.position.needsUpdate = true;
    glowParticlesMat.opacity = 0.4 + Math.sin(t * 0.8) * 0.2;

    // Gentle chandelier sway
    chandelier1.rotation.z = Math.sin(t * 0.3) * 0.01;
    chandelier2.rotation.z = Math.sin(t * 0.3 + 1) * 0.01;
    chandelier3.rotation.z = Math.sin(t * 0.25 + 2) * 0.008;

    // Crystal sparkle
    chandelier1.rotation.y = t * 0.05;
    chandelier2.rotation.y = -t * 0.05;
    chandelier3.rotation.y = t * 0.03;

    controls.update();
    composer.render();
}

renderer.setAnimationLoop(animate);

// ====== UI OVERLAY ======
const overlay = document.createElement('div');
overlay.innerHTML = `
  <div style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
    font-family:'Inter',system-ui,sans-serif;color:rgba(255,248,240,0.85);
    text-align:center;pointer-events:none;z-index:10;">
    <div style="font-size:11px;letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;
      color:rgba(212,168,67,0.7);">✦ Forever Begins Here ✦</div>
    <div style="font-size:22px;letter-spacing:2px;font-weight:300;">Wedding Venue</div>
    <div style="font-size:10px;margin-top:8px;opacity:0.5;">drag to orbit • scroll to zoom</div>
  </div>
`;
document.body.appendChild(overlay);

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});