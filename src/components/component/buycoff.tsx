'use client';

import React from 'react';
import { Button } from "@/components/ui/button";

export function BuyCoffee() {
  const openImageWindow = () => {

    const windowFeatures = 'width=600,height=400,resizable=yes,scrollbars=yes,status=yes';
    

    const htmlContent = `
      <html>
        <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh;">
          <img src="https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/img/coffee.jpg" alt="Coffee" style="max-width:100%; max-height:100%; object-fit:contain;">
        </body>
      </html>
    `;


    const newWindow = window.open('', 'CoffeeImage', windowFeatures);
    

    if (newWindow) {
      newWindow.document.write(htmlContent);
    } else {

      alert('팝업 창을 열 수 없습니다. 팝업 차단을 해제해 주세요.');
    }
  };

  return (
    <Button
      className="flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white text-[#3C1E1E] font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:ring-offset-2 w-full"
      onClick={openImageWindow}
    >
      <CreditCardIcon className="h-6 w-6" />
      <span className="font-bold text-lg">카카오페이로 커피 선물하기!</span>
    </Button>
  );
}

function CreditCardIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

export default BuyCoffee;