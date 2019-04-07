var ripples = new THREE.Group();
var interval;

var options = new function () {
    this.sizeMax = 20;
    this.damping = 5;
    this.NumPerSec = 20;
}
var rippleGeometry = new THREE.PlaneGeometry(1, 1);
var texture = new THREE.TextureLoader().load("image/ripple.png");

function initRippleGUI() {
    var fr = gui.addFolder('ripple')
    fr.add(options, 'sizeMax', 5, 50).step(1);
    fr.add(options, 'damping', 1, 15).step(1);
    fr.add(options, 'NumPerSec', 5, 50).step(1).onChange(initInterval);
    fr.open();
}

function initRipples() {
    scene.add(ripples);
}

function initInterval() {
    clearInterval(interval);
    interval = setInterval("createRipple()", 1000 / options.NumPerSec);
}

function createRipple() {
    var rippleMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: 1});
    var ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
    ripple.rotateX(-Math.PI/2);
    ripple.position.set(Math.random() * size.boardX - (size.boardX / 2), 0.1, Math.random() * size.boardZ - (size.boardZ / 2));
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

    ripples.children.forEach(function(ripple) {
        ripple.scale.x += 1 / options.damping;
        ripple.scale.y += 1 / options.damping;
        checkRipple(ripple);
        ripple.material.opacity = (1 - ripple.scale.x / options.sizeMax) * (1 - ripple.scale.x / options.sizeMax);
    })

    renderer.render (scene, camera);
}

initRippleGUI();
initRipples();
initInterval();

animate();