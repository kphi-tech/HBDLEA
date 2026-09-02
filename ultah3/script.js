import * as THREE from 'three';

/* ====================================================================
   SCRIPT.JS — Magical Birthday Memory Experience
   ==================================================================== */

/* ===============================
   CONFIG — Edit bagian ini
   =============================== */
const CONFIG = {
  name: "Lea",
  birthday: "22 August",
  music: "asset/Lover.mp3.mp3",

  heroQuote: "Today is not just another day...\nit's a celebration of you.",
  
  messages: [
    "You deserve all the happiness in the world.",
    "Thank you for being part of so many beautiful memories.",
    "May this new chapter bring you countless reasons to smile."
  ],

  memories: [
    {
      image: "asset/mem1.jpeg",
      title: "mixue date",
      text: "lucuu.."
    },
    {
      image: "asset/mem3.jpeg",
      title: "before fotobox",
      text: ""
    },
    {
      image: "asset/mem2.jpeg",
      title: "after fotobox",
      text: ""
    },
    {
      image: "asset/mem4.jpeg",
      title: "Jungle date",
      text: "Seruu..."
    },
    {
      image: "asset/mem5.jpeg",
      title: "after movie date",
      text: "ngantri parkir"
    },
    {
      image: "asset/mem6.jpeg",
      title: "indomaret date",
      text: "ayoo mam ice cream lagii..."
    }
  ],

  timeline: [
    {
      year: "2025",
      title: "First Memory",
      text: "Where everything started...",
      image: "asset/fst.jpeg"
    },
    {
      year: "2026",
      title: "Another Chapter",
      text: "We shared so many beautiful moments together.",
      image: "asset/sec.jpeg"
    },
    {
      year: "2026",
      title: "Today ❤️",
      text: "Celebrating you, today and always.",
      image: "asset/trd'.jpeg"
    }
  ],

  specialMessage: {
    greeting: "Dear",
    lines: [
      "Happy birthday to the person who holds my heart completely. Thank you for bringing so much brightness, love, and laughter into my everyday life. Walking through this journey of life alongside you is my greatest happiness and comfort. I hope this special day brings you as much boundless joy as you constantly give to me. May all your dreams come true, and may our love grow stronger with every single year."
    ],
    signature: "Happy Birthday! ❤️"
  },

  finalMessage: "I hope this little website becomes one of the memories you keep."
};

/* ===============================
   PARTICLE SYSTEM — Three.js
   =============================== */
class ParticleSystem {
  constructor(scene, count) {
    this.scene = scene;
    this.count = count;
    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const offsets = new Float32Array(count);
    const phases = new Float32Array(count);

    const palette = [
      [1.0, 0.08, 0.58],
      [1.0, 0.0, 1.0],
      [0.62, 0.0, 1.0],
      [1.0, 0.41, 0.71],
      [1.0, 1.0, 1.0],
      [0.78, 0.14, 0.69]
    ];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 30 + Math.random() * 30;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const target = this.getHeartPoint();
      targets[i * 3] = target.x;
      targets[i * 3 + 1] = target.y;
      targets[i * 3 + 2] = target.z;

      sizes[i] = Math.random() * 1.5 + 0.5;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];

