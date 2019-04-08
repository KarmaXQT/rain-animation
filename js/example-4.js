var drops = new THREE.Group();
var ripples = new THREE.Group();
var dropSet = new Set();
var rippleSet = new Set();
var dropGeometry;
var dropMaterial;
var interval;

var rippleGeometry = new THREE.PlaneGeometry(1, 1);
var texture = new THREE.TextureLoader().load("image/ripple.png");

var options = new function () {
    this.radius = 0.12;
    this.velocityAve = 2;
    this.velocityDelta = 0.6;
    this.acceleration = 0.06;
    this.NumPerSec = 80;
    this.damping = 5;
}


function dropElement() {
    this.radius = options.radius;
    this.velocity = 0;
    this.velocityMax = null;
    this.acceleration = options.acceleration;
    this.drop = new THREE.Mesh(dropGeometry, dropMaterial);
}

function rippleElement() {
    this.sizeMax = null;
    var rippleMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: 1});
    this.ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
}

function initDropGUI(){
    var fd = gui.addFolder('drop');
    var fr = gui.addFolder('ripple');
    fd.add(options, 'radius', 0.04, 0.2).step(0.01).onChange(initDropMesh);
    fd.add(options, 'velocityAve', 0.4, 5).step(0.1);
    fd.add(options, 'velocityDelta', 0.1, 2).step(0.1);
    fd.add(options, 'acceleration', 0.01, 0.2).step(0.01);
    fd.add(options, 'NumPerSec', 10, 200).step(1).onChange(initInterval);
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
    var drop = new dropElement();
    drop.velocityMax = getVelocity();
    drop.drop.scale.y = drop.velocity * 4;
    drop.drop.position.x = Math.random() * size.boardX - (size.boardX / 2);
    drop.drop.position.z = Math.random() * size.boardZ - (size.boardZ / 2);
    drop.drop.position.y = size.high;
    drops.add(drop.drop);
    dropSet.add(drop);
}

function checkDrop(drop) {
    if (drop.drop.position.y < (drop.drop.scale.y / 2)) {
        createRipple(drop.drop.position.x, drop.drop.position.z, options.radius, drop.velocity);
        drops.remove(drop.drop);
        dropSet.delete(drop);
    }
}

function createRipple(x, z, r, v) {
    var ripple = new rippleElement();
    ripple.sizeMax = Math.log(r * v + 1) * 50;
    ripple.ripple.rotation.x = - Math.PI / 2;
    ripple.ripple.position.set(x, 0.1, z);
    ripple.ripple.scale.x = 0;
    ripple.ripple.scale.y = 0;
    ripples.add(ripple.ripple);
    rippleSet.add(ripple);
}

function checkRipple(ripple) {
    if (ripple.ripple.scale.x > ripple.sizeMax) {
        ripples.remove(ripple.ripple);
        rippleSet.delete(ripple);
    }
    else if (((ripple.ripple.scale.x / 2) > (ripple.ripple.position.x + size.boardX)) || ((ripple.ripple.scale.x / 2) > (size.boardX - ripple.ripple.position.x))) {
        ripples.remove(ripple.ripple);
        rippleSet.delete(ripple);
    }
    else if (((ripple.ripple.scale.y / 2) > (ripple.ripple.position.z + size.boardZ)) || ((ripple.ripple.scale.y / 2) > (size.boardZ - ripple.ripple.position.z))) {
        ripples.remove(ripple.ripple);
        rippleSet.delete(ripple);
    }
}

function animate() {
    requestAnimationFrame( animate );
    stats.update();

    dropSet.forEach(function(drop, same, dropSet) {
        if (drop.velocity < drop.velocityMax) {
            drop.velocity += drop.acceleration;
            drop.drop.scale.y = drop.velocity * 4;
        }
        drop.drop.position.y -= drop.velocity;
        checkDrop(drop);
    })

    rippleSet.forEach(function (ripple, same, rippleSet) {
        ripple.ripple.scale.x += 1 / options.damping;
        ripple.ripple.scale.y += 1 / options.damping;
        checkRipple(ripple);
        ripple.ripple.material.opacity = (1 - ripple.ripple.scale.x / ripple.sizeMax) * (1 - ripple.ripple.scale.x / ripple.sizeMax);
    })

    renderer.render (scene, camera);
}

initDropMesh();
initDrops();
initRipples();
initDropGUI();
initInterval();
animate();
