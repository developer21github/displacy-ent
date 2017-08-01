"use strict";
{
    (function () {
        var defaultText = "displaCy uses JavaScript, SVG and CSS to show you how computers understand language";
        var defaultModel = "en";
        var loading = function loading() {
            return document.body.classList.toggle("loading")
        };
        var onError = function onError(err) {
            return $("#error").style.display = "block"
        };
        var displacy = new displaCy(api, {
            container: "#displacy",
            engine: "spacy",
            defaultText: defaultText,
            defaultModel: defaultModel,
            collapsePunct: true,
            collapsePhrase: true,
            distance: 200,
            offsetX: 150,
            arrowSpacing: 10,
            arrowWidth: 8,
            arrowStroke: 2,
            wordSpacing: 40,
            font: "inherit",
            color: "#f5f4f0",
            bg: "#272822",
            onStart: loading,
            onSuccess: loading
        });
        var $ = document.querySelector.bind(document);
        document.addEventListener("DOMContentLoaded", function () {
            var text = getQueryVar("text") || getQueryVar("full") || getQueryVar("manual") || getQueryVar("steps") || defaultText;
            var model = getQueryVar("model") || defaultModel;
            var collapsePunct = getQueryVar("cpu") ? getQueryVar("cpu") == 0 ? 0 : 1 : 1;
            var collapsePhrase = getQueryVar("cph") ? getQueryVar("cph") == 0 ? 0 : 1 : 1;
            var args = [text, model, {collapsePhrase: collapsePhrase, collapsePunct: collapsePunct}];
            if (getQueryVar("text"))updateView.apply(undefined, args);
            if (getQueryVar("full") || getQueryVar("manual") || getQueryVar("steps"))updateURL.apply(undefined, args);
            displacy.parse.apply(displacy, args)
        });
        var run = function run() {
            var text = arguments.length <= 0 || arguments[0] === undefined ? $("#input").value || defaultText : arguments[0];
            var model = arguments.length <= 1 || arguments[1] === undefined ? $('[name="model"]:checked').value || defaultModel : arguments[1];
            var settings = arguments.length <= 2 || arguments[2] === undefined ? {
                collapsePunct: $("#settings-punctuation").checked,
                collapsePhrase: $("#settings-phrases").checked
            } : arguments[2];
            displacy.parse(text, model, settings);
            updateView(text, model, settings);
            updateURL(text, model, settings)
        };
        $("#submit").addEventListener("click", function (ev) {
            return run()
        });
        $("#input").addEventListener("keydown", function (ev) {
            return event.keyCode == 13 && run()
        });
        $("#download").addEventListener("click", function (ev) {
            return $("#download").setAttribute("href", downloadSVG()).click()
        });
        var updateView = function updateView(text, model, settings) {
            $("#input").value = text;
            $('[value="' + model + '"]').checked = true;
            $("#settings-punctuation").checked = settings.collapsePunct;
            $("#settings-phrases").checked = settings.collapsePhrase
        };
        var updateURL = function updateURL(text, model, settings) {
            var url = ["text=" + encodeURIComponent(text), "model=" + encodeURIComponent(model), "cpu=" + (settings.collapsePunct ? 1 : 0), "cph=" + (settings.collapsePhrase ? 1 : 0)];
            history.pushState({text: text, model: model, settings: settings}, null, "?" + url.join("&"))
        };
        var getQueryVar = function getQueryVar(key) {
            var query = window.location.search.substring(1);
            var params = query.split("&").map(function (param) {
                return param.split("=")
            });
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;
            try {
                for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var param = _step.value;
                    if (param[0] == key)return decodeURIComponent(param[1])
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return()
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError
                    }
                }
            }
            return false
        };
        var downloadSVG = function downloadSVG() {
            var serializer = new XMLSerializer;
            return $("#displacy-svg") ? "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString($("#displacy-svg"))) : false
        }
    })()
}