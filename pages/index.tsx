import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await fetch('/api/verifyMember', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (res.ok) {
      // ✅ 쿠폰 확인 페이지로 이동
      router.push(`/coupon?code=${data.coupon}`);
    } else {
      setError(data.error || '에러가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            ONE FOR ALL
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border border-white/70 px-4 py-3 text-white placeholder-gray-400 rounded"
          />
          <input
            type="tel"
            placeholder="전화번호를 입력하세요"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/[^0-9]/g, ''))
            }
            className="w-full bg-transparent border border-white/70 px-4 py-3 text-white placeholder-gray-400 rounded"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 border border-white/70 bg-transparent text-white hover:bg-white hover:text-black rounded transition-all duration-300"
          >
            {isLoading ? '확인 중...' : '확인'}
          </button>
        </form>

        {error && (
          <div className="mt-6 text-center text-red-400 text-sm">{error}</div>
        )}

        <div className="mt-8 text-center text-gray-400 text-xs">
          <p>© 2025 ONE FOR ALL. 모든 권리 보유.</p>
          <p className="mt-1">교육 재수강 확인 시스템</p>
        </div>
      </div>
    </div>
  );
}
