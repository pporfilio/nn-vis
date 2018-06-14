function Node(layerIndex, nodeIndex, parentNetwork) {
    this.layerIndex = layerIndex;
    this.nodeIndex = nodeIndex;
    this.parentNetwork = parentNetwork;
}

function NeuralNetwork(data) {
    this._data = data;
    this._selectedNode = undefined;
    this._nodes = []
    this._nodeMap = {}
    for (var layerIndex = 0; layerIndex < this.getLayerCount(); ++layerIndex) {
        for (var nodeIndex = 0; nodeIndex < this.getNodeCountInLayer(layerIndex); ++nodeIndex) {
            var newNode = new Node(layerIndex, nodeIndex, this);
            this._nodes.push({
                layerIndex: layerIndex,
                nodeIndex: nodeIndex,
                parentNetwork: this
            })
            this._nodeMap[this._hashNode(newNode)] = newNode;
        }
    }
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

NeuralNetwork.prototype.setSelectedNode = function(newNode) {
    if (newNode !== this._selectedNode) {
        // TODO: emit changed signal
    }
    this._selectedNode = newNode;
}

NeuralNetwork.prototype.getLayerCount = function() {
    return this._data.layers.length;
}

NeuralNetwork.prototype.getNodeCountInLayer = function(layer) {
    return this._data.layers[layer];
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