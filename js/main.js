var light1;
var light2;
var ground;
var stats;
var gui = new dat.GUI();
var renderer = new THREE.WebGLRenderer({ antialias: true });
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

var size = new function () {
  this.boardX = 150;
  this.boardZ = 150;
  this.high = 100;
}

function initStats() {
  stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0px";
  stats.domElement.style.top = "0px";
  stats.domElement.style.zIndex = 100;
  document.body.appendChild(stats.domElement);
}

function initSceneGUI() {
  var fg = gui.addFolder('ground');
  fg.add(size, 'boardX', 50, 300).step(10).onChange(resize);
  fg.add(size, 'boardZ', 50, 300).step(10).onChange(resize);
  fg.add(size, 'high', 20, 200).step(10).onChange(resize);
}

function initRenderer() {
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x202020 );
  document.getElementById("Container").appendChild( renderer.domElement );
}

function initCamera() {
  camera.position.set(0,(size.high / 4),(size.boardZ / 2));
  camera.lookAt(new THREE.Vector3(0,(size.high / 4),0));
}

function initLight() {
  light1 = new THREE.AmbientLight( 0x404040, 3 ); // soft white light
  scene.add(light1);

  light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.castShadow = false;
  light2.position.set(- size.boardX / 2, size.high, - size.boardZ / 2);
  scene.add(light2);
}

function initGround() {
  var groundGeometry = new THREE.PlaneGeometry(size.boardX, size.boardZ);
  var groundMaterial = new THREE.MeshPhongMaterial({color: 0x333333});
  ground = new THREE.Mesh(groundGeometry,groundMaterial);
  ground.rotateX(-Math.PI/2);
  ground.position.set(0,0,0);
  scene.add(ground);
}

function initControls() {
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', function() { renderer.render(scene, camera); } );
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = (Math.PI / 2) - 0.001;
}

function resize() {
  scene.remove(light1);
  scene.remove(light2);
  scene.remove(ground);
  initLight();
  initGround();
}

initStats();
initSceneGUI();
initRenderer();
initCamera();
initLight();
initGround();
initControls();