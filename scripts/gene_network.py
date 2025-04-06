import requests
import sys
import re
import json
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
import networkx as nx
from pyvis.network import Network
import os

gene_name_cache = {}
gene_id_cache = {}

def load_cache():
    global gene_name_cache, gene_id_cache
    try:
        with open('gene_cache.json', 'r') as f:
            cache = json.load(f)
            gene_name_cache = cache.get('gene_name_cache', {})
            gene_id_cache = cache.get('gene_id_cache', {})
    except FileNotFoundError:
        gene_name_cache = {}
        gene_id_cache = {}

def save_cache():
    with open('gene_cache.json', 'w') as f:
        json.dump({'gene_name_cache': gene_name_cache, 'gene_id_cache': gene_id_cache}, f)

def get_kegg_gene_name(gene_id):
    if gene_id in gene_name_cache:
        return gene_name_cache[gene_id]
    url = f"https://rest.kegg.jp/get/hsa:{gene_id}"
    response = requests.get(url)
    if response.status_code == 200:
        for line in response.text.splitlines():
            if line.startswith("SYMBOL"):
                gene_name = line.split("SYMBOL")[1].strip().split(",")[0]
                gene_name_cache[gene_id] = gene_name
                save_cache()
                return gene_name
    gene_name_cache[gene_id] = gene_id
    save_cache()
    return gene_id

def get_kegg_gene_id(gene_symbol):
    if gene_symbol in gene_id_cache:
        return gene_id_cache[gene_symbol]
    url = f"https://rest.kegg.jp/find/genes/{gene_symbol}"
    response = requests.get(url)
    if response.status_code == 200:
        lines = response.text.strip().split("\n")
        for line in lines:
            if line.startswith("hsa:"):
                parts = line.split('\t')
                if len(parts) >= 2:
                    symbols = parts[1].split(",")[0].split(";")[0].strip().upper().split()
                    if gene_symbol.upper() == symbols[0]:
                        print(f"✅ Found exact KEGG ID match: {parts[0]}")
                        gene_id_cache[gene_symbol] = parts[0]
                        save_cache()
                        return parts[0]
        for line in lines:
            if line.startswith("hsa:"):
                parts = line.split('\t')
                if len(parts) >= 2:
                    if gene_symbol.upper() in parts[1].upper():
                        print(f"✅ Found KEGG ID (partial match): {parts[0]}")
                        gene_id_cache[gene_symbol] = parts[0]
                        save_cache()
                        return parts[0]
    print(f"❌ No KEGG ID found for {gene_symbol}")
    gene_id_cache[gene_symbol] = None
    save_cache()
    return None

def get_gene_pathways_and_elements(kegg_id):
    url = f"https://rest.kegg.jp/get/{kegg_id}"
    response = requests.get(url)
    if response.status_code != 200:
        print(f"❌ Failed to get KEGG page for {kegg_id}")
        return None, []
    element_ids = []
    pathways = []
    reading_element = False
    reading_pathway = False
    for line in response.text.splitlines():
        line = line.strip()
        if line.startswith("ELEMENT"):
            reading_element = True
            reading_pathway = False
            parts = line.replace("ELEMENT", "").strip().split()
            if parts:
                element_ids.append(parts[0])
            continue
        elif line.startswith("PATHWAY"):
            reading_pathway = True
            reading_element = False
            parts = line.replace("PATHWAY", "").strip().split()
            if parts:
                pathways.append(parts[0])
            continue
        elif line and line[0].isalpha() and ":" not in line[:10] and line[0].isupper():
            reading_element = False
            reading_pathway = False
            continue
        if reading_element and line.strip():
            parts = line.strip().split()
            if parts:
                element_ids.append(parts[0])
        if reading_pathway and line.strip():
            parts = line.strip().split()
            if parts:
                pathways.append(parts[0])
    if element_ids:
        print(f"🔎 Found {len(element_ids)} ELEMENT IDs: {', '.join(element_ids[:3])}...")
    else:
        print("⚠️ No ELEMENT IDs found in gene entry")
    return element_ids, pathways

