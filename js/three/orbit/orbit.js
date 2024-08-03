let mesh, renderer, scene, camera;

let lightProbe;
let directionalLight;

// linear color space
const API = {
  lightProbeIntensity: 1.0,
  directionalLightIntensity: 0.6,
  envMapIntensity: 1
};

init();

function init() {

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // tone mapping
  renderer.toneMapping = THREE.NoToneMapping;


  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 30);

  // controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  controls.minDistance = 10;
  controls.maxDistance = 50;
  controls.enablePan = false;

  // probe
  lightProbe = new THREE.LightProbe();
  scene.add(lightProbe);

  // light
  directionalLight = new THREE.DirectionalLight(0xffffff, API.directionalLightIntensity);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  // envmap
  const genCubeUrls = function (prefix, postfix) {

    return [
      prefix + 'px' + postfix, prefix + 'nx' + postfix,
      prefix + 'py' + postfix, prefix + 'ny' + postfix,
      prefix + 'pz' + postfix, prefix + 'nz' + postfix
    ];

  };

  const urls = genCubeUrls('images/background_images/', '.jpg');

  new THREE.CubeTextureLoader().setCrossOrigin(null).load(urls, function (cubeTexture) {

    scene.background = cubeTexture;

    lightProbe.copy(LightProbeGenerator.fromCubeTexture(cubeTexture));

    const geometry = new THREE.SphereGeometry(5, 64, 32);
    //const geometry = new THREE.TorusKnotGeometry( 4, 1.5, 256, 32, 2, 3 );

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      envMap: cubeTexture,
      envMapIntensity: API.envMapIntensity,
      map: new THREE.TextureLoader().load('images/patrickhead.jpg'),
    });

    // mesh
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    render();

  });

  // listener
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  render();
}

function render() {
  renderer.render(scene, camera);
}
