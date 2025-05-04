String.prototype.titleCase = function () {
    return this.toLowerCase()
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .replace(/(?:^|\s)\w/g, function (match) {
            return match.toUpperCase();
        });
};
