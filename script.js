// Adjusts the width of input fields based on their content

function adjustWidth(input, minWidth) {
    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';
    span.style.whiteSpace = 'pre';
    span.style.font = window.getComputedStyle(input).font;
    span.textContent = input.value || input.placeholder;
    document.body.appendChild(span);
    const width = span.offsetWidth + 10; // add some padding
    document.body.removeChild(span);
    input.style.width = Math.max(minWidth, width) + 'px';
}

// Changes type when a select element is changed

function updateCaptionType(selectElement) {
    const captionDiv = selectElement.closest('.caption');
    if (!captionDiv) return;
    captionDiv.setAttribute('type', selectElement.value);
}

// Applies listeners to inputs and selects within a given root element

function applyListeners(searchRoot) {
    const inputs = searchRoot.querySelectorAll('.caption input[type="text"]');
    inputs.forEach(input => {
        const minWidth = Math.max(input.offsetWidth, 177);
        adjustWidth(input, minWidth);
        input.addEventListener('input', () => adjustWidth(input, minWidth));
    });

    const typeSelects = searchRoot.querySelectorAll('.caption select');
    typeSelects.forEach(select => {
        select.addEventListener('input', () => updateCaptionType(select));
    });
}

// Initally applies listeners

document.addEventListener('DOMContentLoaded', () => applyListeners(document));

// Updates what move buttons are disabled

function refreshMoveButtons() {
    let captions = document.querySelector('#captionContainer').children;
    
    if (captions.length == 0) {
        document.querySelector('#captionContainer').parentElement.style.display = "none";
    } else {
        document.querySelector('#captionContainer').parentElement.style.display = "table";
    }

    for (let caption of captions) {

        if (caption.previousElementSibling) {
            caption.querySelector(".upButton").classList.remove("disabled");
        } else {
            caption.querySelector(".upButton").classList.add("disabled");
        }

        if (caption.nextElementSibling) {
            caption.querySelector(".downButton").classList.remove("disabled");
        } else {
            caption.querySelector(".downButton").classList.add("disabled");
        }
    }
}

// Button presses:

function createCaption(type, values) {
    let template = document.querySelector('.captionTemplate');
    if (!template) return;

    if (!type) {
        let captionTypeSelection = document.querySelector('#newCaptionType');
        if (captionTypeSelection) {
            type = captionTypeSelection.value;
        } else {
            type = 'general';
        }
    }

    let newCaption = template.cloneNode(true);
    newCaption.classList.remove('captionTemplate');
    newCaption.classList.add('caption');

    newCaption.setAttribute('type', type);
    newCaption.querySelector('select').value = type;

    if(values) {
        let inputs = newCaption.querySelectorAll(`.${type}CaptionOptions input`);
        if(inputs) {
            for(i in values) {
                if(inputs[i]) {
                    inputs[i].value = values[i];
                }
            }
        }
    }

    applyListeners(newCaption);
    document.getElementById('captionContainer').appendChild(newCaption);
    refreshMoveButtons();
}

function removeRow(button) {
    let row = button.closest('.caption');
    if (row) {
        if(!confirm(`Click "OK" to confirm the removal of the caption. This cannot be undone!`)) return;
        row.remove();
    }
    refreshMoveButtons();
}

function moveRow(button, direction) {
    let row = button.closest('.caption');
    if (direction=="up" && row && row.previousElementSibling && !row.previousElementSibling.classList.contains('tableHeader')) {
        row.parentNode.insertBefore(row, row.previousElementSibling);
    } else if (direction=="down" && row && row.nextElementSibling) {
        row.parentNode.insertBefore(row.nextElementSibling, row);
    }

    refreshMoveButtons();
}

function deleteAll(overrideConfirmation) {
    if(!overrideConfirmation) { if(prompt('Are you sure you want to delete all captions? This cannot be undone!\n\nType "DELETE" to confirm.').toLowerCase() != "delete") return; }
    let captions = document.querySelector('#captionContainer');
    if (!captions) return;
    captions.innerHTML = "";
    refreshMoveButtons();
}

