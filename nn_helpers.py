def extract_data(net):
    """Converts data stored in a neural network 
    (https://github.com/mnielsen/neural-networks-and-deep-learning/blob/master/src/network.py)
    to a format that can be serialized to json"""
    result = {}
    result["layers"] = net.sizes

    biases = {}
    for layer_index in range(len(net.biases)):
        biases[layer_index + 1] = [x[0] for x in net.biases[layer_index]]
    result["biases"] = biases

    weights = {}
    for layer_index, layer_nodes in enumerate(net.weights):
        layer_dict = {}
        weights[layer_index + 1] = layer_dict
        for node_index, node_weights in enumerate(layer_nodes):
            layer_dict[node_index] = [x for x in node_weights]
    result["weights"] = weights

    return result
