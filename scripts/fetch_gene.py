import requests
import json


gene = "BRCA1"
BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
esearch_url = f"{BASE_URL}esearch.fcgi?db=gene&term={gene}[gene]+AND+Homo+sapiens[orgn]&retmode=json"

response = requests.get(esearch_url).json()
gene_id = response["esearchresult"]["idlist"][0]
esummary_url = f"{BASE_URL}esummary.fcgi?db=gene&id={gene_id}&retmode=json"

summary_response = requests.get(esummary_url).json()
gene_info = summary_response["result"][gene_id]

# print in a file the gene_info
with open("gene_info.txt", "w") as file:
    file.write(json.dumps(gene_info, indent=4))

# gene_name = input("Enter the gene name (e.g., BRCA1): ").strip().upper()
gene_name = "BRCA1"

# For now, we check if gene_name matches our mock
if gene_name == gene_info["name"]:
    print(f"\n🔎 Gene: {gene_info['name']}")
    print(f"🧬 Full Name: {gene_info['description']}")
    print(f"🧠 Biological Function:\n{gene_info['summary']}")
    print(f"🧾 Associated Disease MIM IDs: {', '.join(gene_info['mim'])}")
else:
    print("❌ Gene not found in the mock data.")
