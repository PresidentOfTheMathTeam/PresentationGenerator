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
        if (select.classList.contains("book-select")) return;
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

// Row Interactions

function removeRow(button) {
    let row = button.closest('.caption');
    if (row) {
        if (!confirm(`Click "OK" to confirm the removal of the caption. This cannot be undone!`)) return;
        row.remove();
    }
    refreshMoveButtons();
}

function moveRow(button, direction) {
    let row = button.closest('.caption');
    if (direction == "up" && row && row.previousElementSibling && !row.previousElementSibling.classList.contains('tableHeader')) {
        row.parentNode.insertBefore(row, row.previousElementSibling);
    } else if (direction == "down" && row && row.nextElementSibling) {
        row.parentNode.insertBefore(row.nextElementSibling, row);
    }

    refreshMoveButtons();
}

function loadLyrics(button) {
    let bookSelection = button.parentElement.getElementsByTagName("select")[0].value;
    let hymnNumber = button.parentElement.getElementsByTagName("input")[0].value;
    let textarea = button.parentElement.parentElement.querySelector("textarea");
    let library = hymnalLookup;
    if (bookSelection == "tfws") library = tfwsLookup;

    let hymnJSON = library[hymnNumber];

    if (!hymnJSON) return alert("Hymn Not Found in Library");

    if (!hymnJSON.lyrics) return alert("Hymn Found, but Lyrics Unavaliable.\n\nTry searching on Google for the lyrics, then email them to me (jademathi@outlook.com) so I can add it to the library!");

    if (textarea.value.length > 0) {
        if (!confirm("This will erase all lyrics currently inputted. Confirm?")) return;
    }

    let lyricsByLine = hymnJSON.lyrics.trim().split("\n");

    let linesSinceNewSlide = 1;

    for (let lineNum in lyricsByLine) {
        let line = lyricsByLine[lineNum];

        if (lineNum == 0) continue;

        if (/^\d/.test(line)) {
            line = "[NEWSLIDE]\n" + line;
            linesSinceNewSlide = 1;
        } else if (linesSinceNewSlide > 4) {
            line = "[NEWSLIDE]\n" + line;
            linesSinceNewSlide = 1;
        }

        lyricsByLine[lineNum] = line;
        linesSinceNewSlide++;
    }

    let processedLyrics = lyricsByLine.join("\n")

    textarea.value = processedLyrics;
}

async function loadVerse(button) {
    let verseLookup = button.parentElement.getElementsByTagName("input")[0].value;
    let textarea = button.parentElement.parentElement.querySelector("textarea");

    if (textarea.value.length > 0) {
        if (!confirm("This will erase all lyrics currently inputted. Confirm?")) return;
    }

    let res = await fetch(`https://bible-api.com/${verseLookup.toLowerCase()}`);
    if (!res.ok) return alert("Response Failed - Error code " + res.status + "\n\n(Error code 404 typically means the verse was inputted wrong)");
    let bibleJSON = await res.json();

    let verses = [];

    for (let verse of bibleJSON.verses) {
        verse = verse.text.replaceAll("\n\n\n", "\n").replaceAll("\n\n", "\n").trim();
        verses.push(verse);
    }

    let processedVerses = verses.join("\n[NEWSLIDE]\n").trim();

    textarea.value = processedVerses;
}

// Bottom Interactions

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
    newCaption.querySelector('.caption-type-select').value = type;

    if (values) {
        let inputs = newCaption.querySelectorAll(`.${type}CaptionOptions input[type="text"]`);
        if (inputs) {
            for (i in values) {
                if (inputs[i]) {
                    inputs[i].value = values[i];
                }
            }
        }
    }

    applyListeners(newCaption);
    document.getElementById('captionContainer').appendChild(newCaption);
    refreshMoveButtons();
}

function deleteAll(overrideConfirmation) {
    if (!overrideConfirmation) { if (prompt('Are you sure you want to delete all captions? This cannot be undone!\n\nType "DELETE" to confirm.').toLowerCase() != "delete") return; }
    let captions = document.querySelector('#captionContainer');
    if (!captions) return;
    captions.innerHTML = "";
    refreshMoveButtons();
}

