; function getFile(url) {
        ; var xhr = new XMLHttpRequest()
        ; xhr.onreadystatechange = function() {
            ; if (xhr.readyState == 4 && xhr.status == 200) {
                ; document.write(
                    xhr.responseText.replace(/</g, '&lt;').replace(/\n/g, br)
                )
            }
        }
        ; xhr.open("GET", url, true)
        ; xhr.send()
}
; getFile('./git.sh')
