function mySendControlEvent(evType, data, callback) {
    console.log("Sending event", evType, data, callback)
    var message = {
        evType: evType,
    }
    if (data !== undefined) {
        message.data = typeof data === "string" ? data : JSON.stringify(data)
    }
    if (callback !== undefined) {
        message.callback = callback
    }
    jOmnis.sendControlEvent(message)
}

jOmnis.callbackObject = {
    omnisOnLoad: function () {
        console.info(`Omnis interface loaded. `)
    },

    omnisOnWebSocketOpened: function () {
        console.info(`Web socket opened`)
        document.writeln("Socket ready!")
        // From this point in time i can exchange messages with the Omnis
        mySendControlEvent("ev_Ready")
    },

    omnisSetData: function (params) {
        console.log("omnisSetData", params)
    },

    omnisGetData: function (params) {
        console.log("omnisGetData", params)
    },

    renderQRCode: function (params) {
        document.writeln("Rendering...")
        console.log("render_QRCode", params)
        QRCode.toDataURL(params.text, { width: 256, margin: 0 })
            .then((url) => {
                console.log(`render_QRCode - DataURL: ${url.length}`)
                const imageElement = document.createElement("img")
                imageElement.src = url
                document.body.append(imageElement)
                mySendControlEvent("ev_QRCodeReady", {
                    qrcode: url,
                })
            })
            .catch((err) => {
                console.error(err)
                mySendControlEvent("ev_Error")
            })
    },
}