function loadDefault() {
    const captionContainer = document.querySelector("#captionContainer");

    if(captionContainer.children.length != 0) {
        if(prompt('Are you sure you want to load the default preset? This will clear all current captions and cannot be undone!\n\nType "DEFAULT" to confirm.').toLowerCase() != "default") return;
    }

    const defaultCaptions = [
        { "type": "music", "text": ["Prelude"] },
        { "type": "centered", "text": ["Welcome!", "Feel free to drop a hello in the chat so we may greet you!"] },
        { "type": "centered", "text": ["Call to Worship"] },
        { "type": "hymn", "text": ["Hymn of Praise"] },
        { "type": "centered", "text": ["Prayer of the Day"] },
        { "type": "general", "text": ["The Lesson"] },
        { "type": "general", "text": ["The Gospel"] },
        { "type": "centered", "text": ["Children's Word"] },
        { "type": "general", "text": ["The Message", "Reverend Jim Fu"] },
        { "type": "hymn", "text": ["Hymn of Prayer"] },
        { "type": "centered", "text": ["Prayers of the People"] },
        { "type": "centered", "text": ["Prayer of Confession"] },
        { "type": "centered", "text": ["Assurance of Forgiveness"] },
        { "type": "centered", "text": ["Sharing the Peace of Christ", "Spread Christ's peace online by saying hello in the chat!"] },
        { "type": "music", "text": ["Offertory"] },
        { "type": "hymn", "text": ["Doxology", 95, "Praise God, for Whom All Blessings Flow"] },
        { "type": "general", "text": ["The Great Thanksgiving", "p.XYZ UMH"] },
        { "type": "centered", "text": ["The Lord's Prayer"] },
        { "type": "music", "text": ["Special Music"] },
        { "type": "centered", "text": ["Announcments"] },
        { "type": "hymn", "text": ["Closing Hymn"] },
        { "type": "centered", "text": ["Benediction"] },
        { "type": "music", "text": ["Postlude"] }
    ];

    defaultCaptions.forEach(caption => {
        createCaption(caption.type, caption.text);
    })
}

function generateExportJSON() {
    const captionContainer = document.querySelector("#captionContainer");
    
    if(!captionContainer) return null;
    if(captionContainer.children.length == 0) {
        alert("Cannot download 0 captions! Insert some more captions or load the default ones in order to export them.");
        return null;
    }

    let exportJSON = { "captions": [] };

    for (let caption of captionContainer.children) {
        let captionJSON = { "type": "centered", "text": ["Error Exporting This Caption"] }
        let captionType = caption.getAttribute("type");
        if(!captionType) return exportJSON.captions.push(captionJSON);
        let captionTextInputs = caption.querySelectorAll(`.${captionType}CaptionOptions input`);
        if(!captionTextInputs) return exportJSON.captions.push(captionJSON);

        captionJSON.type = captionType;
        captionJSON.text = [];
        for(let input of captionTextInputs) {
            let text = input.value;
            if(input.getAttribute("type") == "number") text = "#" + text;
            captionJSON.text.push(text);
        }

        exportJSON.captions.push(captionJSON);
    }

    return exportJSON;
}

