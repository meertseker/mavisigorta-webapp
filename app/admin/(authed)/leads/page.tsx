import Link from 'next/link';
import { listLeads } from '@/lib/admin/lead-log';

const PRODUCT_LABEL: Record<string, string> = {
  'tamamlayici-saglik': 'Tamamlayıcı Sağlık',
  'moduler-saglik': 'Modüler Sağlık',
  kasko: 'Kasko',
  trafik: 'Trafik',
  konut: 'Konut',
  isyeri: 'İşyeri',
  dask: 'DASK',
  'seyahat-saglik': 'Seyahat Sağlık',
  genel: 'Genel',
};

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  new: { label: 'Yeni', cls: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'İletişime geçildi', cls: 'bg-amber-100 text-amber-800' },
  quoted: { label: 'Teklif verildi', cls: 'bg-purple-100 text-purple-700' },
  won: { label: 'Kazanıldı', cls: 'bg-green-100 text-green-700' },
  lost: { label: 'Kaybedildi', cls: 'bg-gray-100 text-gray-700' },
};

export default function LeadsListPage() {
  const leads = listLeads(500);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leadler</h1>
          <p className="text-sm text-gray-600 mt-1">
            Son 500 lead. Detay için satıra tıklayın.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Toplam: <span className="font-semibold text-gray-900">{leads.length}</span>
        </div>
      </header>

      {leads.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <p className="text-gray-500">
            Henüz lead yok. <Link href="/teklif" className="text-blue-600 hover:underline">Teklif sayfasından</Link>{' '}
            test başvurusu gönderebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs text-gray-600 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Tarih</th>
                  <th className="text-left px-4 py-3">Ad</th>
                  <th className="text-left px-4 py-3">Ürün</th>
                  <th className="text-left px-4 py-3">Telefon</th>
                  <th className="text-left px-4 py-3">Kaynak</th>
                  <th className="text-left px-4 py-3">Skor</th>
                  <th className="text-left px-4 py-3">Durum</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((lead) => {
                  const status = STATUS_LABEL[lead.status] || STATUS_LABEL.new;
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleString('tr-TR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {PRODUCT_LABEL[lead.product] || lead.product}
                      </td>
                      <td className="px-4 py-3 text-gray-700 tabular-nums">
                        <a href={`tel:${lead.phone}`} className="hover:underline">
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {lead.utm?.source || lead.source || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            lead.score >= 70
                              ? 'bg-green-100 text-green-800'
                              : lead.score >= 40
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Detay →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        <strong>Not:</strong> Bu liste geliştirme amaçlı yerel dosyadan okunur. Üretim kalıcılığı için
        Supabase entegrasyonu sonradan eklenecektir.
      </p>
    </div>
  );
}
