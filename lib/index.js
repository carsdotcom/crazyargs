"use strict";
var argv = require('argv');
var _ = require('lodash');
var keypath = require('keypather')();
var collectionOptions = [];

module.exports.type = function (type) {
    return argv.type(type);
};

module.exports.option = function (opt) {
    if (opt.addToCollection) collectionOptions.push(opt.name);
    return argv.option(opt);
};

module.exports.run = function (raw) {
    var args = argv.run(raw);

    var colValues = _.values(_.pickBy(args.options, (v, k) =>  (_.indexOf(collectionOptions, k) >= 0)));

    var longest = _.reduce(colValues,
        function (acc, v, i, col) {
            if (i > 0) {
                return (v.length > col[i - 1].length) ? v.length : col[i - 1].length;
            } else {
                return v.length;
            }
        }, 0);

    args.collection = [];

    _.times(longest, (i) => {
        let o = _.omitBy(_.transform(_.pickBy(args.options, _.isArray), function (r, v, k) {
            return r[k] = v[i];
        }, {}), _.isEmpty);
        args.collection.push(o);
    });

    args.options = keypath.expand(args.options);
    args.collection = _.map(args.collection, (v) => keypath.expand(v));
    return args;
};

module.exports.__collectionOptions__ = collectionOptions;
