import json, textwrap
from html import unescape
from pathlib import Path
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

ROOT=Path(__file__).resolve().parents[2]
CATALOG=ROOT/"research/catalog-specialized/catalog.json"
MANIFEST=ROOT/"research/catalog-specialized/assets-manifest.json"
OUTPUT=ROOT/"output/pdf/catalogo-aprobacion-hormigon-elevacion-seguridad.pdf"
W,H=landscape(A4)
RED=HexColor("#D9281C"); DARK=HexColor("#171717"); GRAY=HexColor("#626262"); LIGHT=HexColor("#F2F2F2"); LINE=HexColor("#D8D8D8")
SECTIONS=[
 ("hormigon","ACCESORIOS PARA HORMIGÓN","Anclajes, conexiones y accesorios de montaje",120),
 ("elevacion","ELEVACIÓN Y MANIPULACIÓN","Pinzas, balancines, ganchos y útiles de posicionamiento",60),
 ("altura","TRABAJOS EN ALTURA","Líneas de vida, anclajes y protección colectiva",120),
 ("epi","EQUIPOS DE PROTECCIÓN INDIVIDUAL","Cascos, arneses, retráctiles y rescate",120),
]

def clean(value): return " ".join(unescape(str(value or "")).split())
def shorten(value,limit):
    value=clean(value)
    return value if len(value)<=limit else value[:limit-1].rstrip()+"…"

def header(c,page=None):
    c.setFillColor(DARK);c.rect(0,H-34,W,34,fill=1,stroke=0)
    c.setFillColor(white);c.setFont("Helvetica-Bold",12);c.drawString(28,H-22,"MONTAJE PREFABRICADO")
    c.setFillColor(RED);c.rect(W-190,H-34,190,34,fill=1,stroke=0)
    c.setFillColor(white);c.setFont("Helvetica-Bold",8);c.drawCentredString(W-95,H-21,"CATÁLOGO PARA APROBACIÓN")
    if page is not None:
        c.setFillColor(GRAY);c.setFont("Helvetica",7);c.drawRightString(W-28,15,f"montajedeprefabricados.com  ·  {page}")

def cover(c):
    c.setFillColor(DARK);c.rect(0,0,W,H,fill=1,stroke=0);c.setFillColor(RED);c.rect(0,0,18,H,fill=1,stroke=0)
    c.setFillColor(white);c.setFont("Helvetica-Bold",15);c.drawString(56,H-70,"MONTAJE PREFABRICADO")
    c.setFillColor(RED);c.setFont("Helvetica-Bold",44);c.drawString(56,H-166,"420 REFERENCIAS")
    c.setFillColor(white);c.setFont("Helvetica-Bold",27);c.drawString(57,H-205,"PARA MONTAJE, ELEVACIÓN Y SEGURIDAD")
    c.setFillColor(HexColor("#BDBDBD"));c.setFont("Helvetica",13);c.drawString(58,H-237,"Selección técnica para revisión previa a su incorporación al marketplace")
    c.setStrokeColor(HexColor("#454545"));c.line(58,H-263,W-58,H-263)
    y=H-301
    for _,title,subtitle,count in SECTIONS:
        c.setFillColor(RED);c.circle(66,y+3,3,fill=1,stroke=0)
        c.setFillColor(white);c.setFont("Helvetica-Bold",10);c.drawString(80,y,title)
        c.setFillColor(HexColor("#AAAAAA"));c.setFont("Helvetica",8.5);c.drawString(330,y,f"{subtitle} · {count} referencias")
        y-=38
    c.setFillColor(HexColor("#888888"));c.setFont("Helvetica",8);c.drawString(58,38,"Prioridad de origen: España, Alemania y fabricantes europeos contrastados. No implica publicación ni oferta comercial.")
    c.showPage()

def section_page(c,index,title,subtitle,count):
    c.setFillColor(LIGHT);c.rect(0,0,W,H,fill=1,stroke=0);header(c)
    c.setFillColor(RED);c.setFont("Helvetica-Bold",16);c.drawString(52,H-112,f"0{index}")
    c.setFillColor(DARK);c.setFont("Helvetica-Bold",34);c.drawString(52,H-166,title)
    c.setFillColor(GRAY);c.setFont("Helvetica",14);c.drawString(54,H-202,subtitle)
    c.setStrokeColor(RED);c.setLineWidth(5);c.line(54,H-232,350,H-232)
    c.setFillColor(DARK);c.setFont("Helvetica-Bold",70);c.drawRightString(W-54,88,str(count))
    c.setFillColor(GRAY);c.setFont("Helvetica-Bold",11);c.drawRightString(W-56,65,"REFERENCIAS VERIFICADAS")
    c.showPage()

