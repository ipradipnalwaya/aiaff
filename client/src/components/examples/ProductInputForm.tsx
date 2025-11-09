import { ProductInputForm } from '../ProductInputForm';

export default function ProductInputFormExample() {
  return (
    <div className="p-6">
      <ProductInputForm
        onGenerate={(data) => console.log('Generate clicked:', data)}
        isGenerating={false}
      />
    </div>
  );
}
