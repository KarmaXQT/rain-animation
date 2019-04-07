var drops = new THREE.Group();
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
}

function raindrop() {
    this.radius = options.radius;
    this.velocity = 0;
    this.velocityMax = null;
    this.acceleration = options.acceleration;
    this.drop = new THREE.Mesh(dropGeometry, dropMaterial);
}

function initDropGUI(){
    var fd = gui.addFolder('drop');
    fd.add(options, 'radius', 0.04, 0.2).step(0.01).onChange(initMesh);
    fd.add(options, 'velocityAve', 0.4, 5).step(0.1);
    fd.add(options, 'velocityDelta', 0.1, 2).step(0.1);
    fd.add(options, 'acceleration', 0.01, 0.2).step(0.01);
    fd.add(options, 'NumPerSec', 10, 200).step(1).onChange(initInterval);
    fd.open();
}

function initMesh() {
    dropGeometry = new THREE.CylinderGeometry(options.radius, options.radius, 1);
    dropMaterial = new THREE.MeshLambertMaterial( {color: 0x6CA6ED} );
}

function initDrops() {
    scene.add(drops);
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
        drops.remove(drop.drop);
        set.delete(drop);
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

    renderer.render (scene, camera);
}

initMesh();
initDrops();
initDropGUI();
initInterval();
animate();
