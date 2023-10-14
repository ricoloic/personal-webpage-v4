function parseParamValue(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    const numberV = Number(value);
    if (!isNaN(numberV)) return numberV;
    return value;
}

function prefillConfig(config) {
    const params = new URLSearchParams(window.location.search);

    const configKeys = Object.keys(config);

    for (let key of configKeys) {
        const paramValue = params.get(key);
        if (paramValue) {
            config[key] = parseParamValue(paramValue);
        }
    }
}

function setParamConfig(config) {
    let url = new URL(window.location.href);

    const configKeys = Object.keys(config);

    for (let key of configKeys) {
        let params = new URLSearchParams(url.search);
        params.set(key, config[key].toString());
        url.search = params;
    }

    window.history.replaceState({}, "", url);
}
