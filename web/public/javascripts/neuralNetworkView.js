class NodeView {
    constructor(nnNode) {
        this._nnNode = nnNode;
        this._domEl = undefined;
    }

    get nnNode() {
        return this._nnNode;
    }

    get domEl() {
        return this._domEl;
    }

    set domEl(newDomEl) {
        this._domEl = newDomEl;
    }
}

class NeuralNetworkView {
    constructor(neuralNetwork, parentD3Node) {
        this._parent = parentD3Node;
        this._nn = neuralNetwork;

        this._allNodesGroup = undefined;
        this._selectLayerSelectSel = undefined;
        this._selectNodeSelectSel = undefined;
        this._biasTextAreaSel = undefined;
        this._inputWeightTextAreaSel = undefined;
        this._nodeViews = undefined

        this._initializeView();
        this._populateView();

        this._selectionSet = new SelectionSet();
        this._selectionSet.elementsAdded.connect(function(sender, addedElements) {
            addedElements.forEach(function(element) {
                d3.select(element.domEl).classed("selected", true);
            });
        });
        this._selectionSet.elementsRemoved.connect(function(sender, removedElements) {
            removedElements.forEach(function(element) {
                d3.select(element.domEl).classed("selected", false);
            })
        })
    }


    _initializeView() {
        // I need members of `this` in functions that have a different value for `this`.
        // Is there a better option than aliasing in this way?
        var nnview = this;

        var selectLayerDivSel = this._parent.append("div").attr("id", "selectLayerDiv");
        selectLayerDivSel.append("div").attr("id", "selectLayerLabel").html("Select a Layer:");
        this._selectLayerSelectSel = selectLayerDivSel.append("select").attr("id", "selectLayerSelect")
            .on("change", function () { nnview._onSelectLayerChanged(nnview); });
        var selectNodeDivSel = this._parent.append("div").attr("id", "selectNodeDiv");
        selectNodeDivSel.append("div").attr("id", "selectNodeLabel").html("Select a Node:");
        this._selectNodeSelectSel = selectNodeDivSel.append("select").attr("id", "selectNodeSelect")
            .on("change", function () { nnview._onSelectNodeChanged(nnview); });
        var biasDivSel = this._parent.append("div").attr("id", "biasDiv");
        biasDivSel.append("div").attr("id", "biasLabel").html("Bias:");
        this._biasTextAreaSel = biasDivSel.append("textarea").attr("id", "biasTextArea").attr("rows", "1").attr("cols", "20").attr("readonly", "true");
        var inputWeightDivSel = this._parent.append("div").attr("id", "inputWeightDiv");
        inputWeightDivSel.append("div").attr("id", "inputWeightLabel").html("Input Weights");
        this._inputWeightTextAreaSel = inputWeightDivSel.append("textarea").attr("id", "inputWeightTextArea").attr("rows", "20").attr("cols", "20").attr("readonly", "true");
        var svgSel = this._parent.append("svg").attr("width", "600").attr("height", "300");


        svgSel.append("rect")
        .attr("width", svgSel.attr("width"))
        .attr("height", svgSel.attr("height"))
        .attr("class", "nn_background")
        .call(d3.zoom()
            .scaleExtent([1 / 2, 4])
            .on("zoom", function() { nnview._allNodesGroup.attr("transform", d3.event.transform); }));

        // Needs to be appended after "rect" for children to get events before "rect" does.
        // "g" is an SVG element used to group other SVG elements.
        this._allNodesGroup = svgSel.append("g");
    }

    _populateView() {
        var nnView = this;

        this._nodeViews = new Set();
        for (var i = 0; i < this._nn.nodes.length; i++) {
            this._nodeViews.add(new NodeView(this._nn.nodes[i]));
        }
        console.log("nodeViews length: " + this._nodeViews.values().length);
        this._allNodesGroup.selectAll("circle .nn_node")
        .data([...this._nodeViews.values()], function(nodeView) { return nodeView.nnNode.layerIndex + "," + nodeView.nnNode.nodeIndex; })
        .enter()
        .append("svg:circle")
        .attr("class", "nn_node")
        .attr("cx", function(nodeView) { return 50 + nodeView.nnNode.layerIndex * 50; })
        .attr("cy", function(nodeView) { return 50 + nodeView.nnNode.nodeIndex * 25; })
        .attr("r", "10px")
        .on("click", function(datum, index) {
            if (nnView._selectionSet.contains(datum)) {
                nnView._selectionSet.remove(datum);
            } else {
                nnView._selectionSet.clear();
                nnView._selectionSet.add(datum);
            }
        })
        .each(function(datum, index, nodes) {
            datum.domEl = this;
        });

        this._selectLayerSelectSel.selectAll("option")
        .data(this._nn.layerNodeCounts)
        .enter()
        .append("option")
        .html(function(datum, index) { return "layer " + index + " (" + datum + " nodes)"; })
        .attr("value", function(datum) { return datum; });

        // Don't seem to get a changed callback after repopulating the layer dropdown.
        this._onSelectLayerChanged(this);
    }

    _onSelectLayerChanged(nnView) {
        // It appears that when a handler is called by d3, `this` is set to the DOM element that 
        // generated the event, which means we don't have access to other NeuralNetworkView members
        // without passing in the NeuralNetworkView manually.
        var optionSel = nnView._selectNodeSelectSel.selectAll("option")
        .data(d3.range(nnView._selectLayerSelectSel.property("value")))
        .enter()
        .append("option")
        .html(function(datum) { return "Node " + datum; })
        .attr("value", function(datum) { return datum; });

        optionSel.exit().remove();

        nnView._onSelectNodeChanged(nnView);
    }

    _onSelectNodeChanged(nnView) {
        if (nnView._selectLayerSelectSel.property("selectedIndex") <= 0) {
            nnView._biasTextAreaSel.property("value", "--");
            nnView._inputWeightTextAreaSel.property("value", "--");
        } else {
            var selectedNode = nnView._nn.getNodeAt(nnView._selectLayerSelectSel.property("selectedIndex"),
                                                nnView._selectNodeSelectSel.property("selectedIndex"));
            nnView._biasTextAreaSel.property("value", nnView._nn.getBiasForNode(selectedNode));
            nnView._inputWeightTextAreaSel.property("value", nnView._nn.getInputWeightsForNode(selectedNode).join("\n"));
        }
    }
}
