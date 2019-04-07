function animate() {
    requestAnimationFrame( animate );
    stats.update();

    renderer.render (scene, camera);
}

animate();