function gajaxLib(requestMethod, url) {
    let xhr = false;
    
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    } else if (window.XActiveObject) {
        xhr = new XActiveObject("Microsoft.XMLHTTP")  
    }
 
    if (xhr) {
        xhr.open(requestMethod, url)
        xhr.send(null)

        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText)
            }
        })
    }
}