function obsExport() {
    const exportJSON = generateExportJSON();
    const jsonString = JSON.stringify(exportJSON, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "captions-export-for-obs.json";
    a.click();
  
    URL.revokeObjectURL(url);
}


function powerpointExport() {
    const exportJSON = generateExportJSON();
    if(!exportJSON) return;

    let pptx = new PptxGenJS();
    pptx.title = "Captions Export";
    pptx.layout = "LAYOUT_WIDE";

    pptx.defineSlideMaster({
        title: "centered",
        objects: [
            { placeholder: { options: {name: "field0", type: "head", x: 0.67, y: 0.54, w: 12, h: 3.82, fontFace: "Arial", bold: true, fontSize: 88, align: "center", valign: "bottom"}, text: "Header Placeholder",}, },
            { placeholder: { options: {name: "field1", type: "body", x: 0.67, y: 4.36, w: 12, h: 2.6, fontFace: "Arial", italic: true, fontSize: 48, align: "center", valign: "bottom"}, text: "Subtext Placeholder",}, }
           ],
    });

    pptx.defineSlideMaster({
        title: "general",
        objects: [
            { placeholder: { options: {name: "field0", type: "head", x: 0.67, y: 1.17, w: 10, h: 2.5, fontFace: "Arial", bold: true, fontSize: 88, align: "left", valign: "bottom"}, text: "Header Placeholder",}, },
            { placeholder: { options: {name: "field1", type: "body", x: 2.66, y: 3.38, w: 10, h: 2.5, fontFace: "Arial", italic: true, fontSize: 88, align: "right", valign: "top"}, text: "Subtext Placeholder",}, }
           ],
    });

    pptx.defineSlideMaster({
        title: "hymn",
        objects: [
            { placeholder: { options: {name: "field0", type: "head", x: 0.92, y: 0.45, w: 11.5, h: 1.41, fontFace: "Arial", fontSize: 54, align: "center", valign: "middle"}, text: "Header Placeholder",}, },
            { placeholder: { options: {name: "field1", type: "head", x: 0.92, y: 1.81, w: 11.5, h: 3, bold: true, fontFace: "Arial", fontSize: 167, align: "center", valign: "top"}, text: "#123",}, },
            { text: { text: "United Methodist Hymnal", options: { x: 0.92, y: 4.3, w: 11.5, h: 0.71, fontFace: "Arial", fontSize: 24, align: "center", valign: "top"},}, },
            { placeholder: { options: {name: "field2", type: "body", x: 0.92, y: 4.81, w: 11.5, h: 2.29, fontFace: "Arial", italic: true, fontSize: 54, align: "center", valign: "middle"}, text: "Song Name Placeholder",}, }
           ],
    });

    pptx.defineSlideMaster({
        title: "tfws",
        objects: [
            { placeholder: { options: {name: "field0", type: "head", x: 0.92, y: 0.45, w: 11.5, h: 1.41, fontFace: "Arial", fontSize: 54, align: "center", valign: "middle"}, text: "Header Placeholder",}, },
            { placeholder: { options: {name: "field1", type: "head", x: 0.92, y: 1.81, w: 11.5, h: 3, bold: true, fontFace: "Arial", fontSize: 167, align: "center", valign: "top"}, text: "#123",}, },
            { text: { text: "The Faith We Sing", options: { x: 0.92, y: 4.3, w: 11.5, h: 0.71, fontFace: "Arial", fontSize: 24, align: "center", valign: "top"},}, },
            { placeholder: { options: {name: "field2", type: "body", x: 0.92, y: 4.81, w: 11.5, h: 2.29, fontFace: "Arial", italic: true, fontSize: 54, align: "center", valign: "middle"}, text: "Song Name Placeholder",}, }
           ],
    });

    pptx.defineSlideMaster({
        title: "music",
        objects: [
            { placeholder: { options: {name: "field0", type: "head", x: 0.92, y: 0.45, w: 11.5, h: 1.14, fontFace: "Arial", fontSize: 48, align: "center", valign: "middle"}, text: "Header Placeholder",}, },
            { placeholder: { options: {name: "field1", type: "head", x: 0.92, y: 1.81, w: 11.5, h: 1.9, bold: true, fontFace: "Arial", fontSize: 88, align: "center", valign: "bottom"}, text: "Song Name",}, },
            { placeholder: { options: {name: "field2", type: "body", x: 0.92, y: 3.93, w: 11.5, h: 1.14, fontFace: "Arial", italic: true, fontSize: 54, align: "center", valign: "top"}, text: "John Smith, Organ",}, },
            { placeholder: { options: {name: "field3", type: "body", x: 0.92, y: 5.96, w: 11.5, h: 1.14, fontFace: "Arial", italic: true, fontSize: 40, align: "center", valign: "bottom"}, text: "Arranged By Mozart",}, }
           ],
    });

    pptx.defineSlideMaster({
        title: "lyric",
        objects: [
            { placeholder: { options: {name: "field0", type: "head", x: 0.46, y: 0.5, w: 12.42, h: 6.5, fontFace: "Arial", fontSize: 48, align: "center", valign: "middle", lineSpacing: 86 }, text: "Lyrics Placeholder",}, },
        ],
    });

    for (let caption of exportJSON.captions) {
        let captionSlide = pptx.addSlide({ masterName: caption.type });
        for (let i in caption.text) {
            if(caption.text[i] != "") captionSlide.addText(caption.text[i], { placeholder: "field" + i });
        }
    }

    pptx.writeFile({ fileName: 'powerpoint-export.pptx' });
}