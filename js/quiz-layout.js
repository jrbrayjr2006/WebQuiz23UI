$( function() {
    $( "#crmList" ).sortable();
    $( "#crmList" ).disableSelection();
} );

// JSON that holds the DOM representation
var globalJSON = {};

var layoutUrl = "dataDefault.json";  //TODO replace this hard coded value with service uri or file path

var objArray2 = [
    {
        "section_label" : "Basic Info",
        "rows"          : [
            {
                "row1"  : [
                    {
                        "label"     : "First Name",
                        "id"        : "first_name",
                        "required"  : true,
                        "type"      : "text"
                    },
                    {
                        "label"     : "Middle Name",
                        "id"        : "middle_name",
                        "required"  : true,
                        "type"      : "text"
                    },
                    {
                        "label"     : "Favorite Color",
                        "id"        : "favorite_color",
                        "required"  : true,
                        "type"      : "text"
                    }
                ],
                "row2"  : [
                    {
                        "label"     : "Address 1",
                        "id"        : "address_1",
                        "required"  : false,
                        "type"      : "text"
                    },
                    {
                        "label"     : "Postal Code",
                        "id"        : "postal_code",
                        "required"  : false,
                        "type"      : "text"
                    },
                    {
                        "label"     : "Shoe Size",
                        "id"        : "shoe_size",
                        "required"  : false,
                        "type"      : "text"
                    }
                ],
                "row3"  : [
                    {
                        "label"     : "Address 2",
                        "id"        : "address_2",
                        "required"  : false,
                        "type"      : "text"
                    },
                    {
                        "label"     : "Office Phone",
                        "id"        : "office_phone",
                        "required"  : false,
                        "type"      : "text"
                    },
                    {
                        "label"     : "Shoe Color",
                        "id"        : "shoe_color",
                        "required"  : false,
                        "type"      : "text"
                    }
                ]

            }
        ]

    },
    {
        "section_label" : "More Info",
        "rows"          : [
            {
                "row1"  : [
                    {
                        "label"     : "Company Name",
                        "id"        : "company_name",
                        "required"  : true,
                        "type"      : "text"
                    },
                    {
                        "label"     : "Company Type",
                        "id"        : "company_type",
                        "required"  : false,
                        "type"      : "select"
                    }
                ],
                "row2"  : [
                    {
                        "label"     : "Company Name",
                        "id"        : "company_name",
                        "required"  : true,
                        "type"      : "text"
                    },
                    {
                        "label"     : "Company Type",
                        "id"        : "company_type",
                        "required"  : false,
                        "type"      : "select"
                    }
                ]

            }
        ]

    }

];

populateDOM(objArray2[0].rows[0].row1, objArray2[0].rows[0].row2, objArray2[0].rows[0].row3);

function loadLayoutAndDisableButton() {
    buildLayout(layoutUrl);
    var loadBtn = document.getElementById("loadLayoutBtn");
    loadBtn.setAttribute("disabled", "disabled");
}

