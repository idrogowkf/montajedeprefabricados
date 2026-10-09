import json
import unittest
from pathlib import Path
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[2]
PDF=ROOT/"output/pdf/catalogo-aprobacion-montaje-prefabricado.pdf"

class CatalogPdfTest(unittest.TestCase):
    def test_catalog_pdf_is_complete(self):
        reader=PdfReader(str(PDF))
        text="\n".join(page.extract_text() or "" for page in reader.pages)
        self.assertEqual(len(reader.pages),187)
        self.assertIn("720",text)
        self.assertIn("REFERENCIAS VERIFICADAS",text)
        for label in ["HORMIG","ACERO","MADERA","PVC","TRABAJOS EN ALTURA","EPI"]:
            self.assertIn(label,text)
        self.assertGreaterEqual(sum(1 for page in reader.pages for annotation in (page.get("/Annots") or [])),1440)

if __name__=="__main__": unittest.main()
