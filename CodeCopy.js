javascript:(function() {
    let selectionMode = false;
    let currentElement = null;

    async function copyToClipboard(str) {
        try {
            await navigator.clipboard.writeText(str);
            alert(`Copied successfully: ${str}`);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    function beautifyHtml(html) {
        let formatted = '';
        let reg = /(>)(<)(\/*)/g;
        html = html.replace(reg, '$1\r\n$2$3');
        let pad = 0;
        html.split('\r\n').forEach(function(node) {
            let indent = 0;
            if (node.match(/^<\/\w/)) {
                pad -= 1;
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            }
            pad = Math.max(pad, 0);
            let padding = '';
            for (let i = 0; i < pad; i++) {
                padding += '    ';
            }
            formatted += padding + node + '\r\n';
            pad += indent;
        });
        return formatted.trim();
    }

    function removeOutlineStyle(html, element) {
        let tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        tempElement.querySelector('*').style.outline = '';
        return tempElement.innerHTML;
    }

    function toggleSelectionMode() {
        if (!selectionMode) {
            document.addEventListener('mouseover', mouseoverHandler, false);
            document.addEventListener('click', clickHandler, true);

        } else {
            document.removeEventListener('mouseover', mouseoverHandler, false);
            document.removeEventListener('click', clickHandler, true);
            if (currentElement) {
                currentElement.style.outline = '';
                currentElement = null;
            }

        }
        selectionMode = !selectionMode;
    }

    function mouseoverHandler(e) {
        if (currentElement) {
            currentElement.style.outline = '';
        }
        currentElement = e.target;
        currentElement.style.outline = '2px solid red';
        e.preventDefault();
    }

    function clickHandler(e) {
        if (currentElement) {
            e.preventDefault();
            e.stopPropagation();
            let html = beautifyHtml(currentElement.outerHTML);
            html = removeOutlineStyle(html, currentElement);
            copyToClipboard(html);
            currentElement.style.outline = '2px solid green';
            setTimeout(function() {
                currentElement.style.outline = '';
            }, 500);
            toggleSelectionMode();
        }
    }

    toggleSelectionMode();
    
})();
