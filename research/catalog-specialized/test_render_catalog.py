import unittest
from pathlib import Path
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[2]
PDF=ROOT/"output/pdf/catalogo-aprobacion-hormigon-elevacion-seguridad.pdf"

class SpecializedCatalogPdfTest(unittest.TestCase):
    def test_catalog_pdf_is_complete(self):
        reader=PdfReader(str(PDF))
        text="\n".join(page.extract_text() or "" for page in reader.pages)
        self.assertEqual(len(reader.pages),110)
        self.assertIn("420 REFERENCIAS",text)
        for label in ["ACCESORIOS PARA HORMIG", "ELEVACI", "TRABAJOS EN ALTURA", "EQUIPOS DE PROTECCI"]:
            self.assertIn(label,text)
        self.assertGreaterEqual(sum(len(page.get("/Annots") or []) for page in reader.pages),840)

if __name__=="__main__": unittest.main()
