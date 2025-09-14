function gajaxLib(requestMethod="GET", url, data = null, callback) {
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
        if (requestMethod === "POST") {
            if (data !== null && typeof data === "object" && data.constructor === Object) {
                let encodedUrl = encodeURI(url)
                xhr.open(requestMethod, encodedUrl, true)
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
                let dataSent = ""
                for (let x in data) {
                   dataSent += `${x}=${data[x]}&`
                }
                dataSent = dataSent.slice(0,-1) //Remove the last '&' character
                xhr.send(dataSent)
            }
        } else {
            xhr.open(requestMethod, url, true)
            xhr.send(null)
        }

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
