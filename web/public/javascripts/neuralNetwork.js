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

function NeuralNetwork(data) {
    this._data = data;
    this._selectedNode = undefined;
    this._nodes = []
    this._nodeMap = {}
    for (var layerIndex = 0; layerIndex < this.getLayerCount(); ++layerIndex) {
        for (var nodeIndex = 0; nodeIndex < this.getNodeCountInLayer(layerIndex); ++nodeIndex) {
            var newNode = new Node(layerIndex, nodeIndex, this);
            this._nodes.push(newNode);
            this._nodeMap[this._hashNode(newNode)] = newNode;
        }
    }
//    this.selectedNodeChanged = new signals.Signal();
}

NeuralNetwork.prototype._hashNode = function(node) {
    return this._hashIndices(node.layerIndex, node.nodeIndex);
}

NeuralNetwork.prototype._hashIndices = function(layerIndex, nodeIndex) {
     return layerIndex + "," + nodeIndex;
}

NeuralNetwork.prototype.getSelectedNode = function() {
    return this._selectedNode;
}

NeuralNetwork.prototype.setSelectedNode = function(node) {
    if (node !== this._selectedNode) {
//        this.selectedNodeChanged.dispatch();
    }
    this._selectedNode = newNode;
}

NeuralNetwork.prototype.getLayerCount = function() {
    return this._data.layers.length;
}

NeuralNetwork.prototype.getNodeCountInLayer = function(layer) {
    return this._data.layers[layer];
}

NeuralNetwork.prototype.getLayerNodeCounts = function() {
    return this._data.layers;
}

NeuralNetwork.prototype.getBiasesForLayer = function(layer) {
    if (layer < 1) {
        return [];
    }
    return this._data.biases[layer];
}

NeuralNetwork.prototype.getBiasForNode = function(node) {
    if (node.layerIndex < 1) {
        return 0;
    }
    return this._data.biases[node.layerIndex][node.nodeIndex];
}

NeuralNetwork.prototype.getInputWeightsForNode = function(node) {
    if (node.layerIndex < 1) {
        return [];
    }
    return this._data.weights[node.layerIndex][node.nodeIndex];
}

NeuralNetwork.prototype.getNodes = function() {
    return this._nodes;
}

NeuralNetwork.prototype.getNodeAt = function(layerIndex, nodeIndex) {
    return this._nodeMap[this._hashIndices(layerIndex, nodeIndex)];
}