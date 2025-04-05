import sys
import requests
import xml.etree.ElementTree as ET

# NU VA ATINGETI DE NIMIC PLS ! ! ! ! !!  ! ! ! !!!
gene_name = sys.argv[1]


def get_gene_info(gene_name: str):
    gene = gene_name.upper()
    BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
    esearch_url = f"{BASE_URL}esearch.fcgi?db=gene&term={gene}[gene]+AND+Homo+sapiens[orgn]&retmode=json"

    response = requests.get(esearch_url).json()
    if not response["esearchresult"]["idlist"]:
        return None
    gene_id = response["esearchresult"]["idlist"][0]
    esummary_url = f"{BASE_URL}esummary.fcgi?db=gene&id={gene_id}&retmode=json"

    summary_response = requests.get(esummary_url).json()
    gene_info = summary_response["result"][gene_id]

    return gene_info


def get_omim_ids(gene_id: str):
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=gene&id={gene_id}&linkname=gene_omim"
    response = requests.get(url)
    root = ET.fromstring(response.content)
    ids = [elem.text for elem in root.findall(".//LinkSetDb/Link/Id")]
    return ids


def get_disease_names(omim_ids: list):
    if not omim_ids:
        return []
    ids_str = ",".join(omim_ids)
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=omim&id={ids_str}&retmode=json"
    response = requests.get(url)
    if response.status_code != 200:
        return []
    data = response.json()
    disease_names = [
        data["result"][oid]["title"] for oid in omim_ids if oid in data["result"]
    ]

    formatted_disease_names = "\n".join(
        f"{i + 1}. {name}" for i, name in enumerate(disease_names)
    )
    return formatted_disease_names


gen_info = get_gene_info(gene_name)
if gen_info:
    gene_info_data = {
        "fullName": gen_info["description"],  # Using 'description' as full name
        "function": gen_info["summary"],  # Using 'summary' for gene function
        "diseases": get_disease_names(
            get_omim_ids(gen_info["uid"])
        ),  # There is no direct 'diseases' field in the API response
    }
else:
    gene_info_data = {
        "fullName": "No data found for the given gene name.",
        "function": "No data available.",
        "diseases": "No data available.",
    }

print(gene_info_data)