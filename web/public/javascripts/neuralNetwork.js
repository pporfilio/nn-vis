class Node {
    constructor(layerIndex, nodeIndex, parentNetwork) {
        this._layerIndex = layerIndex;
        this._nodeIndex = nodeIndex;
        this._parentNetwork = parentNetwork;
        this._selected = false;        
    }

    get layerIndex() {
        return this._layerIndex;
    }

    get nodeIndex() {
        return this._nodeIndex;
    }

    get parentNetwork() {
        return this._parentNetwork;
    }

    get selected() {
        return this._selected;
    }

    set selected(isSelected) {
        return this._selected = isSelected;
    }
}

class NeuralNetwork {
    constructor(data) {
        this._data = data;
        this._selectedNode = undefined;
        this._nodes = []
        this._nodeMap = {}

        for (var layerIndex = 0; layerIndex < this.layerCount; ++layerIndex) {
            for (var nodeIndex = 0; nodeIndex < this.getNodeCountInLayer(layerIndex); ++nodeIndex) {
                var newNode = new Node(layerIndex, nodeIndex, this);
                this._nodes.push(newNode);
                this._nodeMap[this._hashNode(newNode)] = newNode;
            }
        }
    }

    _hashNode(node) {
       return this._hashIndices(node.layerIndex, node.nodeIndex);
    }

    _hashIndices(layerIndex, nodeIndex) {
        return layerIndex + "," + nodeIndex;
    }

    get selectedNode() {
        return this._selectedNode;
    }

    set selectedNode(node) {
        this._selectedNode = newNode;
    }

    get layerCount() {
        return this._data.layers.length;
    }

    getNodeCountInLayer(layer) {
        return this._data.layers[layer];
    }

    get layerNodeCounts() {
        return this._data.layers;
    }

    getBiasesForLayer(layer) {
        if (layer < 1) {
            return [];
        }
        return this._data.biases[layer];
    }

    getBiasForNode(node) {
        if (node.layerIndex < 1) {
            return 0;
        }
        return this._data.biases[node.layerIndex][node.nodeIndex];
    }

    getInputWeightsForNode(node) {
        if (node.layerIndex < 1) {
            return [];
        }
        return this._data.weights[node.layerIndex][node.nodeIndex];
    }

    get nodes() {
        return this._nodes;
    }

    getNodeAt(layerIndex, nodeIndex) {
        return this._nodeMap[this._hashIndices(layerIndex, nodeIndex)];
    }
}
