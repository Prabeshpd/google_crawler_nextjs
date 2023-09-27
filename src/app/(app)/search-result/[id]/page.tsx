import SearchResultDetailComponent from '@/components/SearchResultDetail/SearchResultDetail';

export default function SearchResultDetail({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <div className="result-detail">
      <SearchResultDetailComponent id={id} />
    </div>
  );
}
