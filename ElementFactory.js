//https://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript
var ElementFactory = (function () {
    "use strict";

    // Instance stores a reference to the Singleton
    var element_factory_instance;

    function element_factory_init() {

        // Private variables
        var elementCatalogue = new Object();
        var elementImported = new Object();

        // Private methods

        return {
            // Public variables

            // Public methods
            registerElement: function (elementName, importHref) {
                var storeImportHref = elementCatalogue[elementName];

                if (storeImportHref !== undefined)
                    throw "Element '<" + elementName + ">' has already been registered with importHref '" + storeImportHref + "'.";

                elementCatalogue[elementName] = importHref;
                elementImported[elementName] = false;
            },

            createElement: function (elementName) {
                return new Promise(function (resolve, reject) {
                    if (elementImported[elementName]) {
                        resolve(document.createElement(elementName));
                    } else {
                        var importHref = elementCatalogue[elementName];

                        if (!importHref)
                            throw "Element '<" + elementName + ">' has not been registered, please register the element using '.registerElement('" + elementName + "', '/path/to/element.html')'.";

                        Polymer.Base.importHref(importHref,
                            function () {
                                elementImported[elementName] = true;
                                resolve(document.createElement(elementName));
                            }, function () {
                                reject(Error("ElementFactory.createElement failed to instantiate '<" + elementName + ">'"))
                            }, true
                        );
                    }
                });
            }

        };

    };

    return {

        // Get the Singleton instance if one exists
        // or create one if it doesn't  
        getInstance: function () {
            if (!element_factory_instance)
                element_factory_instance = element_factory_init();

            return element_factory_instance;
        }

    }
}());