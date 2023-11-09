import { ReactNode } from 'react';

interface ProductCardProps {
  children: ReactNode;
}

const ProductCard = ({ children }: ProductCardProps) => {
  return (
    <div className="bg-umbra bg-opacity-50 shadow-2xl p-6 rounded-2xl border-wave-blue border-2 border-transparent border-opacity-50 flex flex-col space-y-6">
      {children}
    </div>
  );
};

export default ProductCard;