      offsets[i] = Math.random() * Math.PI * 2;
      phases[i] = Math.random();
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3));
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));
    this.geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uSpiral: { value: 0 },
        uOrbit: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 30 }
      },
      vertexShader: `
        attribute vec3 aTarget;
        attribute float aSize;
        attribute vec3 aColor;
        attribute float aOffset;
        attribute float aPhase;
        
        uniform float uTime;
        uniform float uProgress;
        uniform float uSpiral;
        uniform float uOrbit;
        uniform float uPixelRatio;
        uniform float uSize;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec3 pos = position;
          
          float spiralAngle = uTime * 1.5 + aOffset * 6.28;
          float spiralRadius = 25.0 * (1.0 - uSpiral);
          vec3 spiralPos = vec3(
            cos(spiralAngle) * spiralRadius * (0.5 + aPhase * 0.5),
            sin(spiralAngle * 0.7) * spiralRadius * (0.5 + aPhase * 0.5),
            sin(spiralAngle) * spiralRadius * 0.3
          );
          
          vec3 driftPos = position + vec3(
            sin(uTime * 0.3 + aOffset) * 3.0,
            cos(uTime * 0.4 + aOffset) * 3.0,
            sin(uTime * 0.2 + aOffset * 2.0) * 3.0
          );
          
          pos = mix(driftPos, spiralPos, smoothstep(0.0, 0.4, uSpiral));
          pos = mix(pos, aTarget, smoothstep(0.0, 1.0, uProgress));
          
          float orbitAngle = uTime * 0.8 + aOffset;
          vec3 orbitOffset = vec3(
            sin(orbitAngle) * 0.3,
            cos(orbitAngle * 1.3) * 0.3,
            sin(orbitAngle * 0.7) * 0.3
          ) * uOrbit * aSize;
          
          pos += orbitOffset;
          
          float pulse = sin(uTime * 2.0 + aOffset) * 0.05 + 1.0;
          pos *= pulse;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * uSize * uPixelRatio * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          vColor = aColor;
          float twinkle = sin(uTime * 3.0 + aOffset * 5.0) * 0.3 + 0.7;
          vAlpha = twinkle;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, dist);
          alpha = pow(alpha, 1.8);
          
          float core = smoothstep(0.15, 0.0, dist);
          
          vec3 color = vColor;
          color = mix(color, vec3(1.0), core * 0.6);
          
          gl_FragColor = vec4(color, alpha * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  getHeartPoint() {
    const t = Math.random() * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    const r = 0.2 + Math.pow(Math.random(), 0.7) * 0.8;
    const px = x * r;
    const py = y * r;

    const dist = Math.sqrt(px * px + py * py);
    const maxDist = 18;
    const thicknessFactor = Math.max(0, 1 - (dist / maxDist));
    const thickness = Math.pow(thicknessFactor, 0.6) * 4.5;
    const pz = (Math.random() - 0.5) * thickness * 2;

    const scale = 0.28;
    return new THREE.Vector3(px * scale, py * scale, pz * scale);
  }

  update(time) {
    this.material.uniforms.uTime.value = time;
  }
  setProgress(v) { this.material.uniforms.uProgress.value = v; }
  setSpiral(v) { this.material.uniforms.uSpiral.value = v; }
  setOrbit(v) { this.material.uniforms.uOrbit.value = v; }
}

/* ===============================
   HEART 3D — Starry Heart Particles
   =============================== */
class Heart3D {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    
    this.createStarHeart();
    this.createGlowSprite();
    this.createOrbitParticles();
    this.createSparkles();
    
    this.scene.add(this.group);
  }

  // Membuat tekstur bintang berbentuk bintang 4 mata (sparkle)
  createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    ctx.translate(32, 32);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    
    // Gambar bintang 4 mata
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const x = Math.cos(angle) * 32;
      const y = Math.sin(angle) * 32;
      ctx.lineTo(x, y);
      
      const innerAngle = angle + Math.PI / 4;
      const ix = Math.cos(innerAngle) * 6;
      const iy = Math.sin(innerAngle) * 6;
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();
    
    // Tambahkan glow lingkaran di tengah
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-32, -32, 64, 64);
    
    return new THREE.CanvasTexture(canvas);
  }

  // Membuat bentuk hati dari ribuan bintang
  createStarHeart() {
    const count = 4000; // Jumlah bintang
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    const palette = [
      new THREE.Color(0xff1493), // pink
      new THREE.Color(0xff69b4), // rose
      new THREE.Color(0xff00ff), // magenta
      new THREE.Color(0xffffff), // white
      new THREE.Color(0xc724b1)  // violet
    ];

    for (let i = 0; i < count; i++) {
      // Rumus matematis bentuk hati 2D
      const t = Math.random() * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      // Membuat bintang banyak di permukaan dan sedikit di dalamnya
      const r = 0.6 + Math.pow(Math.random(), 0.5) * 0.4;
      const px = x * r;
      const py = y * r;

      // Menambahkan kedalaman 3D (Z-axis)
      const dist = Math.sqrt(px * px + py * py);
      const maxDist = 17;
      const thicknessFactor = Math.max(0, 1 - (dist / maxDist));
      const thickness = Math.pow(thicknessFactor, 0.6) * 4.5;
      const pz = (Math.random() - 0.5) * thickness * 2;

      const scale = 0.28;
      positions[i * 3] = px * scale;
      positions[i * 3 + 1] = py * scale;
      positions[i * 3 + 2] = pz * scale;

      // Ukuran bintang bervariasi
      sizes[i] = Math.random() * 0.4 + 0.1;

      // Warna acak dari palet
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Fase untuk efek kedip (twinkle)
      phases[i] = Math.random() * Math.PI * 2;
    }

    this.starGeometry = new THREE.BufferGeometry();
    this.starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.starGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    this.starGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    this.starGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    this.starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uTexture: { value: this.createStarTexture() }
      },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        attribute float aPhase;
        
        uniform float uTime;
        uniform float uPixelRatio;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec3 pos = position;
          
          // Sedikit pergerakan mengambang
          pos.x += sin(uTime * 1.5 + aPhase) * 0.05;
          pos.y += cos(uTime * 1.2 + aPhase) * 0.05;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * 200.0 * uPixelRatio * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          vColor = aColor;
          // Efek kedip bintang
          vAlpha = sin(uTime * 2.0 + aPhase * 3.0) * 0.4 + 0.6;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uOpacity;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          vec3 finalColor = vColor * 1.2; // Sedikit lebih terang
          gl_FragColor = vec4(finalColor, texColor.a * vAlpha * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(this.starGeometry, this.starMaterial);
    this.group.add(this.points);
  }

  // Glow di belakang bintang
  createGlowSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 20, 147, 0.6)');
    gradient.addColorStop(0.3, 'rgba(255, 20, 147, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 20, 147, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    this.glowMaterial = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      color: 0xff1493,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.glowSprite = new THREE.Sprite(this.glowMaterial);
    this.glowSprite.scale.set(8, 8, 1);
    this.group.add(this.glowSprite);
  }

  // Partikel mengelilingi hati
  createOrbitParticles() {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const offsets = new Float32Array(count);

    const palette = [
      [1.0, 0.08, 0.58],
      [1.0, 0.41, 0.71],
      [1.0, 1.0, 1.0],
      [1.0, 0.0, 1.0]
    ];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 2;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 1.2 + 0.3;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
      offsets[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));

    this.orbitMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 0 }
      },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        attribute float aOffset;
        uniform float uTime;
        uniform float uPixelRatio;
        varying vec3 vColor;
        
        void main() {
          vec3 pos = position;
          float angle = uTime * 0.5 + aOffset;
          float radius = length(pos.xz);
          pos.x = cos(angle) * radius;
          pos.z = sin(angle) * radius;
          pos.y += sin(uTime * 0.8 + aOffset * 2.0) * 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * 40.0 * uPixelRatio * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          vColor = aColor;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float uOpacity;
        
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist);
          alpha = pow(alpha, 2.0);
          float core = smoothstep(0.1, 0.0, dist);
          vec3 color = mix(vColor, vec3(1.0), core * 0.8);
          gl_FragColor = vec4(color, alpha * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.orbitParticles = new THREE.Points(geo, this.orbitMaterial);
    this.group.add(this.orbitParticles);
  }

  // Efek letupan sparkle saat hati terbentuk
  createSparkles() {
    const count = 100;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 3 + Math.random() * 5;
      velocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      velocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      velocities[i * 3 + 2] = speed * Math.cos(phi);
      sizes[i] = Math.random() * 2 + 1;
      offsets[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));

    this.sparkleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBurst: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute vec3 aVelocity;
        attribute float aSize;
        attribute float aOffset;
        uniform float uTime;
        uniform float uBurst;
        uniform float uPixelRatio;
        varying float vAlpha;
        
        void main() {
          float t = uBurst;
          vec3 pos = aVelocity * t * (0.5 + aOffset * 0.5);
          pos.y -= t * t * 0.5;
          vAlpha = max(0.0, 1.0 - t * 0.5);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * 50.0 * uPixelRatio * (1.0 / -mvPosition.z) * vAlpha;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist);
          alpha = pow(alpha, 1.5);
          vec3 color = mix(vec3(1.0, 0.08, 0.58), vec3(1.0), alpha);
          gl_FragColor = vec4(color, alpha * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.sparkles = new THREE.Points(geo, this.sparkleMaterial);
    this.group.add(this.sparkles);
  }

  update(time) {
    this.starMaterial.uniforms.uTime.value = time;
    this.orbitMaterial.uniforms.uTime.value = time;
    this.sparkleMaterial.uniforms.uTime.value = time;
    this.group.position.y = Math.sin(time * 0.5) * 0.15;
  }

  setOpacity(opacity) {
    this.starMaterial.uniforms.uOpacity.value = opacity;
    this.glowMaterial.opacity = opacity * 0.6;
    this.orbitMaterial.uniforms.uOpacity.value = opacity;
  }

  triggerSparkles() {
    gsap.fromTo(this.sparkleMaterial.uniforms.uBurst,
      { value: 0 },
      {
        value: 2,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
          this.sparkleMaterial.uniforms.uBurst.value = 0;
        }
      }
    );
  }
}

/* ===============================
   HEART CONTROLLER — Interaction
   =============================== */
class HeartController {
  constructor(heartGroup, camera, canvas) {
    this.heart = heartGroup;
    this.camera = camera;
    this.canvas = canvas;

    this.isDragging = false;
    this.prevX = 0;
    this.prevY = 0;
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.currentRotX = 0;
    this.currentRotY = 0;
    this.autoRotate = true;
    this.autoRotateSpeed = 0.003;
    this.enabled = false;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetCamX = 0;
    this.targetCamY = 0;

    this.setupEvents();
  }

  setupEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.onDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      this.onMove(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', () => this.onUp());

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.onDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        e.preventDefault();
        this.onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('touchend', () => this.onUp());

    this.canvas.addEventListener('dblclick', () => {
      this.autoRotate = !this.autoRotate;
    });

    this.canvas.addEventListener('wheel', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      const delta = e.deltaY * 0.002;
      this.camera.position.z = Math.max(8, Math.min(25, this.camera.position.z + delta));
    }, { passive: false });
  }

  onDown(x, y) {
    if (!this.enabled) return;
    this.isDragging = true;
    this.prevX = x;
    this.prevY = y;
    this.autoRotate = false;
  }

  onMove(x, y) {
    if (!this.isDragging || !this.enabled) return;
    const dx = x - this.prevX;
    const dy = y - this.prevY;
    this.prevX = x;
    this.prevY = y;
    this.targetRotY += dx * 0.008;
    this.targetRotX += dy * 0.008;
    this.targetRotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.targetRotX));
  }

  onUp() {
    this.isDragging = false;
  }

  enable() { this.enabled = true; }
  disable() { this.enabled = false; this.isDragging = false; }

  update() {
    if (!this.enabled) return;
    if (this.autoRotate) {
      this.targetRotY += this.autoRotateSpeed;
    }
    this.currentRotX += (this.targetRotX - this.currentRotX) * 0.08;
    this.currentRotY += (this.targetRotY - this.currentRotY) * 0.08;
    this.heart.rotation.x = this.currentRotX;
    this.heart.rotation.y = this.currentRotY;

    this.targetCamX = this.mouseX * 0.5;
    this.targetCamY = this.mouseY * 0.3;
    this.camera.position.x += (this.targetCamX - this.camera.position.x) * 0.03;
    this.camera.position.y += (this.targetCamY - this.camera.position.y) * 0.03;
    this.camera.lookAt(0, 0, 0);
  }
}

/* ===============================
   MEMORY GALLERY
   =============================== */
class MemoryGallery {
  constructor() {
    this.grid = document.getElementById('memories-grid');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImage = document.getElementById('lightbox-image');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.currentIndex = 0;
    this.memories = CONFIG.memories;

    this.render();
    this.setupLightbox();
    this.setupTiltEffect();
  }

  render() {
    this.grid.innerHTML = this.memories.map((mem, i) => `
      <article class="memory-card" data-index="${i}" aria-label="Memory ${i + 1}">
        <div class="memory-card-glow"></div>
        <div class="memory-image-wrapper">
          <img class="memory-image" src="${mem.image}" alt="${mem.title}" loading="lazy">
          <div class="memory-image-overlay"></div>
          <div class="memory-number">Memory #${String(i + 1).padStart(2, '0')}</div>
        </div>
        <div class="memory-caption">
          <div class="memory-date">${mem.date}</div>
          <h3 class="memory-title">${mem.title}</h3>
          <p class="memory-desc">"${mem.text}"</p>
        </div>
      </article>
    `).join('');

    this.grid.querySelectorAll('.memory-card').forEach(card => {
      card.addEventListener('click', () => {
        this.openLightbox(parseInt(card.dataset.index));
      });
    });
  }

  setupTiltEffect() {
    this.grid.querySelectorAll('.memory-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = -y * 12;
        const rotateY = x * 12;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) translateZ(20px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  setupLightbox() {
    document.getElementById('lightbox-close').addEventListener('click', () => this.closeLightbox());
    document.getElementById('lightbox-prev').addEventListener('click', () => this.prevImage());
    document.getElementById('lightbox-next').addEventListener('click', () => this.nextImage());

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevImage();
      if (e.key === 'ArrowRight') this.nextImage();
    });

    let touchStartX = 0;
    this.lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    this.lightbox.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) this.nextImage();
        else this.prevImage();
      }
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightboxImage();
    this.lightbox.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  closeLightbox() {
    this.lightbox.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.memories.length) % this.memories.length;
    this.updateLightboxImage();
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.memories.length;
    this.updateLightboxImage();
  }

  updateLightboxImage() {
    const mem = this.memories[this.currentIndex];
    this.lightboxImage.style.opacity = '0';
    setTimeout(() => {
      this.lightboxImage.src = mem.image;
      this.lightboxImage.alt = mem.title;
      this.lightboxCaption.textContent = `"${mem.text}"`;
      this.lightboxImage.style.opacity = '1';
    }, 200);
  }
}

/* ===============================
   TIMELINE
   =============================== */
class Timeline {
  constructor() {
    this.container = document.getElementById('timeline-container');
    this.progress = document.getElementById('timeline-progress');
    this.items = CONFIG.timeline;

    this.render();
    this.setupScrollProgress();
  }

  render() {
    this.items.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'timeline-item';
      el.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <img class="timeline-image" src="${item.image}" alt="${item.title}" loading="lazy">
          <div class="timeline-text">
            <div class="timeline-year">${item.year}</div>
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-desc">${item.text}</div>
          </div>
        </div>
      `;
      this.container.appendChild(el);
    });
  }

  setupScrollProgress() {
    if (typeof ScrollTrigger === 'undefined') return;
    ScrollTrigger.create({
      trigger: '#timeline',
      start: 'top 60%',
      end: 'bottom 80%',
      onUpdate: (self) => {
        this.progress.style.height = (self.progress * 100) + '%';
      }
    });

    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 75%',
        end: 'bottom 25%',
        onEnter: () => item.classList.add('visible'),
        onLeaveBack: () => item.classList.remove('visible')
      });
    });
  }
}

