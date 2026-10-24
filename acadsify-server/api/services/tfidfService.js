export class TfidfVectorizer {
  constructor() {
    this.vocabulary = new Map();
    this.idf = [];
  }

  fitTransform(documents) {
    // Build vocabulary
    const termDocCount = new Map();
    documents.forEach(doc => {
      const terms = new Set(doc.split(/\s+/));
      terms.forEach(term => {
        termDocCount.set(term, (termDocCount.get(term) || 0) + 1);
      });
    });

    // Assign index to each term
    let index = 0;
    termDocCount.forEach((_, term) => {
      this.vocabulary.set(term, index++);
    });

    const numDocs = documents.length;
    this.idf = new Array(this.vocabulary.size);

    // Calculate IDF for each term
    this.vocabulary.forEach((idx, term) => {
      const df = termDocCount.get(term);
      this.idf[idx] = Math.log((numDocs + 1) / (df + 1)) + 1;
    });

    // Calculate TF-IDF matrix
    const tfidfMatrix = documents.map(doc => {
      const tf = new Array(this.vocabulary.size).fill(0);
      const terms = doc.split(/\s+/);
      terms.forEach(term => {
        if (this.vocabulary.has(term)) {
          tf[this.vocabulary.get(term)] += 1;
        }
      });
      const maxTf = Math.max(...tf);
      return tf.map((count, idx) => (count / maxTf) * this.idf[idx]);
    });

    return tfidfMatrix;
  }
}
