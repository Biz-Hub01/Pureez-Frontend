
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

interface ProductNavProps {
  productTitle: string;
}

const ProductNav = ({ productTitle }: ProductNavProps) => {
  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-primary">
            <Home size={16} className="mr-2" />
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-3 h-3 text-foreground/40 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
            <Link to="/catalog" className="ml-1 text-sm text-foreground/70 hover:text-primary">
              Catalog
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <svg className="w-3 h-3 text-foreground/40 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span className="ml-1 text-sm font-medium text-primary truncate max-w-[200px]">
              {productTitle}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default ProductNav;
