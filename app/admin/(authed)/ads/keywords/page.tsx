import KeywordPlanner from './KeywordPlanner';

export default function KeywordsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Anahtar Kelime Planlayıcı</h1>
        <p className="text-sm text-gray-600 mt-1">
          Google Ads Keyword Plan Ideas API üzerinden anahtar kelime fikirleri ve aylık ortalama
          arama hacimleri. Türkiye ve Türkçe için sorgulanır.
        </p>
      </header>

      <KeywordPlanner />
    </div>
  );
}
