/**
 * @author Tiago Ribeiro - www.tiago-ribeiro.com
 * @description Customizable alerting plugin that allows the creation of alerts and confrimation dialogs
 * @see https://github.com/Ribeiro-Tiago/alert-message
 * @copyright MIT license, 2017
 * @version 1.0.0
 */

/**
 * Customizable alerting plugin that allows the creation of alerts and confrimation dialogs
 */
var Message = (function(){
    /** Default configs for location, size, colors, texts and buttons **/
    // position options
    var topRight = {
        top: "10px;",
        right: "10px;"
    }
    var topLeft = {
        top: "10px;",
        left: "10px;"
    }
    var bottomLeft = {
        bottom: "10px;",
        left: "10px;"
    }
    var bottomRight = {
        bottom: "10px;",
        right: "10px;"
    }

    // root element that'll "parent" all alerts
    var element = null;

    // alert specific
    var clickToClose = true;
    var clickEvent = null;
    var closeTimer = 5000;

    // default position
    var position = topRight;

    // size 
    var width = "20%;";
    var minHeight = "50px;";
   
    // colors
    var successColor = "#3c763d";
    var successBgColor = "#dff0d8";
    var successBorderColor = "#779261";
    
    var informationColor = "#223a80;";
    var informationBgColor = "#8dc0ef";
    var informationBorderColor = "#317ea5";
    
    var errorColor = "#a94442";
    var errorBgColor = "#f2dede";
    var errorBorderColor = "#e8b7bf";
    
    var warningColor = "#8a6d3b";
    var warningBgColor = "#e4daa4";
    var warningBorderColor = "#c3a25d";
    
    // icons
    var showIcons = true;

    // confirm specific
    var okEvent = function(){
        removeAlert(this.parentElement);
        return true;
    }
    var cancelEvent = function(){
        removeAlert(this.parentElement);
        return false;
    }
    var okText = "Ok";
    var cancelText = "Cancel";
    var showCancelBtn = true;

    /**
     * Creates a new style tag and adds all css specific to this plugin
     */
    var createCSS = function(){
        var css = document.createElement("style");
        css.type = 'text/css';

        css.innerHTML = " #" + element + "{display: block; position: absolute; top: 55px; min-height: 50px; right: 10px; width: 20%; max-height: calc(100% - 150px); overflow: auto; z-index: 99999}" +
            " #" + element + "::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius: 10px;background-color: #F5F5F5;}"+
            " #" + element + "::-webkit-scrollbar{width: 12px;background-color: #F5F5F5;}" +
            " #" + element + "::-webkit-scrollbar-thumb{border-radius: 10px;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);background-color: #555;}" +
            " #" + element + " .alert {border-radius: 10px;border-style: dashed;border-width: 5px;text-align: center;margin-bottom: 10px;cursor: pointer;padding: 0 10px;}" +
            " #" + element + " .alert-success{color: " + successColor + "; background-color:" + successBgColor + "; border-color: " + successBorderColor + ";}" +
            " #" + element + " .alert-information{color: " + informationColor + "; background-color:" + informationBgColor + "; border-color: " + informationBorderColor + ";}" +
            " #" + element + " .alert-warning{color: " + warningColor + "; background-color:" + warningBgColor + "; border-color: " + warningBorderColor + ";}" +
            " #" + element + " .alert-error{color: " + errorColor + "; background-color:" + errorBgColor + "; border-color: " + errorBorderColor + ";}" +
            " #" + element + " .alert-removing{-webkit-transition: opacity 1s ease-in-out;-moz-transition: opacity 1s ease-in-out;-ms-transition: opacity 1s ease-in-out;-o-transition: opacity 1s ease-in-out;opacity: 0;}";

        document.getElementsByTagName('head')[0].appendChild(css);
    }

    /**
     * Helper function that creates the DOM for the messages
     * @param {string} tag - tag we're creating (div, span, etc)
     * @param {object} attrs - all attributes that tag will have
     * @param {object} events - events associated with this tag
     * @param {array} children - child elements 
     */
    var createDOMElem = function(tag, attrs, events, children) {
        var tmp = document.createElement(tag);

        if (!isEmpty(attrs)){
            Object.keys(attrs).forEach(function(key){ 
                tmp.setAttribute(key, attrs[key]);
            });
        }

        if (!isEmpty(events)){
            Object.keys(events).forEach(function(key){
                tmp.addEventListener(key, events[key]);
            });
        }

        if (!isEmpty(children)){
            appendChildren(tmp, children);
        }

        return tmp;
    };

    /**
     * Creates a TextNode element and returns
     * @param {String} text - textNode content
     * @return {DOM} - element we just created
     */
    var createDOMText = function(text){
        return document.createTextNode(text);
    };

    /**
     * Appends elements to a parent
     * @param {DOM} parent - Parent element
     * @param {DOM[]} children - children to append
     */
    var appendChildren = function(parent, children){
        children.forEach(function(child){
            parent.appendChild(child);
        });
    };

    /**
     * Validates the recieved value to see if it's empty or not
     * @param {*} value - value to validate
     * @return {boolean} - true if it's empty and false if not
     */
    var isEmpty = function(value){
        return (value === void 0 || value === "" || value === null || value === "undefined" || (typeof value === "object" && Object.keys(value).length === 0));
    };

    /**
     * Removes alert element. Adds "alert-removing" class for fading animation 
     * and after the fadeout removes it from document
     */
    var removeAlert = function(div){
        div.classList.add("alert-removing");

        setTimeout(function(){
            div.remove();
        }, 1200);
    }

    /**
     * Creates an alert message. Displays a message and after x ammount of time or if
     * it's clicked (default click event) disappears
     * @param {Object} opts - options for the alert such as message to display, type of alert
     * (information, error, success, warning), custom click event, custom timer, etc
     */
    var alert = function(opts){
        if (!isEmpty(opts)){       
            clickToClose = opts.clickToClose || clickToClose;
            clickEvent = opts.clickEvent || null;                
            closeTimer = opts.closeTimer || closeTimer;
        }

        var text = opts.text;
        var type = opts.type || "information";
        
        var div = createDOMElem("div", {"class": "alert alert-" + type}, {"click": clickEvent}, [
            createDOMElem("p", null, null, [createDOMText(text)])
        ]);
        
        var dom = document.getElementById(element);
        dom.insertBefore(div, dom.firstChild);
        
        setTimeout(function(){
            removeAlert(div);
        }, closeTimer);
    };

    /**
     * Creates an confirmation message. Displays a message with a configurable okay and cancel button
     * Default events of those buttons removes the alert and returns true or false respectively.
     * @param {Object} opts - options for the alert such as message to display, type of alert 
     * (information, error, success, warning), custom click event, custom button text, etc
     */
    var confirm = function(opts){
        if (!isEmpty(opts)){
            okEvent = opts.okEvent || okEvent;
            cancelEvent = opts.cancelEvent || cancelEvent;
            okText = opts.okText || okText;
            cancelText = opts.cancelText || cancelText;
            showCancelBtn = isEmpty(opts.showCancelBtn) ? showCancelBtn : opts.showCancelBtn;
        }
        
        var text = opts.text;
        var type = opts.type || "information";
        
        var div = createDOMElem("div", {"class": "confirm alert alert-" + type}, null, [
            createDOMElem("p", null, null, [createDOMText(text)]), 
            createDOMElem("button", {"class": "button" }, {"click": okEvent}, [createDOMText(okText)])
        ]);

        if (showCancelBtn) {
            div.appendChild(createDOMElem("button", {"class": "button" }, {"click": cancelEvent}, [createDOMText(cancelText)]));
        } 
        
        var dom = document.getElementById(element);
        dom.insertBefore(div, dom.firstChild);
    };

    /**
     * Checks configs passed during instantiation. If it's not empty, we'll 
     * see which ones of these options the user has customized and use the default
     * values defined at the start for those that he didn't
     * @param {object} opts - options to check
     */
    var checkConfigs = function(opts){
        if (!isEmpty(opts))
        {
            successColor = opts.successColor || successColor;
            successBgColor = opts.successBgColor || successBgColor;
            successBorderColor = opts.successBorderColor || successBorderColor;

            informationColor = opts.informationColor || informationColor;
            informationBgColor = opts.informationBgColor || informationBgColor;
            informationBorderColor = opts.informationBorderColor || informationBorderColor;

            errorColor = opts.errorColor || errorColor;
            errorBgColor = opts.errorBgColor || errorBgColor;
            errorBorderColor = opts.errorBorderColor || errorBorderColor;

            warningColor = opts.warningColor || warningColor;
            warningBgColor = opts.warningBgColor || warningBgColor;
            warningBorderColor = opts.warningBorderColor || warningBorderColor;

            showIcons = opts.showIcons || showIcons;

            if (!isEmpty(opts.position))
            {
                var tmp = opts.position;
                if (tmp !== "topRight" && tmp !== "topLeft" && tmp !== "bottomLeft" && tmp !== "bottomRight")
                    throw Error("Invalid position");

                position = tmp;
            }

            width = opts.width || width;

            minHeight = opts.minHeight || minHeight;   
        }
    };

    /**
     * @class Message - represents a message, be it alert or confirmation
     * 
     * @param {string} elem - id of the element hosting all the messages
     * @param {object} configs - options that the user might want to customize
     */
    function Message(elem, configs){
        if (isEmpty(elem))
            throw new Error("Element ID is invalid!");
        
        element = elem;

        checkConfigs(configs);        

        createCSS();
    };

    Message.prototype.alert = alert;
    Message.prototype.confirm = confirm;

    return Message;
})();