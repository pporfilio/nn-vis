function Node(layerIndex, nodeIndex, parentNetwork) {
    this._layerIndex = layerIndex;
    this._nodeIndex = nodeIndex;
    this._parentNetwork = parentNetwork;
    this._selected = false;
    this.selectedChanged = new signals.Signal();
}

Node.prototype.getLayerIndex = function() {
    return this._layerIndex;
}

Node.prototype.getNodeIndex = function() {
    return this._nodeIndex;
}

Node.prototype.getParentNetwork = function() {
    return this._parentNetwork;
}

Node.prototype.getSelected = function() {
    return this._selected;
}

Node.prototype.setSelected = function(selected) {
    if (selected !== this._selected) {
        this._selected = selected;
        this.selectedChanged.dispatch();
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
    this.selectedNodeChanged = new signals.Signal();
}

NeuralNetwork.prototype._hashNode = function(node) {
    return this._hashIndices(node.getLayerIndex(), node.getNodeIndex());
}

NeuralNetwork.prototype._hashIndices = function(layerIndex, nodeIndex) {
     return layerIndex + "," + nodeIndex;
}

NeuralNetwork.prototype.getSelectedNode = function() {
    return this._selectedNode;
}

NeuralNetwork.prototype.setSelectedNode = function(node) {
    if (node !== this._selectedNode) {
        this.selectedNodeChanged.dispatch();
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
    if (node.getLayerIndex() < 1) {
        return 0;
    }
    return this._data.biases[node.getLayerIndex()][node.getNodeIndex()];
}

NeuralNetwork.prototype.getInputWeightsForNode = function(node) {
    if (node.getLayerIndex() < 1) {
        return [];
    }
    return this._data.weights[node.getLayerIndex()][node.getNodeIndex()];
}

NeuralNetwork.prototype.getNodes = function() {
    return this._nodes;
}

NeuralNetwork.prototype.getNodeAt = function(layerIndex, nodeIndex) {
    return this._nodeMap[this._hashIndices(layerIndex, nodeIndex)];
}