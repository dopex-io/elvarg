import { ReactNode } from 'react';

interface ProductCardProps {
  children: ReactNode;
}

const ProductCard = ({ children }: ProductCardProps) => {
  return (
    <div className="tilting-card-wrapper-default sm:tilting-card-wrapper">
      <div className="mouse-position-tracker"></div>
      <div className="mouse-position-tracker"></div>
      <div className="mouse-position-tracker"></div>
      <div className="mouse-position-tracker"></div>
      <div className="mouse-position-tracker"></div>
      <div className="tilting-card-body">
        <div className="bg-black bg-opacity-30 shadow-2xl p-6 rounded-2xl border-transparent border-opacity-50  space-y-6 sm:w-[496px] w-[85vw]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
