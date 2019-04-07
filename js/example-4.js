var drops = new THREE.Group();
var ripples = new THREE.Group();
var set = new Set();
var dropGeometry;
var dropMaterial;
var interval;

var options = new function () {
    this.radius = 0.12;
    this.velocityAve = 2;
    this.velocityDelta = 0.6;
    this.acceleration = 0.06;
    this.NumPerSec = 80;
    this.sizeMax = 20;
    this.damping = 5;
}

var rippleGeometry = new THREE.PlaneGeometry(1, 1);
var texture = new THREE.TextureLoader().load("image/ripple.png");

function raindrop() {
    this.radius = options.radius;
    this.velocity = 0;
    this.velocityMax = null;
    this.acceleration = options.acceleration;
    this.drop = new THREE.Mesh(dropGeometry, dropMaterial);
}

function initDropGUI(){
    var fd = gui.addFolder('drop');
    var fr = gui.addFolder('ripple');
    fd.add(options, 'radius', 0.04, 0.2).step(0.01).onChange(initDropMesh);
    fd.add(options, 'velocityAve', 0.4, 5).step(0.1);
    fd.add(options, 'velocityDelta', 0.1, 2).step(0.1);
    fd.add(options, 'acceleration', 0.01, 0.2).step(0.01);
    fd.add(options, 'NumPerSec', 10, 200).step(1).onChange(initInterval);
    fr.add(options, 'sizeMax', 5, 50).step(1);
    fr.add(options, 'damping', 1, 15).step(1);
    fd.open();
    fr.open();
}

function initDropMesh() {
    dropGeometry = new THREE.CylinderGeometry(options.radius, options.radius, 1);
    dropMaterial = new THREE.MeshLambertMaterial( {color: 0x6CA6ED} );
}

function initDrops() {
    scene.add(drops);
}

function initRipples() {
    scene.add(ripples);
}

function initInterval() {
    clearInterval(interval);
    interval = setInterval("creatDrop()", 1000 / options.NumPerSec);
}

function getVelocity() {
    return options.velocityAve + options.velocityDelta * (Math.random() * 2 - 1);
}

function creatDrop() {
    var drop = new raindrop();
    drop.velocityMax = getVelocity();
    drop.drop.scale.y = drop.velocity * 4;
    drop.drop.position.x = Math.random() * size.boardX - (size.boardX / 2);
    drop.drop.position.z = Math.random() * size.boardZ - (size.boardZ / 2);
    drop.drop.position.y = size.high;
    drops.add(drop.drop);
    set.add(drop);
}

function checkDrop(drop) {
    if (drop.drop.position.y < (drop.drop.scale.y / 2)) {
        createRipple(drop.drop.position.x, drop.drop.position.z);
        drops.remove(drop.drop);
        set.delete(drop);
    }
}

function createRipple(x, z) {
    var rippleMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: 1});
    var ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
    ripple.rotateX(-Math.PI/2);
    ripple.position.set(x, 0.1, z);
    ripple.scale.x = 0;
    ripple.scale.y = 0;
    ripples.add(ripple);
}

function checkRipple(ripple) {
    if (ripple.scale.x > options.sizeMax) {
        ripples.remove(ripple);
    }
    else if ((ripple.scale.x > (ripple.position.x * 2 + size.boardX)) || (ripple.scale.x > (size.boardX - ripple.position.x * 2))) {
        ripples.remove(ripple);
    }
    else if ((ripple.scale.y > (ripple.position.z * 2 + size.boardZ)) || (ripple.scale.y > (size.boardZ - ripple.position.z * 2))) {
        ripples.remove(ripple);
    }
}

function animate() {
    requestAnimationFrame( animate );
    stats.update();

    set.forEach(function(drop, samedrop, set) {
        if (drop.velocity < drop.velocityMax) {
            drop.velocity += drop.acceleration;
            drop.drop.scale.y = drop.velocity * 4;
        }
        drop.drop.position.y -= drop.velocity;
        checkDrop(drop);
    })

    ripples.children.forEach(function(ripple) {
        ripple.scale.x += 1 / options.damping;
        ripple.scale.y += 1 / options.damping;
        checkRipple(ripple);
        ripple.material.opacity = (1 - ripple.scale.x / options.sizeMax) * (1 - ripple.scale.x / options.sizeMax);
    })

    renderer.render (scene, camera);
}

initDropMesh();
initDrops();
initRipples();
initDropGUI();
initInterval();
animate();
