import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Coupon = () => {
  const router = useRouter();
  const couponCode = (router.query.code as string) || '';
  const [showToast, setShowToast] = useState(false);

  const formattedCouponCode = couponCode.match(/.{1,4}/g)?.join("-") || couponCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode).then(() => {
      setShowToast(true);
    });
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const selectCouponCode = (event: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(event.currentTarget);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col relative">
      <div className="fixed w-full top-0 z-10 bg-black py-4 px-5 flex items-center">
        <button className="cursor-pointer" onClick={() => router.back()}>
          <i className="fas fa-arrow-left text-white text-xl"></i>
        </button>
        <h1 className="text-2xl font-bold text-center flex-1">쿠폰 확인</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 mt-16">
        <div className="w-full max-w-sm">
          <p className="text-center text-gray-400 mb-4">쿠폰 번호</p>
          <div className="border border-gray-700 rounded-lg p-6 bg-gray-900 mb-6">
            <div
              className="font-mono text-3xl text-center mb-4 cursor-pointer select-all"
              onClick={selectCouponCode}
            >
              {formattedCouponCode}
            </div>
            <button
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition duration-300"
              onClick={handleCopy}
            >
              <i className="fas fa-copy mr-2"></i>
              <span>복사하기</span>
            </button>
          </div>
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">쿠폰 사용 방법</p>
            <p className="mb-1">1. 쿠폰 번호를 복사하세요</p>
            <p className="mb-1">2. 앱 내 쿠폰 등록 페이지로 이동하세요</p>
            <p>3. 복사한 쿠폰 번호를 붙여넣기 하세요</p>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full transition-opacity duration-300 flex items-center ${showToast ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <i className="fas fa-check-circle mr-2 text-green-500"></i>
        <span>쿠폰 번호가 복사되었습니다</span>
      </div>
    </div>
  );
};

export default Coupon;
