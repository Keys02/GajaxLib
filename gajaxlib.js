function gajaxLib(requestMethod="GET", url, callback, data = null,) {
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
                            callback(JSON.parse(xhr.responseText))
                            break
                        case dataType.includes("xml"):
                            callback(xhr.responseXML)
                            break
                        case requestMethod === "HEAD":
                            if (typeof data == "string") {
                                if (data === "all") callback(xhr.getAllResponseHeaders())
                                else if (data === "date") callback(xhr.getResponseHeader("date"))
                                else if (data === "Content-Type") callback(xhr.getResponseHeader("Content-Type"))
                                else if (data === "Content-Length") callback(xhr.getResponseHeader("Content-Length"))
                                else if (data === "Host") callback(xhr.getResponseHeader("Host"))
                                else callback(xhr.getResponseHeader("Connection"))
                            } else if(data instanceof Array && data.constructor === Array) {
                                let metaData = {} 
                                data.forEach((fetchedData) => {
                                    metaData[fetchedData] = xhr.getResponseHeader(fetchedData)
                                })
                                callback(metaData)
                            }
                            break
                        default:
                            callback(xhr.responseText)
                    }
            }
        })
    }
}