/* ===============================
   FLOATING HEARTS (CSS particles)
   =============================== */
class FloatingHearts {
  constructor() {
    this.container = document.getElementById('floating-hearts');
    this.symbols = ['❤', '♡', '✦', '✧', '★', '✨', '·'];
    this.isMobile = window.innerWidth < 768;
    this.count = this.isMobile ? 12 : 25;
    this.particles = [];
    this.create();
  }

  create() {
    for (let i = 0; i < this.count; i++) {
      this.spawnParticle();
    }
  }

  spawnParticle() {
    const el = document.createElement('div');
    el.className = 'heart';
    el.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];

    const startX = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 200;
    const duration = 15 + Math.random() * 20;
    const delay = Math.random() * 20;
    const size = 0.6 + Math.random() * 1.2;

    el.style.left = startX + '%';
    el.style.fontSize = size + 'rem';
    el.style.setProperty('--drift', drift + 'px');
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = delay + 's';
    el.style.opacity = '0';

    this.container.appendChild(el);
    this.particles.push(el);

    setTimeout(() => {
      if (el.parentNode) {
        el.remove();
        this.spawnParticle();
      }
    }, (duration + delay) * 1000);
  }
}

/* ===============================
   MUSIC PLAYER
   =============================== */
class MusicPlayer {
  constructor() {
    this.audio = new Audio(CONFIG.music);
    this.audio.loop = true;
    this.audio.volume = 0;
    this.audio.preload = 'auto';

    this.isPlaying = false;
    this.button = document.getElementById('music-button');
    this.icon = document.getElementById('music-icon');
    this.visualizerBars = document.querySelectorAll('.visualizer span');

    this.button.addEventListener('click', () => this.toggle());
    this.setupAudioContext();
    this.animateVisualizer();
  }

  setupAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      this.source = this.audioContext.createMediaElementSource(this.audio);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.useRealVisualizer = true;
    } catch (e) {
      this.useRealVisualizer = false;
    }
  }

  play() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.button.classList.add('playing');
          this.icon.textContent = '🎵';
          gsap.to(this.audio, { volume: 0.5, duration: 1.5 });
        })
        .catch(e => {
          console.warn('Audio playback failed:', e);
          this.isPlaying = true;
          this.button.classList.add('playing');
        });
    }
  }

  pause() {
    gsap.to(this.audio, {
      volume: 0,
      duration: 0.6,
      onComplete: () => {
        this.audio.pause();
        this.isPlaying = false;
        this.button.classList.remove('playing');
        this.icon.textContent = '🎵';
      }
    });
  }

  toggle() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  animateVisualizer() {
    const animate = () => {
      if (this.useRealVisualizer && this.isPlaying && this.analyser) {
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.visualizerBars.forEach((bar, i) => {
          const value = this.frequencyData[i * 3] || 0;
          const height = Math.max(3, (value / 255) * 24);
          bar.style.height = height + 'px';
        });
      } else if (this.isPlaying) {
        this.visualizerBars.forEach((bar) => {
          const height = 4 + Math.random() * 20;
          bar.style.height = height + 'px';
        });
      }
      requestAnimationFrame(animate);
    };
    animate();
  }
}

