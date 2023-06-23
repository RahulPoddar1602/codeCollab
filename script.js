const socket = io();
    document.querySelector("#codeContainer").style.display = "none";
    document.querySelector("#createFolder").style.display = "none";
    document.querySelector("#saveRoom").style.display = "none";
    const btn = document.querySelector("#submit");
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const room = document.querySelector("#RoomName").value;
        document.querySelector("#codeContainer").style.display = "flex";
        document.querySelector("#createFolder").style.display = "block";
        document.querySelector("#saveRoom").style.display = "block";
        document.querySelector(".lobby").style.display = "none";
            document.querySelector("#RoomTitle").innerText = `room : ${room}`;
            console.log(room)
            socket.emit("join-room",room)
        });
    let htmlCode = "";
    let cssCode = "";
    let jsCode = "";
    let output = document.getElementById("output");

    function run() {
        htmlCode = document.getElementById("html-code").value;
        cssCode = document.getElementById("css-code").value;
        jsCode = document.getElementById("js-code").value;
        
        socket.emit("coding", { html: htmlCode, css: cssCode, js: jsCode });
        output.contentDocument.body.innerHTML = htmlCode + "<style>" + cssCode + "</style>";
        output.contentWindow.eval(jsCode);
    }
    socket.on("coding", (e) => {
        htmlCode = e.html;
        cssCode = e.css;
        jsCode = e.js;
        document.getElementById("html-code").value = htmlCode;
        document.getElementById("css-code").value = cssCode;
        document.getElementById("js-code").value = jsCode;
        output.contentDocument.body.innerHTML = htmlCode + "<style>" + cssCode + "</style>";
        output.contentWindow.eval(jsCode);
    });
    function saveRoom(){
        htmlCode = document.getElementById("html-code").value;
        cssCode = document.getElementById("css-code").value;
        jsCode = document.getElementById("js-code").value;
        socket.emit("saveRoom",{
            html:htmlCode,
            css:cssCode,
            js:jsCode,
            room:document.querySelector("#RoomName").value
        })
    }
    function createFolder() {
      const folderName = document.getElementById('RoomTitle').innerText;
      const htmlContent = document.getElementById('html-code').value;
      const cssContent = document.getElementById('css-code').value;
      const jsContent = document.getElementById('js-code').value;

      const htmlContentfile=`
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
        ${htmlContent}
        <script src="script.js"></script>
        </body>
        </html>
      `
      // Create a zip file to hold the folder and files
      const zip = new JSZip();
      const folder = zip.folder(folderName);

      // Add the HTML, CSS, and JS files to the folder
      folder.file('index.html', htmlContentfile);
      folder.file('style.css', cssContent);
      folder.file('script.js', jsContent);

      // Generate the zip file
      zip.generateAsync({ type: 'blob' })
        .then(function (blob) {
          // Create a download link for the zip file
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = folderName + '.zip';
          link.click();
        });
    }