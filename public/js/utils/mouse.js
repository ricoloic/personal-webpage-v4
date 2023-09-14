function mousePosition(canvas) {
    const position = { x: 0, y: 0 };
    canvas.addEventListener('mousemove', function (event) {
        const rect = canvas.getBoundingClientRect();
        position.x = event.clientX - rect.left;
        position.y = event.clientY - rect.top;
    });
    return position;
}