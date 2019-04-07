var drops = new THREE.Group();
var currentNum = 0;
var dropGeometry;
var dropMaterial;

var options = new function () {
        this.num = 100;
        this.radius = 0.12;
        this.length = 9.5;
        this.velocity = 2.0;
}

function initMesh() {
    dropGeometry = new THREE.CylinderGeometry(options.radius, options.radius, options.length);
    dropMaterial = new THREE.MeshLambertMaterial( {color: 0x6CA6ED} );
}

function initDropGUI(){
    var fd = gui.addFolder('drop');
    fd.add(options, 'num', 10, 500).step(10);
    fd.add(options, 'radius', 0.04, 0.2).step(0.01).onChange(initMesh);
    fd.add(options, 'length', 0.1, 18.0).step(0.1).onChange(initMesh);
    fd.add(options, 'velocity', 0.4, 5.0).step(0.1);
    fd.open();
}

function checkDrop(drop) {
    if (drop.position.y < (options.length / 2)) {
        drops.remove(drop);
        currentNum--;
    }
}

function checkNum() {
    if (currentNum < options.num){
        createDrops(options.num - currentNum);
    }
}

function createDrops(num) {
    //var dropGeometry = new THREE.CylinderGeometry(options.radius, options.radius, options.length);
    //var dropMaterial = new THREE.MeshLambertMaterial( {color: 0x6CA6ED} );
    for(var i = 0; i < num; i++) {
        var drop = new THREE.Mesh( dropGeometry, dropMaterial );
        drop.position.x = Math.random() * size.boardX - (size.boardX / 2);
        drop.position.z = Math.random() * size.boardZ - (size.boardZ / 2);
        drop.position.y = Math.random() * (size.high - options.length * 2) + options.length * 2;
        drops.add(drop);
        currentNum++;
    }
}

function initDrops() {
    createDrops(options.num);
    scene.add(drops);
}

function animate() {
    requestAnimationFrame( animate );
    stats.update();
    checkNum();
    drops.children.forEach(function(drop) {
        drop.position.y -= options.velocity;
        checkDrop(drop);
    })
    renderer.render (scene, camera);
}

initMesh();
initDropGUI();
initDrops();
animate();
