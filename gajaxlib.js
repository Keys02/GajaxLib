/**
 * @file - This file provides a utility function which simplifies making AJAX requests 
 * @description - Chooses the form to return to return the data after the request is completed
 */
/**
 * @param {string} requestMethod - The request Method of the asynchronous call
 * @param {string} url - The URL the want to be made to
 * @callback callback - The callback function which take care of what to do with the data received
 * @param {string | string[]} [data] - The data which is sent alongside the request in a POST request scenario and the meta data being asked from the server in terms of HEAD request
 * @return {string | Object} - The data being requested from the server
 */

/**
 * Do something asynchronously and executes the callback on completion
 * @param {callback} data - The data the callback function is going to handle 
 */
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
                                if (data === "all") {
                                    let metaData = {}
                                    metaData["Connection"] = xhr.getResponseHeader("Connection")
                                    metaData["Conent-Length"] = xhr.getResponseHeader("Content-Length")
                                    metaData["Content-Type"] = xhr.getResponseHeader("Content-Type")
                                    metaData["Date"] = xhr.getResponseHeader("Date")
                                    metaData["Host"] = xhr.getResponseHeader("Host")
                                    callback(metaData)
                                }
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
