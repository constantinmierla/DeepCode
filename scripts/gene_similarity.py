import requests
from sentence_transformers import SentenceTransformer, util

class GeneSimilarity:
    def __init__(self, base_url="https://eutils.ncbi.nlm.nih.gov/entrez/eutils/", model_name='all-MiniLM-L6-v2'):
        # Initialize the NLP model
        self.model = SentenceTransformer(model_name)
        self.base_url = base_url

    def _get_gene_summary(self, gene_id):
        """Get details about a gene using esummary."""
        esummary_url = f"{self.base_url}esummary.fcgi?db=gene&id={gene_id}&retmode=json"
        response = requests.get(esummary_url).json()
        return response["result"].get(gene_id, {})

    def _get_all_genes(self, max_results=100):
        """Get the list of Homo sapiens genes."""
        all_genes_url = f"{self.base_url}esearch.fcgi?db=gene&term=Homo+sapiens[orgn]&retmax={max_results}&retmode=json"
        response = requests.get(all_genes_url).json()
        return response["esearchresult"]["idlist"]

    def get_top_similar_genes(self, gene_name, max_results=5):
        """Get the top 'max_results' genes most similar to the given gene."""
        # Step 1: Get the gene ID of the given gene
        esearch_url = f"{self.base_url}esearch.fcgi?db=gene&term={gene_name}[gene]+AND+Homo+sapiens[orgn]&retmode=json"
        response = requests.get(esearch_url).json()
        gene_id = response["esearchresult"]["idlist"][0]

        # Step 2: Get the summary of the reference gene
        gene_info = self._get_gene_summary(gene_id)
        if not gene_info.get("summary"):
            print(f"The gene {gene_name} does not have a summary available.")
            return []

        # Step 3: Get all other genes
        other_ids = self._get_all_genes()
        other_ids = [gid for gid in other_ids if gid != gene_id]
        
        # Step 4: Get the summary for all the other genes
        id_string = ",".join(other_ids)
        esummary_url = f"{self.base_url}esummary.fcgi?db=gene&id={id_string}&retmode=json"
        all_summaries = requests.get(esummary_url).json()["result"]

        # Step 5: Calculate similarity using NLP
        brca1_emb = self.model.encode(gene_info["summary"], convert_to_tensor=True)
        similarities = []

        for gid in other_ids:
            gene_info = all_summaries.get(gid)
            if not gene_info or not gene_info.get("summary"):
                continue
            emb = self.model.encode(gene_info["summary"], convert_to_tensor=True)
            score = float(util.pytorch_cos_sim(brca1_emb, emb))
            similarities.append((gid, gene_info["name"], gene_info["description"], score))

        # Step 6: Sort genes by score and return the top 'max_results'
        similarities.sort(key=lambda x: x[3], reverse=True)
        top_matches = similarities[:max_results]

        # Return the most similar genes
        return top_matches

# Example usage
if __name__ == "__main__":
    gene_similarity = GeneSimilarity()

    # Get the top 5 most similar genes to BRCA1
    similar_genes = gene_similarity.get_top_similar_genes("BRCA1", max_results=5)

    # Display the results
    print("The most similar genes to BRCA1:")
    for gid, name, desc, score in similar_genes:
        print(f"- {name} ({desc}), similarity score: {score:.4f}")
