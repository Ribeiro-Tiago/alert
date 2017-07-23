/**
 * Cria os elementos respetivos de modo a mostrar um alerta e adiciona-os ao container
 * @param {String} message - mensagem a aparecer no alerta
 * @param {Boolean} success - indica se o alerta é de erro ou sucesso
 */
var alert = (function(){
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

    var element = null;

    var clickToClose = true;
    var clickEvent = null;
    var closeTimer = 5000;

    var position = topRight;

    var width = "20%;";

    var minHeight = "50px;";
   
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
    
    var showIcons = true;

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
    }

    /**
     * Cria um elemento TextNode e retorna-o
     * @param {String} text 
     * @return {DOM} - o elemento TextNode acabado de criar
     */
    var createDOMText = function(text){
        return document.createTextNode(text);
    }

    /**
     * Anexa vários elementos filhos ao mesmo pai
     * @param {DOM} parent - pai ao qual vamos anexar os filhos
     * @param {DOM[]} children - array de filhos a anexar
     */
    var appendChildren = function(parent, children){
        children.forEach(function(child){
            parent.appendChild(child);
        });
    }

    var isEmpty = function(value){
        return (value === void 0 || value === "" || value === null || value === "undefined" || (typeof value === "object" && Object.keys(value).length === 0));
    }

    return {
        config: function(elem, opts) {
            if (isEmpty(elem))
                throw new Error("Element ID is invalid!");
            
            element = elem;

            if (!isEmpty(opts))
            {
                clickToClose = opts.clickToClose || clickToClose;
                clickEvent = opts.clickEvent || null;                
                closeTimer = opts.closeTimer || closeTimer;

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

            createCSS();
        },

        showAlert: function(message, type){
            if (type !== "error" && type !== "information" && type !== "warning" && type !== "success")
                throw new Error("Alert type is invalid!");

            if (element === null)
                throw new Error("You must configure the alert at least once!");

            var p = createDOMElem("p", null, null, [createDOMText(message)]);
            
            var div = createDOMElem("div", {"class": "alert alert-" + type}, {"click": (isEmpty(clickEvent)) ? function(){ removeAlert(); } : clickEvent}, [p]);
            var dom = document.getElementById(element);
            /**
             * Remove o elemento relativa ao alerta em questão. Adiciona a classe "alert-removing" para dar o efeito
             * de fadeout e depois remove o elemento do DOM
             */
            var removeAlert = function(){
                div.classList.add("alert-removing");

                setTimeout(function(){
                    div.remove();
                }, 1200);
            }

            dom.insertBefore(div, dom.firstChild);
            
            setTimeout(function(){
                removeAlert();
            }, closeTimer);
        }
    };   
})();