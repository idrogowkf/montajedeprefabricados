import json, textwrap
from html import unescape
from pathlib import Path
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

ROOT=Path(__file__).resolve().parents[2]
CATALOG=ROOT/"research/catalog-approval/catalog.json"
MANIFEST=ROOT/"research/catalog-approval/assets-manifest.json"
OUTPUT=ROOT/"output/pdf/catalogo-aprobacion-montaje-prefabricado.pdf"
W,H=landscape(A4)
RED=HexColor("#D9281C"); DARK=HexColor("#171717"); GRAY=HexColor("#666666"); LIGHT=HexColor("#F2F2F2"); LINE=HexColor("#D9D9D9")
SECTIONS=[("hormigon","HORMIGÓN","Fijación, perforación y montaje"),("acero","ACERO","Corte, mecanizado y montaje estructural"),("madera","MADERA","Uniones y montaje de timber"),("pvc","PVC","Corte, unión e instalación"),("altura","TRABAJOS EN ALTURA","Protección colectiva y acceso seguro"),("epi","EPI","Protección individual profesional")]

def shorten(value,limit):
    value=" ".join(unescape(value).split())
    return value if len(value)<=limit else value[:limit-1].rstrip()+"…"

def brand(c,page_no=None):
    c.setFillColor(DARK);c.rect(0,H-34,W,34,fill=1,stroke=0)
    c.setFillColor(white);c.setFont("Helvetica-Bold",12);c.drawString(28,H-22,"MONTAJE PREFABRICADO")
    c.setFillColor(RED);c.rect(W-174,H-34,174,34,fill=1,stroke=0)
    c.setFillColor(white);c.setFont("Helvetica-Bold",8);c.drawCentredString(W-87,H-21,"CATÁLOGO DE APROBACIÓN")
    if page_no is not None:
        c.setFillColor(GRAY);c.setFont("Helvetica",7);c.drawRightString(W-28,16,f"montajedeprefabricados.com  ·  {page_no}")

def cover(c):
    c.setFillColor(DARK);c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(RED);c.rect(0,0,18,H,fill=1,stroke=0)
    c.setFillColor(white);c.setFont("Helvetica-Bold",15);c.drawString(56,H-70,"MONTAJE PREFABRICADO")
    c.setFillColor(RED);c.setFont("Helvetica-Bold",46);c.drawString(56,H-170,"720")
    c.setFillColor(white);c.setFont("Helvetica-Bold",30);c.drawString(155,H-166,"REFERENCIAS VERIFICADAS")
    c.setFillColor(HexColor("#BBBBBB"));c.setFont("Helvetica",15);c.drawString(58,H-208,"Catálogo técnico para revisión y aprobación previa")
    c.setStrokeColor(HexColor("#444444"));c.line(58,H-242,W-58,H-242)
    y=H-285
    for _,title,subtitle in SECTIONS:
        c.setFillColor(RED);c.circle(66,y+3,3,fill=1,stroke=0)
        c.setFillColor(white);c.setFont("Helvetica-Bold",11);c.drawString(80,y,title)
        c.setFillColor(HexColor("#AAAAAA"));c.setFont("Helvetica",9);c.drawString(245,y,subtitle+" · 120 referencias")
        y-=34
    c.setFillColor(HexColor("#888888"));c.setFont("Helvetica",8);c.drawString(58,38,"Documento de selección. No implica publicación ni oferta comercial.")
    c.showPage()

def section_page(c,title,subtitle,index):
    c.setFillColor(LIGHT);c.rect(0,0,W,H,fill=1,stroke=0);brand(c)
    c.setFillColor(RED);c.setFont("Helvetica-Bold",16);c.drawString(52,H-112,f"0{index}")
    c.setFillColor(DARK);c.setFont("Helvetica-Bold",38);c.drawString(52,H-168,title)
    c.setFillColor(GRAY);c.setFont("Helvetica",15);c.drawString(54,H-202,subtitle)
    c.setStrokeColor(RED);c.setLineWidth(5);c.line(54,H-232,315,H-232)
    c.setFillColor(DARK);c.setFont("Helvetica-Bold",70);c.drawRightString(W-54,88,"120")
    c.setFillColor(GRAY);c.setFont("Helvetica-Bold",11);c.drawRightString(W-56,65,"REFERENCIAS REVISABLES")
    c.showPage()

