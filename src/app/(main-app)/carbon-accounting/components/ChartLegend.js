'use client';

export default function ChartLegend({ items }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '30px' }}>
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: '50%' }} />
          <span style={{ fontSize: '14px', color: '#333' }}>{item.name}</span>
        </div>
      ))}
    </div>
  );
}
