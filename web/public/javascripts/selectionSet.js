class SelectionSet {
    constructor() {
        this._set = new Set();
        this._selectionSetChangedSignal = new Signal(this);
        this._elementsAddedSignal = new Signal(this);
        this._elementsRemovedSignal = new Signal(this);
    }

    get selectionSetChanged() {
        return this._selectionSetChangedSignal;
    }

    get elementsAdded() {
        return this._elementsAddedSignal;
    }

    get elementsRemoved() {
        return this._elementsRemovedSignal;
    }

    _internalAdd(object) {
        if (!this.contains(object)) {
            this._set.add(object);
            return true;
        }
        return false;
    }

    _internalRemove(object) {
        if (this.contains(object)) {
            this._set.delete(object);
            return true;
        }
        return false;
    }

    add(object) {
        if (this._internalAdd(object)) {
            this.elementsAdded.emit(new Set([object]));
            this.selectionSetChanged.emit();
        }
    }

    remove(object) {
        if (this._internalRemove(object)) {
            this.elementsRemoved.emit(new Set([object]));
            this.selectionSetChanged.emit();
        }
    }

    contains(object) {
        return this._set.has(object);
    }

    toggle(object) {
        if (this.contains(object) && this._internalRemove(object)) {
            this.elementsRemoved.emit(new Set([object]));
            this.selectionSetChanged.emit();
        } else if (this._internalAdd(object)) {
            this.elementsAdded.emit(new Set([object]));
            this.selectionSetChanged.emit();
        }
    }
}