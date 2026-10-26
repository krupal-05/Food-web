import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl bg-orange-100/70 border border-orange-200/80 flex items-center justify-center text-orange-600 mb-6 shadow-inner">
          <UtensilsCrossed className="w-10 h-10" />
        </div>
        <span className="text-4xl font-black text-slate-900 tracking-tight font-['Outfit']">404</span>
        <h1 className="text-xl font-bold text-slate-800 mt-2 mb-3">Page Not Found</h1>
        <p className="text-sm text-slate-500 mb-6 max-w-sm leading-relaxed">
          The plate you are looking for has been cleared or doesn't exist. Let's get you back to delicious food!
        </p>
        <Link to="/">
          <Button variant="primary" size="md" icon={ArrowLeft}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
