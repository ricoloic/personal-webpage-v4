function mousePosition(canvas) {
    const position = { x: 0, y: 0 };

    canvas.addEventListener("mousemove", function (event) {
        const rect = canvas.getBoundingClientRect();
        position.x = event.clientX - rect.left;
        position.y = event.clientY - rect.top;
    });
    canvas.addEventListener("touchmove", function (event) {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        position.x = event.touches[0].pageX - rect.left;
        position.y = event.touches[0].pageY - rect.top;
    });

    return position;
}
