class Signal {
    constructor(owner) {
        this._owner = owner;
        this._callbacks = [];
    }

    get owner() {
        return this._owner;
    }

    connect(callback) {
        this._callbacks.push(callback);
    }

    emit() {
        var signal = this;
        var sentArguments = arguments;
        this._callbacks.forEach(function(element) {
            element(signal.owner, ...sentArguments);
        });
    }
}