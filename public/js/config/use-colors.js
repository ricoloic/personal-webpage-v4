function useColors(config) {
    const eColorPill = document.getElementById("color-pill");
    const eColorButtons = document.querySelectorAll(
        'button[data-name="color-button"]'
    );

    eColorPill.setAttribute("style", `background-color: ${config.color};`);
    const pColor = hexToRgb(config.color);
    for (const elem of eColorButtons) {
        elem.addEventListener("click", function () {
            config.color = elem.getAttribute("data-color");
            eColorPill.setAttribute(
                "style",
                `background-color: ${config.color};`
            );
            const tempPColor = hexToRgb(config.color);
            pColor.r = tempPColor.r;
            pColor.g = tempPColor.g;
            pColor.b = tempPColor.b;
            setParamConfig(config);
        });
    }

    return pColor;
}
