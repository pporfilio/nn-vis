function NeuralNetworkView(neuralNetwork, parentD3Node) {
    this._parent = parentD3Node;
    this._nn = neuralNetwork;
    this._allNodesGroup = undefined;

    this._initializeView();
    this._populateView();
}

NeuralNetworkView.prototype._initializeView = function() {
    // I need allNodesGroup in the zoom handler, which has it's own `this`.
    // Is there a better way than this sort of aliasing?
    var nnview = this;

    this._parent.append("rect")
    .attr("width", this._parent.attr("width"))
    .attr("height", this._parent.attr("height"))
    .style("fill", "none")
    .style("pointer-events", "all")
    .style("stroke", "black")
    .style("stroke-width", "2")
    .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", function() { nnview._allNodesGroup.attr("transform", d3.event.transform); }));

    // Needs to be appended after "rect" for children to get events before "rect" does.
    // "g" is an SVG element used to group other SVG elements.
    this._allNodesGroup = this._parent.append("g");

    this._allNodesGroup.selectAll("circle .nodes")
    .data(this._nn.getNodes(), function(node) { return node.getLayerIndex() + "," + node.getNodeIndex(); })
    .enter()
    .append("svg:circle")
    .attr("class", "nodes")
    .attr("cx", function(node) { return 50 + node.getLayerIndex() * 50; })
    .attr("cy", function(node) { return 50 + node.getNodeIndex() * 25; })
    .attr("r", "10px")
    .attr("fill", "black")
    .style("stroke", "black")
    .style("stroke-width", "2")
    .style("pointer-events", "all")
    .on("click", function(datum, index) {
        datum.setSelected(true);
    })
    .each(function(datum, index, nodes) {
        var domElSelection = d3.select(this);
        datum.selectedChanged.add(function() {
            if (datum.getSelected()) {
                domElSelection.style("stroke", "yellow");
            } else {
                domElSelection.style("stroke", "black");
            }
        })
    });
}

NeuralNetworkView.prototype._populateView = function() {

}