function loadDefault() {
    const captionContainer = document.querySelector("#captionContainer");

    if (captionContainer.children.length != 0) {
        if (prompt('Are you sure you want to load the default preset? This will clear all current captions and cannot be undone!\n\nType "DEFAULT" to confirm.').toLowerCase() != "default") return;
    }

    const defaultCaptions = [
        { "type": "titlecard" },
        { "type": "music", "text": ["Prelude"] },
        { "type": "centered", "text": ["Welcome!", "For those online, feel free to drop a hello in the chat so we may greet you!"] },
        { "type": "centered", "text": ["Call to Worship"] },
        { "type": "bodytext", "text": ["C2W Text"] },
        { "type": "hymn", "text": ["Hymn of Praise"] },
        { "type": "centered", "text": ["Prayer of the Day"] },
        { "type": "bodytext", "text": ["POTD Text"] },
        { "type": "bibleverse", "text": ["The Lesson"] },
        { "type": "bibleverse", "text": ["The Gospel"] },
        { "type": "centered", "text": ["Children's Word"] },
        { "type": "centered", "text": ["The Message", "Reverend Jim Fu"] },
        { "type": "hymn", "text": ["Hymn of Prayer"] },
        { "type": "centered", "text": ["Prayers of the People"] },
        { "type": "centered", "text": ["Prayer of Confession"] },
        { "type": "centered", "text": ["Assurance of Forgiveness"] },
        { "type": "centered", "text": ["Sharing the Peace of Christ", "Spread Christ's peace online by saying hello in the chat!"] },
        { "type": "centered", "text": ["Offering Prayer"] },
        { "type": "bodytext", "text": ["Offering Prayer Text"] },
        { "type": "music", "text": ["Offertory"] },
        { "type": "doxology" },
        { "type": "communion" },
        { "type": "lordsprayer" },
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

// Exporting

function generateExportJSON() {
    const captionContainer = document.querySelector("#captionContainer");

    if (!captionContainer) return null;
    if (captionContainer.children.length == 0) {
        alert("Cannot download 0 captions! Insert some more captions or load the default ones in order to export them.");
        return null;
    }

    let exportJSON = { "captions": [] };

    for (let caption of captionContainer.children) {
        let captionJSON = { "type": "centered", "text": ["Error Exporting This Caption"] }
        let captionType = caption.getAttribute("type");
        let captionTextInputs = caption.querySelectorAll(`.${captionType}CaptionOptions input`);

        captionJSON.type = captionType;
        captionJSON.text = [];
        for (let input of captionTextInputs) {
            let text = input.value;
            if (input.getAttribute("type") == "number") text = "#" + text;
            captionJSON.text.push(text);
        }

        if (captionType == "music" || captionType == "bodytext" || captionType == "bibleverse" || captionType == "hymn") {
            captionJSON.extraSlides = caption.querySelector(`.${captionType}CaptionOptions textarea`).value;
        }

        if (captionType == "titlecard") {
            let inputDate = new Date(caption.querySelector("input[type='date']").value);
            let monthString = inputDate.toLocaleString('default', { month: 'long' });
            let day = inputDate.getDate();
            let year = inputDate.getFullYear();
            captionJSON.dateString = `${monthString} ${day}, ${year}`;
        }

        exportJSON.captions.push(captionJSON);
    }

    return exportJSON;
}

// splits the body slides string into individual slides
function createSlideArray(extraSlidesString) {

    let lines = extraSlidesString.trim().split("\n");

    let slideArray = [];

    // if its a body text, get all the slides individually

    let slideText = "";


    for (let lineNum in lines) {
        let line = lines[lineNum].trim();
        if (lineNum > 0 && slideText != "" && line.toUpperCase().includes("[NEWSLIDE]")) { // if it needs to create the new slide

            slideText = slideText.trim();

            let newSlideText = "";
            if (line != "[NEWSLIDE]") {                              // Handles if there are more characters than just NEWSLIDE on the line
                let lineArray = line.split("[NEWSLIDE]");
                if (lineArray.length == 1) {                   // If there is only one additional string
                    if (line.startsWith("[NEWSLIDE]")) {
                        newSlideText = lineArray[0];
                    } else {
                        slideText = slideText + "\n" + lineArray[0];
                    }
                } else {                                    // There is something both before & after [NEWSLIDE]
                    slideText = slideText + "\n" + lineArray[0];
                    lineArray.splice(0, 1); // Removes first part
                    newSlideText = lineArray.join("\n");
                }
            }

            // Handles ** formatting
            let formattingArray = slideText.trim().split("**");
            let slideTextArray = [];

            for (let chunkNum in formattingArray) {
                let chunkText = formattingArray[chunkNum];
                if (chunkNum % 2 == 0) { // String should not be formatted
                    slideTextArray.push({ text: chunkText });
                } else { // Bold & Underline String
                    slideTextArray.push({ text: chunkText, options: { underline: true, italic: true } });
                }
            }

            if (slideTextArray[slideTextArray.length - 1].text == "") slideTextArray.pop();

            if (slideTextArray[0].text == "") slideTextArray.splice(0, 1); // Removes empty first line causing "repair" errors

            slideArray.push(slideTextArray);

            slideText = newSlideText;
        } else {
            slideText += "\n" + line;
        }
    }

    if (slideText != "") { // If there is still more text needed to be added to a slide
        slideText = slideText.trim();

        // Handles ** formatting
        let formattingArray = slideText.split("**");
        let slideTextArray = [];

        for (let chunkNum in formattingArray) {
            let chunkText = formattingArray[chunkNum];
            if (chunkNum % 2 == 0) { // String should not be formatted
                slideTextArray.push({ text: chunkText });
            } else { // Bold & Underline String
                slideTextArray.push({ text: chunkText, options: { underline: true, italic: true } });
            }
        }

        slideTextArray[slideTextArray.length - 1].text = slideTextArray[slideTextArray.length - 1].text.trim(); // Removes random \n when using ** formatting
        if (slideTextArray[slideTextArray.length - 1].text == "") slideTextArray.pop();

        if (slideTextArray[0].text == "") slideTextArray.splice(0, 1); // Removes empty first line causing "repair" errors


        slideArray.push(slideTextArray);
    }

    console.log(slideArray);

    return slideArray;
}

function obsExport() {
    let captions = generateExportJSON().captions;
    let exportJSON = { captions: [] };

    for(let caption of captions) {
        switch (caption.type) {
            case "centered":
                exportJSON.captions.push({ type: "centered", text: [caption.text[0]] });
                break;
            case "hymn":
                exportJSON.captions.push({ type: "song", text: [`${caption.text[0]}   #${caption.text[1]}`, caption.text[2]] });
                break;
            case "bibleverse":
            case "music":
                exportJSON.captions.push({ type: "song", text: [caption.text[0], caption.text[1]] });
                break;
            case "communion":
                exportJSON.captions.push({ type: "centered", text: ["The Great Thanksgiving"] });
            case "lordsprayer":
                exportJSON.captions.push({ type: "centered", text: ["The Lord's Prayer"] });
                break;
        }
    }

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
    if (!exportJSON) return;

    let pptx = new PptxGenJS();
    pptx.title = "Captions Export";
    pptx.layout = "LAYOUT_WIDE";



    // One Textbox Slide Master - ID: OneTextbox
    pptx.defineSlideMaster({
        title: "OneTextbox",
        background: { color: "FFFFFF" },
        objects: [{
            placeholder: {
                options: { name: "header", type: "header", x: 1, y: 1, w: 11.33, h: 5.5, align: "center", valign: "middle", color: '000000', fontFace: "Aptos Black", fontSize: 66 },
                text: "Title Placeholder",
            },
        },
        ],
    });

    // Full Body Slide Master - ID: FullBody

    pptx.defineSlideMaster({
        title: "FullBody",
        background: { color: "FFFFFF" },
        objects: [{
            placeholder: {
                options: { name: "body", type: "body", x: 1, y: 1, w: 11.33, h: 5.5, align: "left", valign: "middle", color: '000000', fontSize: 59, fontFace: "Arial Narrow", bold: true },
                text: "Body Placeholder",
            },
        },
        ],
    });

    // Title Card Slide Master - ID: TitleSlide
    pptx.defineSlideMaster({
        title: "TitleSlide",
        background: { color: "FFFFFF" },
        objects: [
            {
                placeholder: {
                    options: { name: "header", type: "header", x: 0.76, y: 1.19, w: 11.81, h: 2.28, align: "center", valign: "middle", color: '000000', fontFace: "Aptos Black", fontSize: 66 },
                    text: "United Methodist Church of Elmhurst",
                },
            },
            {
                placeholder: {
                    options: { name: "body", type: "body", x: 0.76, y: 4.63, w: 11.81, h: 2.28, align: "center", valign: "bottom", color: '000000', fontSize: 54, fontFace: "Arial Narrow", bold: true },
                    text: "Welcome!",
                },
            },
        ],
    });

    /* 
    let newSlide = pptx.addSlide({ masterName: "TitleSlide" });
    newSlide.addText("UNITED METHODIST CHURCH OF ELMHURST", { placeholder: "header" });
    newSlide.addText("March 23, 2025\n3rd Sunday in Lent", { placeholder: "body" });

    let newSlide = pptx.addSlide({ masterName: "OneTextbox" });
    newSlide.addText("Welcome & Announcments", { placeholder: "header" });

    let newSlide = pptx.addSlide({ masterName: "FullBody" });
    newSlide.addText("Body Text", { placeholder: "body" });
    */

    for (let caption of exportJSON.captions) {
        let newSlide;
        let textString;
        let slidesToCreate;
        switch (caption.type) {
            case "centered":
                newSlide = pptx.addSlide({ masterName: "OneTextbox" });
                textString = caption.text[0];
                if (caption.text[1] != "") textString = textString + "\n\n" + caption.text[1];
                newSlide.addText(textString, { placeholder: "header" });
                break;

            case "bodytext":
                slidesToCreate = createSlideArray(caption.extraSlides);
                for (let slideText of slidesToCreate) {
                    let newBodySlide = pptx.addSlide({ masterName: "FullBody" });
                    newBodySlide.addText(slideText, { placeholder: "body" });
                }
                break;

            case "bibleverse":
                // Add title slide for the first, then add the others
                newSlide = pptx.addSlide({ masterName: "OneTextbox" });
                textString = caption.text[0] + "\n\n" + caption.text[1];
                newSlide.addText(textString, { placeholder: "header" });

                slidesToCreate = createSlideArray(caption.extraSlides);
                for (let slideText of slidesToCreate) {
                    let newBodySlide = pptx.addSlide({ masterName: "FullBody" });
                    newBodySlide.addText(slideText, { placeholder: "body" });
                }

                break;

            case "hymn":
                // Add title slide for the first, then add the others
                newSlide = pptx.addSlide({ masterName: "OneTextbox" });
                textString = `${caption.text[0]}\n\n${caption.text[2]}\n#${caption.text[1]}`;
                newSlide.addText(textString, { placeholder: "header" });

                slidesToCreate = createSlideArray(caption.extraSlides);
                for (let slideText of slidesToCreate) {
                    let newBodySlide = pptx.addSlide({ masterName: "FullBody" });
                    newBodySlide.addText(slideText, { placeholder: "body" });
                }

                break;

            case "music":
                // Add title slide for the first, then add the others
                newSlide = pptx.addSlide({ masterName: "TitleSlide" });
                newSlide.addText(caption.text[0] + "\n" + caption.text[1], { placeholder: "header" });
                newSlide.addText(caption.text[2], { placeholder: "body" });

                slidesToCreate = createSlideArray(caption.extraSlides);
                for (let slideText of slidesToCreate) {
                    let newBodySlide = pptx.addSlide({ masterName: "FullBody" });
                    newBodySlide.addText(slideText, { placeholder: "body" });
                }

                break;

            case "titlecard":
                newSlide = pptx.addSlide({ masterName: "TitleSlide" });
                newSlide.addText("UNITED METHODIST CHURCH OF ELMHURST", { placeholder: "header" });
                newSlide.addText(caption.dateString + "\n" + caption.text[1], { placeholder: "body" });
                break;

            case "lordsprayer":
                newSlide = pptx.addSlide({ masterName: "OneTextbox" });
                newSlide.addText("The Lord's Prayer", { placeholder: "header" });

                slidesToCreate = createSlideArray(lordsPrayerText);
                for (let slideText of slidesToCreate) {
                    let newBodySlide = pptx.addSlide({ masterName: "FullBody" });
                    newBodySlide.addText(slideText, { placeholder: "body" });
                }

                break;

            case "communion":
                newSlide = pptx.addSlide({ masterName: "OneTextbox" });
                newSlide.addText("Holy Communion", { placeholder: "header" });
                
                slidesToCreate = createSlideArray(communionText);
                for (let slideText of slidesToCreate) {
                    let newBodySlide = pptx.addSlide({ masterName: "FullBody" });
                    newBodySlide.addText(slideText, { placeholder: "body" });
                }
                
                break;
        }
    }

    pptx.writeFile({ fileName: 'powerpoint-export.pptx' });
}
