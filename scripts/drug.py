import requests
import pandas as pd
import time
import sys
import os
import json

RESULT_CACHE_FILE = "result_cache.json"



if os.path.exists(RESULT_CACHE_FILE):
    with open(RESULT_CACHE_FILE, "r") as f:
        result_cache = json.load(f)
else:
    result_cache = {}

gene_symbol_to_ensembl = {
    "BRCA1": "ENSG00000012048",
    "TP53": "ENSG00000141510",
    "EGFR": "ENSG00000146648",
    "PIK3CA": "ENSG00000121879",
    "AKT1": "ENSG00000142208",
    "PTEN": "ENSG00000171862",
    "KRAS": "ENSG00000133703",
    "NRAS": "ENSG00000213281",
    "HRAS": "ENSG00000174775",
    "BRAF": "ENSG00000157764",
    "ERBB2": "ENSG00000141736",
    "CDKN2A": "ENSG00000147889",
    "RB1": "ENSG00000139687",
    "MYC": "ENSG00000136997",
    "MTOR": "ENSG00000198793",
    "CTNNB1": "ENSG00000168036",
    "SMAD4": "ENSG00000141646",
    "APC": "ENSG00000134982",
    "ATM": "ENSG00000149311",
    "BRCA2": "ENSG00000139618",
    "CDH1": "ENSG00000039068",
    "NTRK1": "ENSG00000198400",
    "FGFR1": "ENSG00000077782",
    "IDH1": "ENSG00000138413",
    "VHL": "ENSG00000134086",
    "ERBB4": "ENSG00000178568",
    "GRB7": "ENSG00000106330",
    "NRG1": "ENSG00000157168",
    "ERBIN": "ENSG00000143061",
    "GRB2": "ENSG00000177885",
    "SHC1": "ENSG00000050730",
    "ERBB3": "ENSG00000065361",
    "CD44": "ENSG00000026508",
    "SRC": "ENSG00000197122",
    "SFN": "ENSG00000175793",
    "EP300": "ENSG00000100393",
    "HIF1A": "ENSG00000100644",
    "HDAC1": "ENSG00000116478",
    "HSP90AA1": "ENSG00000080824",
    "MDM4": "ENSG00000117713",
    "CHEK2": "ENSG00000183765",
    "BCL2": "ENSG00000171791",
    "BCL2L1": "ENSG00000171552",
    "MDC1": "ENSG00000180530",
    "PALB2": "ENSG00000083093",
    "RAD50": "ENSG00000113522",
    "BARD1": "ENSG00000138376",
    "MRE11": "ENSG00000161970",
    "ABRAXAS1": "ENSG00000104361",
    "FANCD2": "ENSG00000144554",
    "H2AX": "ENSG00000188486"
}