/* ===============================
   MAIN ORCHESTRATOR
   =============================== */
class ExperienceOrchestrator {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.heart3d = null;
    this.heartController = null;
    this.musicPlayer = null;
    this.gallery = null;
    this.timeline = null;
    this.floatingHearts = null;

    this.clock = new THREE.Clock();
    this.animationStarted = false;

    this.isMobile = window.innerWidth < 768;
    this.particleCount = this.isMobile ? 1500 : 4000;

    this.webglSupported = this.checkWebGLSupport();
  }

  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  init() {
    if (!this.webglSupported) {
      document.getElementById('webgl-fallback').classList.add('active');
      document.getElementById('three-canvas').style.display = 'none';
    } else {
      this.setupThree();
    }

    this.populateContent();
    this.gallery = new MemoryGallery();
    this.timeline = new Timeline();
    this.musicPlayer = new MusicPlayer();
    this.floatingHearts = new FloatingHearts();
    this.setupEvents();
    this.setupScrollAnimations();
    
    if (this.webglSupported) {
      this.animate();
    }

    setTimeout(() => {
      document.getElementById('loading-screen').classList.add('hidden');
    }, 1500);
  }

  setupThree() {
    const canvas = document.getElementById('three-canvas');
    this.canvas = canvas;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050008, 0.02);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 0, 12);

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    const ambient = new THREE.AmbientLight(0x4a0e2e, 0.4);
    this.scene.add(ambient);
    const pinkLight = new THREE.PointLight(0xff1493, 2, 30);
    pinkLight.position.set(3, 2, 5);
    this.scene.add(pinkLight);
    const purpleLight = new THREE.PointLight(0x9d00ff, 1.5, 25);
    purpleLight.position.set(-3, -1, 3);
    this.scene.add(purpleLight);
    const whiteLight = new THREE.DirectionalLight(0xffffff, 0.5);
    whiteLight.position.set(0, 5, 5);
    this.scene.add(whiteLight);

    this.particles = new ParticleSystem(this.scene, this.particleCount);
    this.heart3d = new Heart3D(this.scene);
    this.heartController = new HeartController(this.heart3d.group, this.camera, canvas);
  }

  populateContent() {
    document.getElementById('hero-name').textContent = CONFIG.name;
    document.getElementById('hero-quote').textContent = CONFIG.heroQuote;

    const messageContainer = document.querySelector('.message-container');
    const messageLines = messageContainer.querySelectorAll('.message-line');
    messageLines.forEach((line, i) => {
      if (CONFIG.messages[i]) line.textContent = CONFIG.messages[i];
    });

    const letterEl = document.getElementById('letter-content');
    const greeting = `<p class="letter-greeting">${CONFIG.specialMessage.greeting} ${CONFIG.name},</p>`;
    const linesHtml = CONFIG.specialMessage.lines.map(l => `<p>${l}</p>`).join('');
    const signature = `<p class="letter-signature">${CONFIG.specialMessage.signature}</p>`;
    letterEl.innerHTML = greeting + linesHtml + signature;

    document.getElementById('final-name').textContent = `${CONFIG.name} ❤️`;
    document.getElementById('final-message').textContent = CONFIG.finalMessage;
  }

  setupEvents() {
    document.getElementById('start-btn').addEventListener('click', () => this.startExperience());
    document.getElementById('envelope-trigger').addEventListener('click', () => {
      document.getElementById('envelope').classList.add('open');
    });
    document.getElementById('replay-btn').addEventListener('click', () => this.replayExperience());

    window.addEventListener('resize', () => this.onResize());

    let progress = 0;
    const loaderFill = document.getElementById('loader-fill');
    const loaderInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loaderInterval);
      }
      loaderFill.style.width = progress + '%';
    }, 200);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.musicPlayer && this.musicPlayer.isPlaying) this.audioSuspended = true;
      } else {
        this.audioSuspended = false;
      }
    });
  }

  startExperience() {
    document.getElementById('opening').classList.add('hidden');
    document.body.classList.remove('no-scroll');

    setTimeout(() => {
      document.getElementById('music-button').classList.add('visible');
    }, 800);

    setTimeout(() => {
      this.musicPlayer.play();
    }, 1200);

    if (this.webglSupported) {
      this.runParticleSequence();
    } else {
      this.runFallbackSequence();
    }
  }

  runFallbackSequence() {
    setTimeout(() => {
      document.querySelectorAll('.hero-eyebrow, .hero-title, .hero-name, .hero-quote, .hero-hint, .scroll-indicator').forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transition = 'opacity 1s ease, transform 1s ease';
          el.style.transform = 'translateY(0)';
        }, i * 300);
      });
    }, 1000);
  }

  runParticleSequence() {
    const tl = gsap.timeline();

    tl.to(this.particles.material.uniforms.uSpiral, {
      value: 1,
      duration: 3,
      ease: "power2.inOut",
      delay: 0.5
    });

    tl.to(this.particles.material.uniforms.uProgress, {
      value: 1,
      duration: 3.5,
      ease: "power2.inOut"
    });

    // Animasi bintang-bintang yang menyusun hati
    tl.to(this.heart3d.starMaterial.uniforms.uOpacity, {
      value: 1,
      duration: 1.5,
      ease: "power2.out",
      onStart: () => {
        this.heart3d.triggerSparkles();
      }
    }, "-=1.5");

    // Animasi glow di belakang hati bintang
    tl.to(this.heart3d.glowMaterial, {
      opacity: 0.6,
      duration: 1.5,
      ease: "power2.out"
    }, "<");

    // Animasi partikel mengorbit
    tl.to(this.heart3d.orbitMaterial.uniforms.uOpacity, {
      value: 1,
      duration: 1,
      ease: "power2.out"
    }, "<");

    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=0.5");
    tl.to('.hero-title', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, "-=0.6");
    tl.to('.hero-name', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=0.7");
    tl.to('.hero-quote', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=0.6");
    tl.to('.hero-hint', { opacity: 1, duration: 0.8, ease: 'power3.out' }, "-=0.4");
    tl.to('.scroll-indicator', { opacity: 1, duration: 0.8, ease: 'power3.out' }, "<");

    tl.call(() => {
      this.heartController.enable();
      this.canvas.classList.add('interactive');
      gsap.to(this.particles.material.uniforms.uOrbit, {
        value: 0.3,
        duration: 2,
        ease: 'power2.out'
      });
    });
  }

  setupScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.message-line').forEach((line, i) => {
      gsap.fromTo(line,
        { opacity: 0, y: 50, filter: 'blur(20px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 1.5, ease: 'power3.out',
          scrollTrigger: { trigger: line, start: 'top 75%', end: 'top 40%', toggleActions: 'play none none reverse' }
        }
      );
    });

    document.querySelectorAll('.message-divider').forEach((div) => {
      gsap.fromTo(div,
        { opacity: 0, width: 0 },
        {
          opacity: 1, width: 60, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: div, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      );
    });

    gsap.fromTo('.hero-eyebrow',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#hero', start: 'top top', toggleActions: 'play none none reverse' }
      }
    );

    gsap.from('.section-title', {
      scrollTrigger: { trigger: '#memories', start: 'top 70%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 50, duration: 1, ease: 'power3.out'
    });

    gsap.utils.toArray('.memory-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
        opacity: 0, y: 60, rotation: i % 2 === 0 ? -5 : 5, duration: 0.8, delay: i * 0.1, ease: 'power3.out'
      });
    });

    gsap.from('#timeline .section-title, #timeline .section-subtitle', {
      scrollTrigger: { trigger: '#timeline', start: 'top 70%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 50, duration: 1, stagger: 0.2, ease: 'power3.out'
    });

    gsap.from('#special-message .section-title, #special-message .section-subtitle', {
      scrollTrigger: { trigger: '#special-message', start: 'top 70%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 50, duration: 1, stagger: 0.2, ease: 'power3.out'
    });

    gsap.from('.envelope-container', {
      scrollTrigger: { trigger: '#special-message', start: 'top 60%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 60, scale: 0.9, duration: 1, ease: 'power3.out'
    });

    gsap.from('.final-intro', {
      scrollTrigger: { trigger: '#final', start: 'top 70%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 30, duration: 1, ease: 'power3.out'
    });

    gsap.from('.final-title', {
      scrollTrigger: { trigger: '#final', start: 'top 60%', toggleActions: 'play none none reverse' },
      opacity: 0, scale: 0.8, filter: 'blur(20px)', duration: 1.5, ease: 'power3.out'
    });

    gsap.from('.final-name', {
      scrollTrigger: { trigger: '#final', start: 'top 50%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 40, duration: 1, delay: 0.3, ease: 'power3.out'
    });

    gsap.from('.final-message', {
      scrollTrigger: { trigger: '#final', start: 'top 40%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 20, duration: 1, delay: 0.5, ease: 'power3.out'
    });

    gsap.from('.replay-btn', {
      scrollTrigger: { trigger: '#final', start: 'top 30%', toggleActions: 'play none none reverse' },
      opacity: 0, scale: 0.8, duration: 1, delay: 1, ease: 'back.out(2)'
    });

    ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom 80%',
      onEnter: () => {
        this.canvas.classList.add('faded');
        if (this.heartController) {
          this.heartController.disable();
          this.canvas.classList.remove('interactive');
        }
      },
      onLeaveBack: () => {
        this.canvas.classList.remove('faded');
        if (this.heartController) {
          this.heartController.enable();
          this.canvas.classList.add('interactive');
        }
      }
    });

    ScrollTrigger.create({
      trigger: '#final',
      start: 'top 50%',
      onEnter: () => {
        this.canvas.classList.remove('faded');
        if (this.heartController) {
          this.heartController.enable();
          this.canvas.classList.add('interactive');
        }
      },
      onLeaveBack: () => {
        this.canvas.classList.add('faded');
        if (this.heartController) {
          this.heartController.disable();
          this.canvas.classList.remove('interactive');
        }
      }
    });
  }

  replayExperience() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (this.heart3d) {
      this.heart3d.setOpacity(0);
    }
    if (this.particles) {
      this.particles.setProgress(0);
      this.particles.setSpiral(0);
      this.particles.setOrbit(0);
    }
    if (this.heartController) {
      this.heartController.targetRotX = 0;
      this.heartController.targetRotY = 0;
      this.heartController.autoRotate = true;
      this.heartController.disable();
    }
    if (this.canvas) {
      this.canvas.classList.remove('interactive');
      this.canvas.classList.remove('faded');
    }

    gsap.set('.hero-eyebrow, .hero-title, .hero-name, .hero-quote, .hero-hint, .scroll-indicator', { opacity: 0 });

    setTimeout(() => {
      document.getElementById('opening').classList.remove('hidden');
      document.body.classList.add('no-scroll');
    }, 800);
  }

  onResize() {
    if (!this.webglSupported) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const time = this.clock.getElapsedTime();

    if (this.particles) this.particles.update(time);
    if (this.heart3d) this.heart3d.update(time);
    if (this.heartController) this.heartController.update();
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  }
}

const orchestrator = new ExperienceOrchestrator();

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    orchestrator.init();
  }, 500);
});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--reduce-motion', '1');
}
