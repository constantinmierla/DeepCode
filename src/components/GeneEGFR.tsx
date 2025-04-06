import React, { useEffect, useRef } from "react";

const GeneEGFR: React.FC = () => {
  const networkContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (networkContainer.current) {
      const vis = require("vis-network/standalone");

      const nodes = new vis.DataSet([
        { color: "#ff6666", id: "EGF", label: "EGF", shape: "dot" },
        { color: "#ffcc00", id: "EGFR", label: "EGFR", shape: "dot" },
        { color: "#00ccff", id: "TGFA", label: "TGFA", shape: "dot" },
        { color: "#ff6666", id: "AREG", label: "AREG", shape: "dot" },
        { color: "#00ccff", id: "BTC", label: "BTC", shape: "dot" },
        { color: "#00ccff", id: "HBEGF", label: "HBEGF", shape: "dot" },
        { color: "#00ccff", id: "EREG", label: "EREG", shape: "dot" },
        { color: "#ff6666", id: "SHC2", label: "SHC2", shape: "dot" },
        { color: "#00ccff", id: "PLCG1", label: "PLCG1", shape: "dot" },
        { color: "#00ccff", id: "STAT5A", label: "STAT5A", shape: "dot" },
        { color: "#ff6666", id: "CRK", label: "CRK", shape: "dot" },
        { color: "#00ccff", id: "SRC", label: "SRC", shape: "dot" },
        { color: "#ff6666", id: "GRB2", label: "GRB2", shape: "dot" },
        { color: "#00ccff", id: "ERBB4", label: "ERBB4", shape: "dot" },
        { color: "#00ccff", id: "MMP2", label: "MMP2", shape: "dot" },
        { color: "#00ccff", id: "MMP24", label: "MMP24", shape: "dot" },
        { color: "#00ccff", id: "SOS1", label: "SOS1", shape: "dot" },
        { color: "#00ccff", id: "GAB1", label: "GAB1", shape: "dot" },
      ]);

      const edges = new vis.DataSet([
        {
          arrows: "to",
          color: "#00ff00",
          from: "EGF",
          to: "EGFR",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "EGFR",
          to: "SHC2",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "EGFR",
          to: "PLCG1",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "EGFR",
          to: "STAT5A",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "EGFR",
          to: "CRK",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "EGFR",
          to: "SRC",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "EGFR",
          to: "GRB2",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "TGFA",
          to: "EGFR",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "AREG",
          to: "EGFR",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "BTC",
          to: "EGFR",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "BTC",
          to: "ERBB4",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "HBEGF",
          to: "EGFR",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "HBEGF",
          to: "ERBB4",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "EREG",
          to: "EGFR",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "EREG",
          to: "ERBB4",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "SHC2",
          to: "GRB2",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "GRB2",
          to: "SOS1",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "GRB2",
          to: "GAB1",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "MMP2",
          to: "HBEGF",
          title: "activation",
        },
        {
          arrows: "to",
          color: "#00ff00",
          from: "MMP24",
          to: "HBEGF",
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
          zoomView: true, // Allows zooming the view
          hover: true,
        },
        physics: {
          enabled: true,
          stabilization: { enabled: true, fit: true, iterations: 1000 },
          barnesHut: {
            gravitationalConstant: -5000,
            centralGravity: 0.3,
            springLength: 100,
          },
        },
        manipulation: {
          enabled: false,
        },
        zoomMin: 0.1,
        zoomMax: 2,
        layout: {
          randomSeed: 2,
          improvedLayout: true,
        },
      };

      const network = new vis.Network(networkContainer.current, data, options);

      return () => {
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
        style={{ width: "100%", height: "800px" }}
      ></div>
    </div>
  );
};

export default GeneEGFR;
