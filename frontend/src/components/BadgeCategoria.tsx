const categoriaColors: Record<string, { bg: string; text: string; border: string }> = {
  TI: { bg: 'rgba(99, 102, 241, 0.1)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.2)' },
  OBRAS: { bg: 'rgba(249, 115, 22, 0.1)', text: '#fb923c', border: 'rgba(249, 115, 22, 0.2)' },
  SAUDE: { bg: 'rgba(244, 63, 94, 0.1)', text: '#fb7185', border: 'rgba(244, 63, 94, 0.2)' },
  EDUCACAO: { bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.2)' },
  ALIMENTACAO: { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.2)' },
  SERVICOS: { bg: 'rgba(168, 85, 247, 0.1)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.2)' },
  EQUIPAMENTOS: { bg: 'rgba(6, 182, 212, 0.1)', text: '#22d3ee', border: 'rgba(6, 182, 212, 0.2)' },
  OUTROS: { bg: 'rgba(255, 255, 255, 0.05)', text: 'rgba(255,255,255,0.45)', border: 'rgba(255, 255, 255, 0.1)' },
};

export default function BadgeCategoria({ categoria }: { categoria: string }) {
  const colors = categoriaColors[categoria] || categoriaColors.OUTROS;
  return (
    <span
      className="badge"
      style={{
        background: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {categoria}
    </span>
  );
}
