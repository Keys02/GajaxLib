function gajaxLib(url, requestMethod, async, callback) {
    xhr = false;
    
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    } else if (window.XActiveObject) {
        xhr = new XActiveObject("Microsoft.XMLHTTP")
    }

    xhr.get(url, requestMethod, async)
    xhr.send()

    xhr.addEventListener('onreadystatechange', () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
        }
    })
}