def button(c,x,y,w,label,url,filled=False):
    c.setFillColor(RED if filled else white);c.setStrokeColor(RED);c.setLineWidth(.9);c.roundRect(x,y,w,18,3,fill=1,stroke=1)
    c.setFillColor(white if filled else RED);c.setFont("Helvetica-Bold",7);c.drawCentredString(x+w/2,y+6,label)
    c.linkURL(url,(x,y,x+w,y+18),relative=0,thickness=0)

def card(c,p,image,x,y,w,h,ordinal):
    c.setFillColor(white);c.setStrokeColor(LINE);c.setLineWidth(.7);c.roundRect(x,y,w,h,6,fill=1,stroke=1)
    c.setFillColor(RED);c.rect(x,y+h-6,w,6,fill=1,stroke=0)
    pad=12; iw=126
    try:c.drawImage(ImageReader(image),x+pad,y+h-126,width=iw,height=91,preserveAspectRatio=True,anchor="c",mask="auto")
    except Exception:pass
    tx=x+pad+iw+12
    c.setFillColor(RED);c.setFont("Helvetica-Bold",7);c.drawString(tx,y+h-23,f"{ordinal:03d} · {shorten(p['manufacturer'].upper(),30)}")
    c.setFillColor(DARK);c.setFont("Helvetica-Bold",9.5)
    for i,line in enumerate(textwrap.wrap(shorten(p["nameEs"],78),width=37)[:2]):c.drawString(tx,y+h-41-i*11,line)
    c.setFillColor(GRAY);c.setFont("Helvetica-Bold",6.5);c.drawString(tx,y+h-70,"REFERENCIA / CAPACIDAD")
    c.setFillColor(DARK);c.setFont("Helvetica",7.5);c.drawString(tx,y+h-82,shorten(f"{p['reference']} · {p['capacityEs']}",43))
    c.setFillColor(GRAY);c.setFont("Helvetica",6.7)
    for i,line in enumerate(textwrap.wrap(shorten(p["descriptionEs"],180),width=65)[:3]):c.drawString(x+pad,y+h-145-i*8.5,line)
    c.setFillColor(LIGHT);c.roundRect(x+pad,y+47,w-2*pad,31,3,fill=1,stroke=0)
    c.setFillColor(GRAY);c.setFont("Helvetica-Bold",6.2);c.drawString(x+pad+7,y+65,"APLICACIÓN")
    c.setFillColor(DARK);c.setFont("Helvetica",6.8);c.drawString(x+pad+7,y+53,shorten(p["applicationEs"],91))
    c.setFillColor(GRAY);c.setFont("Helvetica",6.4);c.drawString(x+pad,y+33,shorten(f"Origen: {p['manufacturingCountry']} · Fuente: {p['supplier']}",100))
    bw=(w-2*pad-8)/2;button(c,x+pad,y+9,bw,"VER FUENTE OFICIAL",p["productUrl"]);button(c,x+pad+bw+8,y+9,bw,"ABRIR FICHA PDF",p["pdfUrl"],True)

def product_page(c,items,images,title,page_no,start,total):
    header(c,page_no);c.setFillColor(DARK);c.setFont("Helvetica-Bold",10.5);c.drawString(28,H-51,title)
    c.setFillColor(GRAY);c.setFont("Helvetica",7);c.drawRightString(W-28,H-51,f"Referencias {start+1}-{start+len(items)} de {total}")
    margin=28;gap=14;top=H-64;bottom=30;cw=(W-2*margin-gap)/2;ch=(top-bottom-gap)/2
    for i,p in enumerate(items):
        col=i%2;row=i//2;x=margin+col*(cw+gap);y=top-(row+1)*ch-row*gap
        card(c,p,images[p["id"]],x,y,cw,ch,start+i+1)
    c.showPage()

def render():
    products=json.loads(CATALOG.read_text(encoding="utf-8"));manifest=json.loads(MANIFEST.read_text(encoding="utf-8"));images={m["id"]:m["image"] for m in manifest}
    OUTPUT.parent.mkdir(parents=True,exist_ok=True);c=canvas.Canvas(str(OUTPUT),pagesize=(W,H),pageCompression=1)
    c.setTitle("Catálogo de aprobación · Hormigón, elevación y seguridad · 420 referencias");c.setAuthor("Montaje Prefabricado")
    cover(c);page_no=2
    for index,(key,title,subtitle,count) in enumerate(SECTIONS,1):
        section_page(c,index,title,subtitle,count);page_no+=1
        section=[p for p in products if p["section"]==key]
        for start in range(0,len(section),4):product_page(c,section[start:start+4],images,title,page_no,start,len(section));page_no+=1
    c.save();print(f"PDF generado: {OUTPUT}")

if __name__=="__main__":render()