def fetch_drugs(ensembl_id, gene_symbol):
    url = "https://api.platform.opentargets.org/api/v4/graphql"
    headers = { "Content-Type": "application/json" }

    drug_query = """
    query fetchDrugs($ensemblId: String!) {
      target(ensemblId: $ensemblId) {
        knownDrugs {
          rows {
            drug { name }
            disease { name }
            mechanismOfAction
          }
        }
      }
    }
    """

    payload = {
        "query": drug_query,
        "variables": {"ensemblId": ensembl_id}
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        rows = response.json().get("data", {}).get("target", {}).get("knownDrugs", {}).get("rows", [])
        return [
            {
                "gene": gene_symbol,
                "drug": row.get("drug", {}).get("name", "N/A"),
                "indication": row.get("disease", {}).get("name", "N/A"),
                "mechanism": row.get("mechanismOfAction", "N/A")
            }
            for row in rows
        ]
    except Exception as e:
        print(f"Error fetching drugs for {gene_symbol}: {e}")
        return []

def get_string_id(gene):
    try:
        response = requests.get("https://string-db.org/api/json/resolve", params={"identifier": gene, "species": 9606})
        response.raise_for_status()
        data = response.json()
        return data[0]["stringId"] if data else None
    except Exception as e:
        print(f"Error resolving STRING ID for {gene}: {e}")
        return None

def get_similar_genes(gene):
    string_id = get_string_id(gene)
    if not string_id:
        return []
    try:
        response = requests.get("https://string-db.org/api/json/interaction_partners", params={
            "identifiers": string_id, "species": 9606, "limit": 10
        })
        response.raise_for_status()
        data = response.json()
        return [item.get("preferredName_B").upper() for item in data if item.get("preferredName_B").upper() != gene.upper()]
    except Exception as e:
        print(f"Error fetching similar genes for {gene}: {e}")
        return []

def gather_all_drugs(target_gene=None):
    all_drugs = []

    # Include și gena target dacă nu e deja în dicționar
    symbols = list(gene_symbol_to_ensembl.keys())
    if target_gene and target_gene.upper() not in symbols:
        symbols.append(target_gene.upper())

    for symbol in symbols:
        ensembl = gene_symbol_to_ensembl.get(symbol)
        if not ensembl:
            ensembl = get_ensembl_id_from_symbol(symbol)
            if ensembl:
                gene_symbol_to_ensembl[symbol] = ensembl
        if not ensembl:
            print(f"⚠ Nu s-a putut obține Ensembl ID pentru {symbol}, se trece peste.")
            continue
        drugs = fetch_drugs(ensembl, symbol)
        all_drugs.extend(drugs)

    return pd.DataFrame(all_drugs)

def compute_repurposing_scores(df):
    indication_counts = df.groupby(["gene", "drug"]).size().reset_index(name="indication_count")
    gene_counts = df.groupby("drug")["gene"].nunique().reset_index(name="gene_count")
    merged = pd.merge(indication_counts, gene_counts, on="drug")
    merged["repurposing_score"] = merged["indication_count"] * 10 - (merged["gene_count"] - 1) * 5
    return pd.merge(merged, df.drop_duplicates(subset=["gene", "drug"]), on=["gene", "drug"])

def suggest_for_gene(target_gene, top_n=5):
    if target_gene.upper() in result_cache:
        print(result_cache[target_gene.upper()])
        return pd.DataFrame()  # skip further processing

    df = gather_all_drugs(target_gene)
    repurposing_data = compute_repurposing_scores(df)

    similar_genes = get_similar_genes(target_gene)
    print(f"\n🔬 Genă țintă: {target_gene}")
    print(f"🔁 Gene similare: {', '.join(similar_genes) if similar_genes else 'Niciuna'}")

    is_target = repurposing_data["gene"].str.upper() == target_gene.upper()
    is_similar = repurposing_data["gene"].str.upper().isin([g.upper() for g in similar_genes])
    filtered = repurposing_data[is_target | is_similar].copy()

    filtered["adjusted_score"] = filtered.apply(
        lambda row: row["repurposing_score"] + 20 if row["gene"].upper() == target_gene.upper()
        else row["repurposing_score"] * 0.3, axis=1
    )

    sorted_result = filtered.sort_values(by="adjusted_score", ascending=False)
    result_string = f"\n🎯 Sugestii de medicamente pentru gena {target_gene.upper()} (inclusiv gene similare):\n"
    for i, row in sorted_result.head(top_n).iterrows():
        result_string += f"{row['drug']} — scor: {round(row['adjusted_score'], 2)} | genă: {row['gene']} | indicație: {row['indication']} | mecanism: {row['mechanism']}\n"
    result_cache[target_gene.upper()] = result_string
    with open(RESULT_CACHE_FILE, "w") as f:
        json.dump(result_cache, f)
    print(result_string)

def get_ensembl_id_from_symbol(symbol):
    # Step 1: Search for gene by symbol
    search_url = f"https://mygene.info/v3/query?q={symbol}&species=human"
    try:
        search_response = requests.get(search_url)
        search_response.raise_for_status()
        data = search_response.json()
        if data.get("hits"):
            entrez_id = data["hits"][0].get("_id")
            if not entrez_id:
                print(f"⚠ Nu s-a găsit Entrez ID pentru {symbol}")
                return None

            # Step 2: Get full gene info by Entrez ID
            gene_url = f"https://mygene.info/v3/gene/{entrez_id}"
            gene_response = requests.get(gene_url)
            gene_response.raise_for_status()
            gene_data = gene_response.json()

            ensembl = gene_data.get("ensembl")
            if isinstance(ensembl, list):
                ensembl = ensembl[0].get("gene")
            elif isinstance(ensembl, dict):
                ensembl = ensembl.get("gene")
    except Exception as e:
        print(f"Eroare la obținerea Ensembl ID pentru {symbol}: {e}")
    return None


if __name__ == "_main_":
    if len(sys.argv) < 2:
        print("Utilizare: python combined_repurposing.py <GENA> [top_n]")
        sys.exit(1)

    gene = sys.argv[1]
    top_n = int(sys.argv[2]) if len(sys.argv) > 2 else 5

    suggestions = suggest_for_gene(gene)
