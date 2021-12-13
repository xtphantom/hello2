/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

function getSampleFile(dirEntry, video) {

    var xhr = new XMLHttpRequest();
    
    if (video) {
        xhr.open('GET', 'https://phantomreality.com/assets/videos/sample.mp4', true);
    } else {
        xhr.open('GET', 'https://assetsnffrgf-a.akamaihd.net/assets/m/102017094/univ/art/102017094_univ_lsr_lg.jpg', true);
    }
    xhr.responseType = 'blob';

    xhr.onload = function() {
        if (this.status == 200) {
            if (video) {
                let blob = new Blob([this.response], { type: 'video/mp4' });
                saveFile(dirEntry, blob, "downloadedVideo.mp4");
            } else {
                let blob = new Blob([this.response], { type: 'image/png' });
                saveFile(dirEntry, blob, "downloadedImage.png");
            }
        }
    };
    xhr.send();
}

function onError(e) {
    console.log("Failed: " + e.toString());
}

function handleClick() {
    window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, function (fs) {

        console.log('file system open: ' + fs.name);
        getSampleFile(fs.root, false);
    
    }, onError);
}

function handleVideoClick() {
    window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, function (fs) {

        console.log('file system open: ' + fs.name);
        getSampleFile(fs.root, true);
    
    }, onError);
}

function saveFile(dirEntry, fileData, fileName) {

    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

        writeFile(fileEntry, fileData);

    }, onError);
}

function saveFile(dirEntry, fileData, fileName) {

    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

        writeFile(fileEntry, fileData);

    }, onError);
}

function writeFile(fileEntry, dataObj, isAppend) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            if (dataObj.type == "image/png") {
                readBinaryFile(fileEntry);
            }
            else if (dataObj.type = "video/mp4") {
                readBinaryFile(fileEntry, true);
            }
            else {
                readFile(fileEntry);
            }
        };

        fileWriter.onerror = function(e) {
            console.log("Failed file write: " + e.toString());
        };

        fileWriter.write(dataObj);
    });
}

function readBinaryFile(fileEntry, isVideo) {

    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {

            console.log("Successful file write: " + this.result);
            displayFileData(fileEntry.fullPath + ": " + this.result);
            if (isVideo) {
                displayVideoByFileURL(fileEntry);
            } else {
                displayImageByFileURL(fileEntry);
            }
        };

        reader.readAsArrayBuffer(file);

    }, onError);
}

function displayFileData(info) {
    console.log(`Display File Data: ${info}`);
}

function displayImageByFileURL(fileEntry) {
    var elem = document.getElementById('image-element');
    console.log(`Image URL to display: ${fileEntry.toURL()}`);
    
    // Convert URL to a protocol and scheme that the app can understand.
    // Note: This might to be scoped to be run just on iOS because `window.WkWebView` is iOS-specific.
    // Is uses the preference settings of `scheme` and `hostname` as defined in config.xml.
    var schemeUrl = window.WkWebView.convertFilePath(fileEntry.toURL());

    console.log(`Scheme URL: ${schemeUrl}`);

    elem.src = schemeUrl;
}


function displayVideoByFileURL(fileEntry) {
    var elem = document.getElementById('image-element');
    console.log(`Video URL to display: ${fileEntry.toURL()}`);
    
    // Convert URL to a protocol and scheme that the app can understand.
    // Note: This might to be scoped to be run just on iOS because `window.WkWebView` is iOS-specific.
    // Is uses the preference settings of `scheme` and `hostname` as defined in config.xml.
    var schemeUrl = window.WkWebView.convertFilePath(fileEntry.toURL());

    console.log(`Scheme URL: ${schemeUrl}`);

    elem.src = schemeUrl;
}