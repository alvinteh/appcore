define(function() {
    "use strict";

    var StringHelper = (function() {
        var irregularNouns = {
            "atlas": "atlases",
            "beef": "beefs",
            "brief": "briefs",
            "brother": "brothers",
            "cafe": "cafes",
            "child": "children",
            "cookie": "cookies",
            "corpus": "corpuses",
            "cow": "cows",
            "ganglion": "ganglions",
            "genie": "genies",
            "genus": "genera",
            "graffito": "graffiti",
            "hoof": "hoofs",
            "loaf": "loaves",
            "man": "men",
            "money": "monies",
            "mongoose": "mongooses",
            "move": "moves",
            "mythos": "mythoi",
            "niche": "niches",
            "numen": "numina",
            "occiput": "occiputs",
            "octopus": "octopuses",
            "opus": "opuses",
            "ox": "oxen",
            "penis": "penises",
            "person": "people",
            "sex": "sexes",
            "soliloquy": "soliloquies",
            "testis": "testes",
            "trilby": "trilbys",
            "turf": "turfs",
            "potato": "potatoes",
            "hero": "heroes",
            "tooth": "teeth",
            "goose": "geese",
            "foot": "feet"
        };

        var uncountableNouns = [
            "advice",
            "air",
            "alcohol",
            "art",
            "beef",
            "blood",
            "butter",
            "cheese",
            "coffee",
            "confusion",
            "cotton",
            "education",
            "electricity",
            "entertainment",
            "experience",
            "fiction",
            "flour",
            "food",
            "forgiveness",
            "furniture",
            "gold",
            "gossip",
            "grass",
            "ground",
            "happiness",
            "history",
            "homework",
            "honey",
            "hope",
            "ice",
            "information",
            "jam",
            "knowledge",
            "lightning",
            "literature",
            "love",
            "luck",
            "luggage",
            "meat",
            "milk",
            "mist",
            "money",
            "music",
            "news",
            "noise",
            "oil",
            "oxygen",
            "patience",
            "pay",
            "peace",
            "pepper",
            "petrol",
            "plastic",
            "pork",
            "power",
            "pressure",
            "rain",
            "research",
            "rice",
            "sadness",
            "salt",
            "sand",
            "sheep",
            "shopping",
            "silver",
            "snow",
            "space",
            "speed",
            "steam",
            "sugar",
            "sunshine",
            "tea",
            "tennis",
            "thunder",
            "toothpaste",
            "traffic",
            "trousers",
            "vinegar",
            "water",
            "weather",
            "wine",
            "wood",
            "wool"
        ];

        var pluralPatterns = {
            "(quiz)$"               : "$1zes",
            "^(ox)$"                : "$1en",
            "([m|l])ouse$"          : "$1ice",
            "(matr|vert|ind)ix|ex$" : "$1ices",
            "(x|ch|ss|sh)$"         : "$1es",
            "([^aeiouy]|qu)y$"      : "$1ies",
            "(hive)$"               : "$1s",
            "(?:([^f])fe|([lr])f)$" : "$1$2ves",
            "(shea|lea|loa|thie)f$" : "$1ves",
            "sis$"                  : "ses",
            "([ti])um$"             : "$1a",
            "(tomat|potat|ech|her|vet)o$": "$1oes",
            "(bu)s$"                : "$1ses",
            "(alias)$"              : "$1es",
            "(octop)us$"            : "$1i",
            "(ax|test)is$"          : "$1es",
            "(us)$"                 : "$1es",
            "s$"                    : "s",
            "$"                     : "s"
        };

        return {
            /*
                @function convertToCamelCase

                Converts the specified snake-cased string to camel case.

                @param {string} string      The desired string

                @return {string}
            */
            convertToCamelCase: function(string) {
                return string.replace(/(\_\w)/g, function($1) { return $1[1].toUpperCase(); });
            },

            /*
                @function convertToSnakeCase

                Converts the specified camel-cased string to snake case.

                @param {string} string      The desired string

                @return {string}
            */
            convertToSnakeCase: function(string) {
                var ret = string.replace(/([A-Z])/g, function($1) { return "_" + $1.toLowerCase(); });

                if (ret.charAt(0) === "_") {
                    ret = ret.substring(1, 2).toLowerCase() + ret.substring(2);
                }

                return ret;
            },

            /*
                @function lowercaseFirst

                Converts the first character of the string to lower case.

                @param {string} string      The desired string

                @return {string}
            */
            lowercaseFirst: function(string) {
                return string.charAt(0).toLowerCase() + string.substring(1);
            },

            /*
                @function uppercaseFirst

                Converts the first character of the string to upper case.

                @param {string} string      The desired string

                @return {string}
            */
            uppercaseFirst: function(string) {
                return string.charAt(0).toUpperCase() + string.substring(1);
            },

            /*
                @function humanize

                Converts the string to a "human format", replacing underscores/uppercase characters.

                @param {string} string      The desired string

                @return {string}
            */
            humanize: function(string) {
                return string.replace(/([A-Z])/g, function($1) { return " " + $1.toLowerCase(); })
                    .replace(/_/g, " ");
            },

            /*
                @function pluralize

                Converts the string to a plural form

                @param {string} string      The desired string

                @return {string}
            */
            pluralize: function(string) {
                if (uncountableNouns.indexOf(string.toLowerCase()) >= 0) {
                    return string;
                }

                var pattern;

                for (var noun in irregularNouns) {
                    pattern = new RegExp(noun + "$", "i");
                    var replace = irregularNouns[noun];

                    if (pattern.test(string)) {
                        return string.replace(pattern, replace);
                    }
                }

                for (var singularForm in pluralPatterns) {
                    pattern = new RegExp(singularForm, "i");

                    if (pattern.test(string)) {
                        return string.replace(pattern, pluralPatterns[singularForm]);
                    }
                }
            }
        };
    })();

    return StringHelper;
});
