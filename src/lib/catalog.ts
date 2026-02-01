export type Company = {
  slug: string;
  name: string;
  tagline: string;
};

export type PdfProduct = {
  id: string;
  companySlug: string;
  title: string;
  description: string;
  priceInr: number;
  pages: number;
  updatedAt: string; // ISO date
  /**
   * Path under /public. In production you should NOT expose raw PDFs publicly;
   * serve them through an authenticated route and render pages server-side or via signed URLs.
   */
  samplePublicPath?: string;
  pdfPublicPath?: string;
};

export const companies: Company[] = [
  {
    slug: "amazon",
    name: "Amazon",
    tagline: "OA + interview question sets, curated",
  },
  {
    slug: "google",
    name: "Google",
    tagline: "Patterns, topics, and past-year sets",
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    tagline: "Placement-focused questions with solutions",
  },
];

export const pdfProducts: PdfProduct[] = [
  {
    id: "amz-oa-2026",
    companySlug: "amazon",
    title: "Amazon OA Question Pack (2026)",
    description:
      "Topic-wise OA questions with difficulty labels and quick approaches.",
    priceInr: 0,
    pages: 82,
    updatedAt: "2026-01-15",
    pdfPublicPath: "/pdfs/project_report_dsa.pdf",
  },
  {
    id: "gcp-dsa-sets",
    companySlug: "google",
    title: "Google DSA Sets — Company Patterns",
    description:
      "A compact set of must-know patterns + high-signal questions.",
    priceInr: 249,
    pages: 96,
    updatedAt: "2026-01-10",
    pdfPublicPath: "/pdfs/demo.pdf",
  },
  {
    id: "msft-core",
    companySlug: "microsoft",
    title: "Microsoft Placement Core Pack",
    description:
      "Core DSA + CS fundamentals question lists, structured for revision.",
    priceInr: 179,
    pages: 70,
    updatedAt: "2026-01-05",
    pdfPublicPath: "/pdfs/demo.pdf",
  },
];

export function getCompany(slug: string) {
  return companies.find((c) => c.slug === slug) ?? null;
}

export function getProductsForCompany(companySlug: string) {
  return pdfProducts.filter((p) => p.companySlug === companySlug);
}

export function getProduct(id: string) {
  return pdfProducts.find((p) => p.id === id) ?? null;
}