def button(c,x,y,w,label,url,filled=False):
    c.setFillColor(RED if filled else white);c.setStrokeColor(RED);c.setLineWidth(.8);c.roundRect(x,y,w,18,3,fill=1,stroke=1)
    c.setFillColor(white if filled else RED);c.setFont("Helvetica-Bold",7);c.drawCentredString(x+w/2,y+6,label)
    c.linkURL(url,(x,y,x+w,y+18),relative=0,thickness=0)

def card(c,p,img,x,y,w,h,ordinal):
    c.setFillColor(white);c.setStrokeColor(LINE);c.setLineWidth(.7);c.roundRect(x,y,w,h,6,fill=1,stroke=1)
    c.setFillColor(RED);c.rect(x,y+h-6,w,6,fill=1,stroke=0)
    iw=132;pad=12
    try:c.drawImage(ImageReader(img),x+pad,y+h-126,width=iw,height=94,preserveAspectRatio=True,anchor="c",mask="auto")
    except Exception:pass
    tx=x+pad+iw+12;tw=w-iw-3*pad
    c.setFillColor(RED);c.setFont("Helvetica-Bold",7);c.drawString(tx,y+h-24,f"{ordinal:03d}  ·  {p['manufacturer'].upper()}")
    c.setFillColor(DARK);c.setFont("Helvetica-Bold",10)
    lines=textwrap.wrap(shorten(p["name"],75),width=35)[:2]
    for i,line in enumerate(lines):c.drawString(tx,y+h-42-i*12,line)
    c.setFillColor(GRAY);c.setFont("Helvetica-Bold",7);c.drawString(tx,y+h-72,"REFERENCIA")
    c.setFillColor(DARK);c.setFont("Helvetica",8);c.drawString(tx,y+h-84,shorten(p["reference"],34))
    c.setFillColor(GRAY);c.setFont("Helvetica",7)
    desc=textwrap.wrap(shorten(p["description"],190),width=60)[:3]
    for i,line in enumerate(desc):c.drawString(x+pad,y+h-147-i*9,line)
    c.setFillColor(LIGHT);c.roundRect(x+pad,y+42,w-2*pad,29,3,fill=1,stroke=0)
    c.setFillColor(GRAY);c.setFont("Helvetica-Bold",6.5);c.drawString(x+pad+7,y+59,"APLICACIÓN")
    c.setFillColor(DARK);c.setFont("Helvetica",7);c.drawString(x+pad+7,y+48,shorten(p["applications"][0],82))
    c.setFillColor(GRAY);c.setFont("Helvetica",6.5);c.drawString(x+pad,y+29,shorten(f"Origen: {p['origin']} · Proveedor: {p['supplier']}",95))
    bw=(w-2*pad-8)/2;button(c,x+pad,y+8,bw,"VER PRODUCTO",p["productUrl"]);button(c,x+pad+bw+8,y+8,bw,"ABRIR FICHA PDF",p["pdfUrl"],True)

def product_page(c,items,images,title,page_no,start):
    brand(c,page_no);c.setFillColor(DARK);c.setFont("Helvetica-Bold",11);c.drawString(28,H-51,title)
    c.setFillColor(GRAY);c.setFont("Helvetica",7);c.drawRightString(W-28,H-51,f"Referencias {start+1}–{start+len(items)} de 120")
    margin=28;gap=14;top=H-64;bottom=30;cw=(W-2*margin-gap)/2;ch=(top-bottom-gap)/2
    for i,p in enumerate(items):
        col=i%2;row=i//2;x=margin+col*(cw+gap);y=top-(row+1)*ch-row*gap
        card(c,p,images[p["id"]],x,y,cw,ch,start+i+1)
    c.showPage()

def render():
    products=json.loads(CATALOG.read_text(encoding="utf-8"));manifest=json.loads(MANIFEST.read_text(encoding="utf-8"));images={m["id"]:m["image"] for m in manifest}
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    c=canvas.Canvas(str(OUTPUT),pagesize=(W,H),pageCompression=1)
    c.setTitle("Catálogo de aprobación · Montaje Prefabricado · 720 referencias");c.setAuthor("Montaje Prefabricado")
    cover(c);page_no=2
    for index,(key,title,subtitle) in enumerate(SECTIONS,1):
        section_page(c,title,subtitle,index);page_no+=1
        section=[p for p in products if p["section"]==key]
        for start in range(0,120,4):
            product_page(c,section[start:start+4],images,title,page_no,start);page_no+=1
    c.save();print(f"PDF generado: {OUTPUT}")

if __name__=="__main__":render()
