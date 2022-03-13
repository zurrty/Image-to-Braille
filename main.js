const settings = {
    last_canvas: null,
    last_dithering: null,
    last_source: "",

    width: 62,
    greyscale_mode: "luminance",
    dark: true,
    inverted: false,
    dithering: false,
    monospace: false,
}

function copyText() {
    navigator.clipboard.writeText(document.querySelector("#text").value).then(
        // copy success
        function () {
            let clip_notify = document.querySelector("#clipboard-notify")
            clip_notify.innerText = "Copied!"
            clip_notify.className = "green"
            setTimeout(() => {
                clip_notify.innerText = null
                clip_notify.className = null
            }, 1500)
        },
        // copy failed
        function () {
            let clip_notify = document.querySelector("#clipboard-notify")
            clip_notify.innerText = "Failed to copy."
            clip_notify.className = "red"
            setTimeout(() => {
                clip_notify.innerText = null
                clip_notify.className = null
            }, 1500)
        }
    )
}

function setUIElement(selector, value) {
    const elem = document.querySelector(selector)
    switch (
        elem.getAttribute("type") //should all be <input>
    ) {
        case "checkbox":
            elem.checked = value
            break

        default:
            elem.value = value
    }
    return elem
}

function initUI() {
    document.body.ondragover = (e) => e.preventDefault()
    document.body.ondrop = (e) => {
        e.preventDefault()
        loadNewImage(URL.createObjectURL(e.dataTransfer.items[0].getAsFile()))
    }
    document.body.onpaste = (e) => {
        e.preventDefault()
        loadNewImage(URL.createObjectURL(e.clipboardData.items[0].getAsFile()))
    }
    document.body.onkeydown = (e) => {
        if (e.ctrlKey && e.key == "a") {
            e.preventDefault()
            document.querySelector("#text").select()
        } else if (e.ctrlKey && e.key == "c") {
            e.preventDefault()
            copyText()
        }
    }

    //buttons
    const refresh = () => parseCanvas(settings.last_canvas) //shorten for compactness

    document.querySelector('input[type="file"]').onchange = (e) => {
        loadNewImage(URL.createObjectURL(e.target.files[0]))
    }

    setUIElement("#darktheme", settings.dark).onchange = (e) => {
        const element = document.querySelector("#text")
        if (e.target.checked) element.classList.add("dark")
        else element.classList.remove("dark")
    }

    setUIElement("#inverted", settings.inverted).onchange = (e) => {
        settings.inverted = e.target.checked
        refresh()
    }
    setUIElement("#dithering", settings.dithering).onchange = (e) => {
        settings.dithering = e.target.checked
        refresh()
    }
    setUIElement("#monospace", settings.monospace).onchange = (e) => {
        settings.monospace = e.target.checked
        refresh()
    }

    document.querySelector("#greyscale_mode").onchange = (e) => {
        settings.greyscale_mode = e.target.value
        parseCanvas(settings.last_canvas)
    }

    setUIElement("#width", settings.width).onchange = (e) => {
        settings.width = e.target.value
        loadNewImage(settings.last_source)
    }

    document.querySelector("#clipboard").onclick = (e) => {
        copyText()
    }
}

async function loadNewImage(src) {
    if (src === undefined) return

    if (settings.last_source && settings.last_source !== src)
        URL.revokeObjectURL(settings.last_source)
    settings.last_source = src
    const canvas = await createImageCanvas(src)
    settings.last_canvas = canvas
    settings.last_dithering = null
    await parseCanvas(canvas)
}

async function parseCanvas(canvas) {
    const text = canvasToText(canvas)
    document.querySelector("#text").value = text
    document.querySelector("#charcount").innerText = text.length
}

window.onload = () => {
    initUI()
    loadNewImage("https://github.com/zurrty/Image-to-Braille/blob/master/select.png?raw=true")
}
