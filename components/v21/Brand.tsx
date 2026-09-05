export default function Brand({ footer = false }: { footer?: boolean }) {
  return <a className="v21-brand" href="/#inicio" aria-label="Montaje Prefabricado, inicio">
    <svg className="brand-symbol mp-logo" viewBox="0 0 82 54" role="img" aria-label="MP">
      <polygon className="m1" points="1,46 19,8 35,8 43,24 50,8 66,8 46,46 31,46 23,30 16,46" />
      <path className="m2" d="M51 8h18c8 0 12 4 12 11s-4 12-12 12h-7l-7 15H40l18-38h-7zm13 9-3 7h7c3 0 4-1 4-4 0-2-1-3-4-3h-4z" />
      <polygon className="cut" points="23,30 29,17 37,33 31,46" />
    </svg>
    <span className="brand-text"><strong>MONTAJE<br />PREFABRICADO</strong><span className="mono">{footer ? "montajedeprefabricados.com" : "ingeniería · montaje · coordinación"}</span></span>
  </a>;
}