def get_relation_from_element(element_id):
    element_url = f"https://rest.kegg.jp/get/{element_id}"
    element_response = requests.get(element_url)
    if element_response.status_code != 200:
        print(f"❌ Failed to get data for ELEMENT {element_id}")
        return None
    relations = []
    for line in element_response.text.splitlines():
        if line.startswith("DEFINITION"):
            definition = line.replace("DEFINITION", "").strip()
            matches = re.findall(r'\b([A-Z0-9]+)\s*=>\s*([A-Z0-9]+)\b', definition)
            if matches:
                found = []
                for g1, g2 in matches:
                    name1 = get_kegg_gene_name(g1)
                    name2 = get_kegg_gene_name(g2)
                    relation = f"{name1} => {name2}"
                    print(f"🧠 Found relation in definition: {relation}")
                    found.append(relation)
                return found
            else:
                print(f"⚠️ No simple relation pattern found in definition")
    return None

def parse_pathway_for_relations(pathway_id, target_gene=None):
    url = f"https://rest.kegg.jp/get/{pathway_id}/kgml"
    response = requests.get(url)
    if response.status_code != 200:
        return []
    soup = BeautifulSoup(response.text, "xml")
    entry_map = {}
    for entry in soup.find_all("entry"):
        if entry.get("type") == "gene":
            entry_map[entry.get("id")] = entry.get("name").replace("hsa:", "")
    relations = []
    for rel in soup.find_all("relation"):
        entry1 = rel.get("entry1")
        entry2 = rel.get("entry2")
        subtype = rel.find("subtype")
        if subtype and subtype.get("name") in ["activation", "inhibition"]:
            g1 = entry_map.get(entry1)
            g2 = entry_map.get(entry2)
            if g1 and g2:
                if target_gene is None or target_gene in [g1, g2]:
                    name1 = get_kegg_gene_name(g1)
                    name2 = get_kegg_gene_name(g2)
                    relation_type = subtype.get("name")
                    relations.append((name1, name2, relation_type))
    return relations

def get_gene_network(gene_symbol, verbose=True):
    json_filename = f"{gene_symbol}_gene_relations.json"
    if os.path.exists(json_filename):
        print(f"📁 Found existing file {json_filename}, loading from it...")
        with open(json_filename, "r") as f:
            existing_data = json.load(f)
        return [f"{rel['source']} => {rel['target']}" for rel in existing_data.get("relations", [])]
    
    if gene_symbol.upper() == "TP53":
        kegg_id = "hsa:7157"
        print(f"✅ Using known KEGG ID for TP53: {kegg_id}")
    else:
        kegg_id = get_kegg_gene_id(gene_symbol)
    if not kegg_id:
        return []
    element_ids, pathways = get_gene_pathways_and_elements(kegg_id)
    relations = []
    seen_pairs = set()

    for element_id in element_ids[:3]:
        rels = get_relation_from_element(element_id)
        if rels:
            for rel in rels:
                parts = rel.split(" => ")
                if parts[0] != parts[1] and (parts[0], parts[1]) not in seen_pairs:
                    relations.append((parts[0], parts[1], "activation"))
                    seen_pairs.add((parts[0], parts[1]))
    
    if len(relations) < 8 and pathways:
        print(f"ℹ️ Not enough relations found through ELEMENT. Trying parallel KGML fallback...")
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = {executor.submit(parse_pathway_for_relations, pw, kegg_id.replace("hsa:", "")): pw for pw in pathways[:10]}
            for future in as_completed(futures):
                result = future.result()
                if result:
                    print(f"✅ Found {len(result)} relations in {futures[future]}")
                    relations.extend(result)
                if len(relations) >= 8:
                    break
        if not relations:
            print("❌ Still no relations found after KGML fallback.")
    
    # Adăugăm extinderea rețelei cu genele din relațiile deja extrase
    expanded_genes = set(g for r in relations for g in r[:2])
    expanded_genes.discard(gene_symbol.upper())
    explored = set()

    seen_pairs = set((src, dst) for src, dst, _ in relations)

    for g in list(expanded_genes):
        if len(seen_pairs) >= 20:
            break
        if g.upper() not in explored:
            explored.add(g.upper())
            gene_kegg_id = get_kegg_gene_id(g)
            if gene_kegg_id:
                _, g_pathways = get_gene_pathways_and_elements(gene_kegg_id)
                with ThreadPoolExecutor(max_workers=2) as executor:
                    futures = {
                        executor.submit(parse_pathway_for_relations, pw, gene_kegg_id.replace("hsa:", "")): pw
                        for pw in g_pathways[:5]
                    }
                    for future in as_completed(futures):
                        new_rels = future.result()
                        if new_rels:
                            print(f"🔁 Extra relations from {g}: {len(new_rels)} found")
                            for rel in new_rels:
                                if (rel[0], rel[1]) not in seen_pairs and rel[0] != rel[1]:
                                    relations.append(rel)
                                    seen_pairs.add((rel[0], rel[1]))
                                    if len(seen_pairs) >= 20:
                                        break
                        if len(seen_pairs) >= 20:
                            break

    similar_genes = list(set(g for r in relations for g in r[:2]) - {gene_symbol.upper()})
    
    # Convertim relațiile în format string pentru vizualizare
    string_relations = [f"{src} => {dst}" for src, dst, rel_type in relations]
    
    # Salvăm relațiile în format JSON
    save_relations_to_json(relations, gene_symbol)
    
    # Vizualizăm rețeaua de gene
    visualize_gene_network(relations, gene_symbol, similar_genes[:5])
    
    return string_relations