function populateDOM(oArray, oArray2, oArray3) {
    var sec0 = document.getElementById("col1-rowA");
    var sec1 = document.getElementById("col2-rowA");
    var sec2 = document.getElementById("col3-rowA");
    for(var obj in oArray) {
        console.debug("The object is: " + oArray[obj]);
        buildInputWithObject(oArray[obj], sec0);
    }
    for(var obj in oArray2) {
        console.debug("The object is: " + oArray2[obj]);
        buildInputWithObject(oArray2[obj], sec1);
    }
    for(var obj in oArray3) {
        console.debug("The object is: " + oArray3[obj]);
        buildInputWithObject(oArray3[obj], sec2);
    }
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

/**
 * Handler for the drop event
 */
function drop(ev) {
    ev.preventDefault();
    var availableArea0 = document.getElementById("col1-rowA");
    var data = ev.dataTransfer.getData("text");
    console.debug("data: " + data);
    if(data == "sectionTemplate") {
        // do nothing
    } else if(data == "dividerTemplate") {
        console.debug("This divider is being dropped in a " + ev.target.tagName);
        // only allow dividers to be dropped in section elements
        if(ev.target.tagName == "SECTION") {
            ev.target.appendChild(document.createElement("hr"));
        }
    } else if(data == "rowTemplate") {
        // only allow rows to be dropped in section elements
        if(ev.target.tagName == "SECTION") {
            ev.target.appendChild(buildRow());
        }
    } else {
        // make sure that fields cannot be dropped directly onto sections
        if((ev.target.tagName == "DIV") && (hasClass(ev.target, "crm-col")) || (hasClass(ev.target, "crm-col-available"))) {
            var parentId = "not-here";
            var replaceFlag = false;  // Flag is replacing a form-control with a new form-control
            if(ev.target.hasChildNodes()) { // true of false
                var nodes = ev.target.childNodes;
                var divCount = 0;
                for(node in nodes) {
                    parentId = document.getElementById(data).parentElement.id;
                    if(nodes[node].tagName == "DIV") {
                        divCount++;
                        if(divCount > 1) {
                            var oldElement = ev.target.firstChild
                            console.warn("Remove " + oldElement.id + " from column!");
                            availableArea0.appendChild(oldElement);
                            replaceFlag = true;
                        }
                    }
                    if(nodes[node].nodeType == 3) {
                        console.debug("The element is " + nodes[node].tagName);
                        console.debug("What is this? " + document.getElementById(data).parentElement.id);
                        parentId = document.getElementById(data).parentElement.id;
                        ev.target.removeChild(nodes[node]);
                    }
                }
            }
            // WARNING -- this block of code causing problems!
            if(parentId != "not-here" && !replaceFlag) {
                console.debug("Adding EMPTY text to DIV...");
                var parentObj = document.getElementById(parentId);
                var childCount = parentObj.childNodes.length;
                console.debug("There are " + childCount + " nodes in " + parentId);
                if(hasClass(parentObj, "crm-col")) {
                    //  && !parentObj.hasChildNodes()
                    console.debug("Added EMPTY text to DIV...");
                    var emptyText = document.createTextNode("EMPTY");
                    parentObj.appendChild(emptyText);
                }
            }

            // WARNING END
            ev.target.appendChild(document.getElementById(data));
            if(ev.target.firstChild.tagName != "DIV") {
                console.debug("Remove this element!");
                ev.target.removeChild(ev.target.firstChild);
            }
            //replaceFlag = true;
        }
    }
}

function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * Clear any duplicate available fields from the Available area when loading a layout
 * @param array element ID's
 */
function clearDuplicateAvailableFields(dupes) {
    console.debug("START clearDuplicateAvailableFields(array)...");

    var availableArea0 = document.getElementById("col1-rowA");
    var availableArea1 = document.getElementById("col2-rowA");
    var availableArea2 = document.getElementById("col3-rowA");

    for(mId in dupes) {
        var mElement = document.getElementById(dupes[mId]);

        // Native javascript method
        if(isDescendant(availableArea0, mElement)) {
            availableArea0.removeChild(mElement);
        } else if(isDescendant(availableArea1, mElement)) {
            availableArea1.removeChild(mElement);
        } else if(isDescendant(availableArea2, mElement)) {
            availableArea2.removeChild(mElement);
        }

        /* JQuery method
         if($("#col1-rowA").has("div")) {
         availableArea0.removeChild(mElement);
         }
         */
    }


}

/**
 * Clear any duplicate child elements - generic
 * @param element parent element
 * @param array element ID's
 */
function clearDuplicateAvailableElements(parent, dupes) {
    console.debug("START clearDuplicateAvailableElements(element,array)...");

    for(mId in dupes) {
        var mElement = document.getElementById(dupes[mId]);
    }
}


/**
 *
 */
function buildLayout(dataUrl) {
    console.info("Starting to build screen layout...");
    var layout = {};
    var availableArea0 = document.getElementById("col1-rowA");
    var availableArea1 = document.getElementById("col2-rowA");
    var availableArea2 = document.getElementById("col3-rowA");

    // get the layout JSON from the file or service
    if(!dataUrl) {
        dataUrl = "tmp.json";
    }
    readJSONFeed(dataUrl, function(text) {
        var data = JSON.parse(text);
        layout = text;
        console.debug("Retrieved data feed");
        console.debug(layout);
        for(var i = 0; i < data.sections.length; i++) {
            // get the new section ID's and check for rows
            var sectionId = "no-id";
            sectionId = buildSectionBlank();

            // iterate to add 1 or more rows to each section
            if(data.sections[i].rows.length > 0) {
                // get the new row ID's
                for(var j = 0; j < data.sections[i].rows.length; j++){
                    var localSection = document.getElementById(sectionId);
                    //var tmp = data.sections[i].rows[j]; // remove
                    //console.debug("The row object is: " + tmp ); // remove
                    if(data.sections[i].rows[j].hr == "hr") {
                        localSection.appendChild(document.createElement("hr"));
                    } else {
                        var row = buildRow(j);
                        localSection.appendChild(row);
                        // get the rowId to identify the columns for field insertion
                        var rowId = row.id;

                        // check row for columns and fields
                        var columns = data.sections[i].rows[j].columns;
                        for(col in columns) {
                            var column = columns[col];
                            var inputs = column.inputs;
                            var colId = "col" + col + "-" + rowId;
                            console.debug("inputs= " + inputs);
                            if(inputs.length > 0) {
                                var duplicateArrayList = []; // create array of ID's to be checked for dupes
                                for(input in inputs) {
                                    inputObj = inputs[input];
                                    console.debug("Id: " + inputObj.id);
                                    console.debug("label: " + inputObj.label);
                                    console.debug("type: " + inputObj.type);
                                    console.debug("required: " + inputObj.required);
                                    var parentElement = document.getElementById(colId);

                                    var inputDivId = "group_div-" + inputObj.id;
                                    duplicateArrayList.push(inputDivId);

                                    buildInputWithObject(inputObj, parentElement );
                                }
                                clearDuplicateAvailableFields(duplicateArrayList); // clear all dupes
                            }
                        }

                    }
                    //
                }
            }
        }
    });

    console.debug("Layout complete");
}

/**
 * Build the section portions of the DOM
 */
function buildSection() {
    console.debug("Start creating new section...");
    var rootElement = document.getElementById("crmList");
    var crmSection = document.createElement("section");
    crmSection.setAttribute("ondrop", "drop(event)");
    crmSection.setAttribute("ondragover", "allowDrop(event)");
    var index = 0;
    while(document.getElementById("section-" + index)) {
        index++;
    }

    crmSection.setAttribute("id", "section-" + index);
    crmSection.setAttribute("class", "crm-section");

    // create the row
    var rowIndex = 0;
    var rowDiv = document.createElement("div");
    rowDiv.setAttribute("class", "row crm-content-row");
    rowDiv.setAttribute("draggable", "true");
    rowDiv.setAttribute("ondragstart", "drag(event)");
    while(document.getElementById("row" + rowIndex + "-sec" + index)) {
        rowIndex++;
    }
    rowDiv.setAttribute("id", "row" + rowIndex + "-sec" + index);

    // create 3 columns in the new section
    console.debug("Creating columns in section...");
    for( var cIndex = 0; cIndex < 3; cIndex++) {
        var emptyText = document.createTextNode("EMPTY");
        var sectionColumn = document.createElement("div");
        sectionColumn.setAttribute("class", "col-md-4 drop-area crm-col");
        sectionColumn.setAttribute("ondrop", "drop(event)");
        sectionColumn.setAttribute("ondragover", "allowDrop(event)");
        sectionColumn.setAttribute("draggable", "true");
        sectionColumn.setAttribute("ondragstart", "drag(event)");
        sectionColumn.setAttribute("id", "col" + cIndex + "-row" + rowIndex + "-sec" + index);
        sectionColumn.appendChild(emptyText);
        rowDiv.appendChild(sectionColumn);
    }

    crmSection.appendChild(rowDiv);

    rootElement.appendChild(crmSection);
    console.debug("New section created successfully");

    var sectionId = "section-" + index;
    return sectionId;
}

/**
 * Build the section portions of the DOM
 * @return sectionId
 */
function buildSectionBlank() {
    console.debug("Start creating new section...");
    var rootElement = document.getElementById("crmList");
    var crmSection = document.createElement("section");
    crmSection.setAttribute("ondrop", "drop(event)");
    crmSection.setAttribute("ondragover", "allowDrop(event)");
    crmSection.setAttribute("class", "crm-section");
    var index = 0;
    while(document.getElementById("section-" + index)) {
        index++;
    }

    crmSection.setAttribute("id", "section-" + index);

    rootElement.appendChild(crmSection);
    console.debug("New section created successfully");

    var sectionId = "section-" + index;

    return sectionId;
}

/**
 * Build a div with a class row
 */
function buildRow(index=0) {
    console.debug("Start crrating a div row...");
    var rowDiv = document.createElement("div");
    var rowIndex = 0;
    rowDiv.setAttribute("class", "row crm-content-row");
    rowDiv.setAttribute("draggable", "true");
    rowDiv.setAttribute("ondragstart", "drag(event)");
    while(document.getElementById("row" + rowIndex + "-sec" + index)) {
        rowIndex++;
    }
    rowDiv.setAttribute("id", "row" + rowIndex + "-sec" + index);

    // create 3 columns in the new row
    console.debug("Creating columns in row...");
    for( var cIndex = 0; cIndex < 3; cIndex++) {
        var emptyText = document.createTextNode("EMPTY");
        var rowColumn = document.createElement("div");
        rowColumn.setAttribute("class", "col-md-4 drop-area crm-col");
        rowColumn.setAttribute("ondrop", "drop(event)");
        rowColumn.setAttribute("ondragover", "allowDrop(event)");
        rowColumn.setAttribute("draggable", "true");
        rowColumn.setAttribute("ondragstart", "drag(event)");
        rowColumn.setAttribute("id", "col" + cIndex + "-row" + rowIndex + "-sec" + index);
        rowColumn.appendChild(emptyText);
        rowDiv.appendChild(rowColumn);
    }

    return rowDiv;
}


/**
 * Build an input element
 *
 * @param JSON Object
 * @param DOM Element
 */
function buildInputWithObject( obj, parentElement ) {
    console.debug("Adding new " + obj.type + " element...");

    var availableArea0 = document.getElementById("col1-rowA");
    var availableArea1 = document.getElementById("col2-rowA");
    var availableArea2 = document.getElementById("col3-rowA");

    // START
    console.debug("Adding new DOM element");
    var newElementGroupDiv = document.createElement("div");
    newElementGroupDiv.setAttribute("id", "group_div-" + obj.id)
    newElementGroupDiv.setAttribute("draggable", "true");
    newElementGroupDiv.setAttribute("ondragstart", "drag(event)");
    newElementGroupDiv.setAttribute("class", "form-group");
    var label = document.createElement("label");
    //label.setAttribute("class", "col-md-4 control-label");
    var inputDiv = document.createElement("div");
    inputDiv.setAttribute("class", "col-md-12");
    if(obj.type == "select") {
        var inputElement = document.createElement("select");
    } else if(obj.type == "textarea") {
        var inputElement = document.createElement("textarea");
    } else {
        var inputElement = document.createElement("input");
        inputElement.setAttribute("type", obj.type);
        inputElement.setAttribute("placeholder", obj.label);
    }
    //inputElement.setAttribute("type", obj.type);
    inputElement.setAttribute("class", "form-control input-md crm-control")
    if(obj.required) {
        inputElement.setAttribute("required", "required");
    }

    inputDiv.appendChild(inputElement);
    newElementGroupDiv.append(inputDiv);

    /*
     var helpSpan = document.createElement("span");
     var helpText = document.createTextNode("Enter information here");
     helpSpan.setAttribute("class", "help-block");
     helpSpan.appendChild(helpText);
     inputDiv.appendChild(helpSpan);
     */


    //var crmSection = document.getElementById("col-row1");
    var nodes = parentElement.childNodes;
    for(node in nodes) {
        //console.debug("The element is " + nodes[node].tagName);
        if(nodes[node].nodeType == 3) {
            parentElement.removeChild(nodes[node]);
            //console.debug("The value is " + nodes[node].value);
        }
    }

    // Remove existing input object with same ID from available fields area
    var availInputs = availableArea0.childNodes;
    //var index = 0;
    for(inputNode in availInputs) {
        console.debug("The node type is:  " + availInputs[inputNode].nodeType);
        /*
         if(availInputs[inputNode].nodeType == 1) {
         if(availInputs[inputNode].id == "group_div-" + inputObj.id) {
         console.debug("Removing " + inputObj.id);
         availableArea0.removeChild(document.getElementById("group_div-" + inputObj.id));
         }
         }
         */
    }
    console.debug("is it working here...");
    parentElement.appendChild(newElementGroupDiv);

    console.debug("Completed the addition of a new element");
    // END

    inputElement.setAttribute('id', obj.id);

    switch(obj.type) {
        case 'checkbox':
            //inputElement = document.createElement('checkbox');
            break;
        case 'textarea':
            //inputElement = document.createElement('textarea');
            break;
        default:
        //inputElement = document.createElement('input');
        //inputElement.setAttribute("class","");
    }
    console.debug("Completing building element...");
}


function readJSONFeed(file, callback) {
    var mFile = new XMLHttpRequest();
    mFile.overrideMimeType("application/json");
    mFile.open("GET", file, true);
    mFile.onreadystatechange = function() {
        if(mFile.readyState === 4 && mFile.status == "200") {
            callback(mFile.responseText);
        }
    };
    mFile.send(null);
}

/**
 * Convert the current generated DOM to JSON
 * Serialize the DOM
 */
function convertDOMtoJSON() {
    console.debug("Convert the selected element and all child DOM elements to JSON");
    var rootElement = document.getElementById("crmList");
    var htmlRootElement = rootElement.outerHTML;
    var myJson = {"data" : htmlRootElement};
    var obj = JSON.stringify($("#crmList").html());
    var json = JSON.stringify(myJson, null, 2);
    //TODO
    return obj;
}


/**
 *
 */
function getSectionsForJson() {
    console.info("Start processing DOM for JSON creation by getting sections...");
    var data = {};
    var layout = [];
    var sections = [];
    data.sections = new Array();
    var jsonSections = document.getElementsByClassName("crm-section");
    for(var i = 0; i < jsonSections.length; i++) {
        var rows = [];
        var jsonSection = jsonSections[i];
        var j = 0;
        var rows = jsonSection.childNodes;
        var rowArrayList = [];


        for(child in rows) {
            j++
            //console.debug(jsonSection.id + " has " + j + " nodes");
            console.debug(jsonSection.id + " tag is for " + rows[child].id);
            //console.debug(jsonSection.id + " type is " + rows[child].type + " type");
            var node = rows[child];


            if((node.tagName == "DIV") && (hasClass(node, "crm-content-row"))) {
                var columns = rows[child].childNodes;
                var columnArrayList = [];
                for(column in columns) {
                    if((columns[column].tagName == "DIV") && (hasClass(columns[column], "crm-col"))) {
                        console.debug("The column id is " + columns[column].id);

                        // get the input fields -- remember to add if DIV
                        var inputFields = columns[column].childNodes;
                        var inputArrayList = [];
                        for(inputField in inputFields) {
                            if((inputFields[inputField].tagName == "DIV") && (hasClass(inputFields[inputField], "form-group"))) {
                                console.debug("The input field area name is " + inputFields[inputField].id);
                                var mLabel  = "No Label";
                                var mId     = "0";
                                var mReq    = "";
                                var mType   = "text";

                                inputElements = inputFields[inputField].childNodes;
                                for(inputElement in inputElements) {
                                    /* // LABEL has been removed from the layouts
                                     if(inputElements[inputElement].tagName == "LABEL") {
                                     mLabel = inputElements[inputElement].innerHTML;
                                     console.debug("The label is " + mLabel);
                                     } */
                                    if(inputElements[inputElement].tagName == "DIV") {
                                        var subElements = inputElements[inputElement].childNodes;
                                        for(el in subElements) {
                                            if(subElements[el].tagName == "INPUT") {
                                                mId = subElements[el].id;
                                                mReq = subElements[el].required;
                                                mType = subElements[el].type;
                                                if(mLabel == "No Label") {
                                                    mLabel = subElements[el].placeholder;
                                                }
                                            }
                                            if(subElements[el].tagName == "SELECT") {
                                                mId = subElements[el].id;
                                                mReq = subElements[el].required;
                                                mType = "select";
                                            }
                                            if(subElements[el].tagName == "TEXTAREA") {
                                                mId = subElements[el].id;
                                                mReq = subElements[el].required;
                                                mType = "textarea";
                                            }
                                        }
                                    }
                                }

                                inputArrayList.push(new Input(mLabel,mId,mReq,mType));
                            }
                        }

                        columnArrayList.push(new Column(inputArrayList));
                    }
                }

                //
                var rowObject = new Row(columnArrayList);;
                rowArrayList.push(rowObject);
            }
            // handle HR dividers
            if(node.tagName == "HR") {
                console.debug("This is an HR tag");
                rowArrayList.push({"hr":"hr"});
            }
        }

        var sec = {"id": jsonSection.id, "rows": rowArrayList};
        var sectionObject = new Section(rowArrayList);

        console.debug("The section id is " + jsonSection.id);

        //sections.push(sec);
        sections.push(sectionObject);
    }

    data.sections = sections;
    var layoutObject = new Layout(sections);
    //alert(JSON.stringify(data.sections, null, 2));
    return layoutObject;
}

/**
 * Convert the node to JSON
 * @param node
 * @return json
 */
function convertNodeToJSON(node) {
    console.info("ENTER convertNodeToJSON(node)");

    switch(node.tagName) {
        case "DIV":
            console.debug("Child id is " + node.id);
            var children = node.childNodes;
            return {"id" : node.id};
            break;
        case "INPUT":
            console.debug("Child id is " + node.id);
            console.debug(jsonSection.id + " type is " + node.type + " type");
            break;
        case "SPAN":
            console.debug("Child content is " + node.innerHTML);
            console.debug(jsonSection.id + " type is " + node.type + " type");
            break;
    }

    return {};
}

function displayJSON() {
    console.debug("Display the JSON object");
    var strJson = JSON.stringify(objArray2, null, 2);
    var modalContent = document.getElementById("crmModalContent");

    // remove any old JSON text
    while(modalContent.hasChildNodes()) {
        modalContent.removeChild(modalContent.lastChild);
    }
    // get JSON from current DOM structure
    globalJSON = getSectionsForJson();
    //alert(JSON.stringify(globalJSON,null,2));

    var code = document.createElement("code");
    var jsonText = document.createTextNode(JSON.stringify(globalJSON,null,2));
    code.appendChild(jsonText);
    modalContent.appendChild(code);
    var jsonOut = convertDOMtoJSON();
    //alert(jsonOut);
    alert(JSON.stringify(globalJSON,null,2));
}

/**
 * Save the generated layout
 */
function saveLayout() {
    console.debug("Save JSON representation of DOM to server...");
    //TODO post to server
    globalJSON = getSectionsForJson();
    alert(JSON.stringify(globalJSON,null,2));
}

// UTILITIES

/**
 * Determine if the element has this class
 */
function hasClass(element, cls) {
    var result = false;
    result = (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;

    return result;
}

// MODELS

/**
 *
 * @param label
 * @param id
 * @param required
 * @param type
 */
function Input(label="No Label", id="0", required, type="text") {
    this.label = label;
    this.id = id;
    this.required = required;
    this.type = type;
}

/**
 *
 * @param Input array
 */
function Column(inputs=[]) {
    this.inputs = inputs;
}

/**
 *
 * @param Column array
 */
function Row(columns=[]) {
    this.columns = columns;
}

/**
 *
 * @param Row array
 */
function Section(rows=[]) {
    this.rows = rows;
}

function Layout(sections=[]) {
    this.sections = sections;
}