function gajaxLib(requestMethod, url, callback) {
    if (!(typeof callback == "function" && callback instanceof Function)) {
        throw new Error("GajaxLib => The third argument providied is not a function")
    }

    let xhr = false;
    
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    } else if (window.XActiveObject) {
        xhr = new XActiveObject("Microsoft.XMLHTTP")  
    } else {
        throw new Error("Browser does not support AJAX")
    }

    if (xhr) {
        xhr.open(requestMethod, url)
        xhr.send(null)

        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
               let dataType = xhr.getResponseHeader("Content-Type")
                    switch (true) {
                        case dataType.includes("json"):
                            let jsonData = JSON.parse(xhr.responseText)
                            callback(jsonData)
                            break
                        case dataType.includes("xml"):
                            callback(xhr.responseXML)
                            break
                        default:
                            callback(xhr.responseText)
                    }
            }
        })
    }
}
