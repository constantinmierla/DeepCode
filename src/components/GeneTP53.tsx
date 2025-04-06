import React, { useEffect, useRef } from "react";

const GeneTP53: React.FC = () => {
  const networkContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (networkContainer.current) {
      // Import vis-network if it's not globally available
      const vis = require("vis-network/standalone");

      // Define all nodes
      const nodes = new vis.DataSet([
        { color: "#ffcc00", id: "TP53", label: "TP53", shape: "dot" },
        { color: "#00ccff", id: "CDKN1A", label: "CDKN1A", shape: "dot" },
        { color: "#00ccff", id: "CASP8", label: "CASP8", shape: "dot" },
        { color: "#00ccff", id: "MDM2", label: "MDM2", shape: "dot" },
        { color: "#00ccff", id: "ATM", label: "ATM", shape: "dot" },
        { color: "#00ccff", id: "CDKN2A", label: "CDKN2A", shape: "dot" },
        { color: "#00ccff", id: "CDKN2C", label: "CDKN2C", shape: "dot" },
        { color: "#00ccff", id: "CDKN1B", label: "CDKN1B", shape: "dot" },
        { color: "#ff6666", id: "CDK4", label: "CDK4", shape: "dot" },
        { color: "#ff6666", id: "MYC", label: "MYC", shape: "dot" },
        { color: "#00ccff", id: "MAPK14", label: "MAPK14", shape: "dot" },
        { color: "#ff6666", id: "RRAS2", label: "RRAS2", shape: "dot" },
        { color: "#ff6666", id: "FADD", label: "FADD", shape: "dot" },
        { color: "#00ccff", id: "CASP3", label: "CASP3", shape: "dot" },
        { color: "#00ccff", id: "BID", label: "BID", shape: "dot" },
        { color: "#00ccff", id: "CASP7", label: "CASP7", shape: "dot" },
        { color: "#ff6666", id: "CFLAR", label: "CFLAR", shape: "dot" },
        { color: "#00ccff", id: "GZMB", label: "GZMB", shape: "dot" },
        { color: "#00ccff", id: "CASP6", label: "CASP6", shape: "dot" },
      ]);

      // Define all edges
      const edges = new vis.DataSet([
        {
          arrows: "to",
          color: "#00ff00",
          from: "TP53",
          to: "CDKN1A",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "TP53",
          to: "CDKN2A",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "TP53",
          to: "CDKN2C",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "TP53",
          to: "CDKN1B",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "CASP8",
          to: "TP53",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "CASP8",
          to: "ATM",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "CASP8",
          to: "CASP3",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "CASP8",
          to: "BID",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "CASP8",
          to: "CASP7",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "CASP8",
          to: "CASP6",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#ff0000",
          from: "MDM2",
          to: "TP53",
          title: "inhibition",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "ATM",
          to: "TP53",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#ff0000",
          from: "CDKN2A",
          to: "MDM2",
          title: "inhibition",
        },
        {
          arrows: "to",
          color: "#ff0000",
          from: "CDKN2A",
          to: "CDK4",
          title: "inhibition",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "MYC",
          to: "CDKN2A",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "MAPK14",
          to: "CDKN2A",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "RRAS2",
          to: "CDKN2A",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "FADD",
          to: "CASP8",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#ff0000",
          from: "CFLAR",
          to: "CASP8",
          title: "inhibition",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "GZMB",
          to: "CASP8",
          title: "activation",
        },
      ]);

      // Prepare the data and options
      const data = { nodes, edges };
      const options = {
        configure: { enabled: false },
        edges: {
          color: { inherit: true },
          smooth: { enabled: true, type: "dynamic" },
        },
        interaction: {
          dragNodes: true,
          hideEdgesOnDrag: false,
          hideNodesOnDrag: false,
        },
        physics: {
          enabled: true,
          stabilization: { enabled: true, fit: true, iterations: 1000 },
        },
        layout: { randomSeed: 2 },
      };

      // Initialize the network
      const network = new vis.Network(networkContainer.current, data, options);

      return () => {
        // Cleanup when component unmounts
        if (network) {
          network.destroy();
        }
      };
    }
  }, []);

  return (
    <div className="card" style={{ width: "100%" }}>
      <div
        id="mynetwork"
        ref={networkContainer}
        className="card-body"
        style={{ width: "100%", height: "800px" }} // Adjusted height here
      ></div>
    </div>
  );
};

export default GeneTP53;
