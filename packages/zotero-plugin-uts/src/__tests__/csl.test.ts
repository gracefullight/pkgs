import { Cite, plugins } from "@citation-js/core";
import { beforeAll, describe, expect, it } from "vitest";
import "@citation-js/plugin-csl";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const cslPath = join(__dirname, "../../addon/uts-apa.csl");
const cslTemplate = readFileSync(cslPath, "utf-8");

describe("UTS APA 7th CSL Formatting", () => {
  beforeAll(() => {
    const config = plugins.config.get("@csl");
    config.templates.add("uts-apa-7th", cslTemplate);
  });

  describe("Journal Article", () => {
    it("should format a basic journal article correctly", () => {
      const input = {
        type: "article-journal",
        author: [
          { family: "Smith", given: "John" },
          { family: "Doe", given: "Jane" },
        ],
        title: "Understanding the impact of climate change on biodiversity",
        "container-title": "Journal of Environmental Science",
        volume: "45",
        issue: "3",
        page: "123-145",
        issued: { "date-parts": [[2023, 6, 15]] },
        DOI: "10.1234/jes.2023.45.3.123",
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Smith, J.");
      expect(bibliography).toContain("Doe, J.");
      expect(bibliography).toContain("(2023)");
      expect(bibliography).toContain("Understanding the impact of climate change on biodiversity");
      expect(bibliography).toContain("Journal of Environmental Science");
      expect(bibliography).toContain("45");
      expect(bibliography).toContain("3");
      expect(bibliography).toContain("123–145");
    });

    it("should format a journal article with 3-20 authors correctly", () => {
      const input = {
        type: "article-journal",
        author: [
          { family: "Anderson", given: "Alice" },
          { family: "Brown", given: "Bob" },
          { family: "Clark", given: "Carol" },
        ],
        title: "Multi-author research on neural networks",
        "container-title": "AI Research Quarterly",
        volume: "12",
        issue: "2",
        page: "45-67",
        issued: { "date-parts": [[2024, 3]] },
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Anderson, A.");
      expect(bibliography).toContain("Brown, B.");
      expect(bibliography).toContain("Clark, C.");
      expect(bibliography).toContain("(2024)");
    });

    it("should format a journal article with 21+ authors (et al.) correctly", () => {
      const authors = Array.from({ length: 21 }, (_, i) => ({
        family: `Author${i + 1}`,
        given: `First${i + 1}`,
      }));

      const input = {
        type: "article-journal",
        author: authors,
        title: "Large collaborative study on genetics",
        "container-title": "Nature Genetics",
        volume: "55",
        issue: "1",
        page: "1-15",
        issued: { "date-parts": [[2023, 1]] },
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Author1, F.");
      expect(bibliography).toMatch(/Author1.*…/);
    });
  });

  describe("Book", () => {
    it("should format a basic book correctly", () => {
      const input = {
        type: "book",
        author: [{ family: "Johnson", given: "Michael" }],
        title: "The Art of Scientific Writing",
        publisher: "Academic Press",
        "publisher-place": "New York, NY",
        issued: { "date-parts": [[2022]] },
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Johnson, M.");
      expect(bibliography).toContain("(2022)");
      expect(bibliography).toContain("The Art of Scientific Writing");
      expect(bibliography).toContain("Academic Press");
    });

    it("should format an edited book correctly", () => {
      const input = {
        type: "book",
        editor: [
          { family: "Williams", given: "Sarah" },
          { family: "Jones", given: "David" },
        ],
        title: "Handbook of Modern Psychology",
        edition: "3rd",
        publisher: "Psychology Press",
        "publisher-place": "London, UK",
        issued: { "date-parts": [[2021]] },
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Williams, S.");
      expect(bibliography).toContain("Jones, D.");
      expect(bibliography).toContain("(Eds.)");
      expect(bibliography).toContain("(2021)");
      expect(bibliography).toContain("Handbook of Modern Psychology");
    });

    it("should format a book with edition correctly", () => {
      const input = {
        type: "book",
        author: [{ family: "Miller", given: "Robert" }],
        title: "Introduction to Statistics",
        edition: "5th",
        publisher: "Pearson",
        "publisher-place": "Boston, MA",
        issued: { "date-parts": [[2020]] },
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Miller, R.");
      expect(bibliography).toContain("(2020)");
      expect(bibliography).toContain("Introduction to Statistics");
      expect(bibliography).toContain("5th");
    });
  });

  describe("Book Chapter", () => {
    it("should format a book chapter correctly", () => {
      const input = {
        type: "chapter",
        author: [{ family: "Davis", given: "Emily" }],
        title: "Cognitive development in early childhood",
        "container-title": "Developmental Psychology: A Comprehensive Guide",
        editor: [
          { family: "Wilson", given: "Thomas" },
          { family: "Garcia", given: "Maria" },
        ],
        page: "156-178",
        publisher: "Academic Publishers",
        "publisher-place": "San Francisco, CA",
        issued: { "date-parts": [[2023]] },
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Davis, E.");
      expect(bibliography).toContain("(2023)");
      expect(bibliography).toContain("Cognitive development in early childhood");
      expect(bibliography).toContain("In T. Wilson");
      expect(bibliography).toContain("M. Garcia");
      expect(bibliography).toContain("(Eds.)");
      expect(bibliography).toContain("156–178");
    });
  });

  describe("Webpage", () => {
    it("should format a webpage correctly", () => {
      const input = {
        type: "webpage",
        author: [{ family: "Thompson", given: "Lisa" }],
        title: "Understanding APA 7th Edition",
        "container-title": "Academic Writing Blog",
        URL: "https://example.com/apa-guide",
        issued: { "date-parts": [[2023, 8, 12]] },
        accessed: { "date-parts": [[2024, 1, 15]] },
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Thompson, L.");
      expect(bibliography).toContain("(2023, August 12)");
      expect(bibliography).toContain("Understanding APA 7th Edition");
      expect(bibliography).toContain("https://example.com/apa-guide");
    });

    it("should format a webpage with organization as author", () => {
      const input = {
        type: "webpage",
        author: [{ literal: "American Psychological Association" }],
        title: "Publication Manual of the American Psychological Association",
        URL: "https://apastyle.apa.org/",
        issued: { "date-parts": [[2020]] },
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("American Psychological Association");
      expect(bibliography).toContain("(2020)");
    });
  });

  describe("Conference Paper", () => {
    it("should format a conference paper correctly", () => {
      const input = {
        type: "paper-conference",
        author: [
          { family: "Lee", given: "Kevin" },
          { family: "Park", given: "Soojin" },
        ],
        title: "Machine learning applications in healthcare",
        "container-title": "Proceedings of the International Conference on Health Informatics",
        page: "234-239",
        publisher: "IEEE",
        "publisher-place": "Seoul, Korea",
        issued: { "date-parts": [[2023, 7]] },
        event: "International Conference on Health Informatics",
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Lee, K.");
      expect(bibliography).toContain("Park, S.");
      expect(bibliography).toContain("(2023)");
      expect(bibliography).toContain("Machine learning applications in healthcare");
    });
  });

  describe("Thesis/Dissertation", () => {
    it("should format a doctoral dissertation correctly", () => {
      const input = {
        type: "thesis",
        author: [{ family: "Chen", given: "Wei" }],
        title: "Advanced algorithms for data mining",
        genre: "Doctoral dissertation",
        publisher: "Stanford University",
        "publisher-place": "Stanford, CA",
        issued: { "date-parts": [[2022]] },
        URL: "https://purl.stanford.edu/abc123",
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Chen, W.");
      expect(bibliography).toContain("(2022)");
      expect(bibliography).toContain("Advanced algorithms for data mining");
      expect(bibliography).toContain("[Doctoral dissertation");
      expect(bibliography).toContain("Stanford University");
    });

    it("should format a master's thesis correctly", () => {
      const input = {
        type: "thesis",
        author: [{ family: "Martinez", given: "Carlos" }],
        title: "Urban planning strategies for sustainable cities",
        genre: "Master's thesis",
        publisher: "MIT",
        "publisher-place": "Cambridge, MA",
        issued: { "date-parts": [[2023]] },
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Martinez, C.");
      expect(bibliography).toContain("(2023)");
      expect(bibliography).toContain("[Master");
    });
  });

  describe("Report", () => {
    it("should format a technical report correctly", () => {
      const input = {
        type: "report",
        author: [{ literal: "National Institute of Standards and Technology" }],
        title: "Cybersecurity framework version 2.0",
        number: "NIST CSWP 29",
        publisher: "U.S. Department of Commerce",
        "publisher-place": "Gaithersburg, MD",
        issued: { "date-parts": [[2024, 2]] },
        URL: "https://doi.org/10.6028/NIST.CSWP.29",
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("National Institute of Standards and Technology");
      expect(bibliography).toContain("(2024)");
      expect(bibliography).toContain("Cybersecurity framework version 2.0");
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing author (use title)", () => {
      const input = {
        type: "book",
        title: "Anonymous Work on Philosophy",
        publisher: "Unknown Publisher",
        issued: { "date-parts": [[1900]] },
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Anonymous Work on Philosophy");
      expect(bibliography).toContain("(1900)");
    });

    it("should handle no date (n.d.)", () => {
      const input = {
        type: "webpage",
        author: [{ family: "Taylor", given: "Mark" }],
        title: "Ongoing Research Project",
        URL: "https://example.com/research",
      };

      const cite = new Cite(input);
      const bibliography = cite.format("bibliography", {
        template: "uts-apa-7th",
        lang: "en-US",
      });

      expect(bibliography).toContain("Taylor, M.");
      expect(bibliography).toContain("(n.d.)");
      expect(bibliography).toContain("Ongoing Research Project");
    });
  });
});