def save_relations_to_json(relations, central_gene):
    # Transformăm relațiile într-un format JSON mai detaliat
    json_relations = []
    for source, target, relation_type in relations:
        json_relations.append({
            "source": source,
            "target": target,
            "type": relation_type
        })
    
    # Creăm obiectul JSON final
    network_data = {
        "central_gene": central_gene,
        "relations": json_relations,
        "stats": {
            "total_relations": len(json_relations),
            "unique_genes": len(set([gene for relation in relations for gene in relation[:2]]))
        }
    }
    
    # Salvăm în fișier
    filename = f"{central_gene}_gene_relations.json"
    with open(filename, 'w') as f:
        json.dump(network_data, f, indent=2)
    
    print(f"✅ Relationships exported to {filename}")
    return filename

def visualize_gene_network(relations, central_gene, similar_genes=[]):
    G = nx.DiGraph()

    for src, dst, rel_type in relations:
        G.add_edge(src, dst, relation=rel_type)

    net = Network(height="700px", width="100%", directed=True, notebook=False)

    for node in G.nodes:
        color = "#ffcc00" if node.upper() == central_gene.upper() else "#00ccff"
        if node.upper() in [g.upper() for g in similar_genes]:
            color = "#ff6666"
        net.add_node(node, label=node, color=color)

    for src, dst in G.edges:
        edge_data = G.get_edge_data(src, dst)
        relation_type = edge_data.get('relation', 'unknown')
        color = "#00ff00" if relation_type == "activation" else "#ff0000" 
        net.add_edge(src, dst, title=relation_type, color=color)

    net.write_html("gene_network.html")
    print("✅ Network written to gene_network.html. Deschide-l în browser.")

if __name__ == "__main__":
    load_cache()
    
    if len(sys.argv) < 2:
        print("Usage: python script.py GENE_SYMBOL")
        sys.exit(1)
    gene = sys.argv[1]
    print(f"🔍 Looking up gene: {gene}")
    network = get_gene_network(gene, verbose=True)
    if network:
        print(f"\n📊 Final interacting genes for {gene}: {network}")
    else:
        print(f"\n❌ No gene relationships found for {gene}")
    save_cache()