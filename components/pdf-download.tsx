
'use client'
export default function PDFDownload(){
  async function gen(){
    const res = await fetch('/api/pdf', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
      cliente: 'Cliente S.A.', obra: 'Montaje de vigas en viaducto', ciudad: 'Madrid', alcance: ['Vigas 45–70T','Grúa 350T','Radio 22 m','3 noches'], precio: 48500
    }) })
    const blob = await res.blob(); const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='Propuesta-Montaje.pdf'; a.click(); URL.revokeObjectURL(url)
  }
  return <button onClick={gen} className="rounded-xl bg-neutral-800 px-4 py-2 text-sm ring-1 ring-neutral-700 hover:bg-neutral-700">Descargar propuesta PDF</button>
}
