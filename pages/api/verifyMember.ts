import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
  }

  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: '이름과 전화번호를 입력해주세요.' });
  }

  console.log('📨 Supabase 요청:', { name, phone });
  console.log('🔐 ENV 확인:', {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY?.slice(0, 6) + '****',
  });

  try {
    const { data, error } = await supabase
      .from('verified_members')
      .select('coupon_code, used')
      .eq('name', name)
      .eq('phone', phone)
      .single();

    if (error) {
      console.error('❌ Supabase 조회 에러:', error);
      return res.status(500).json({ error: '쿠폰 조회에 실패했습니다.' });
    }

    if (!data) {
      return res.status(404).json({ error: '등록되지 않은 멤버입니다.' });
    }

    if (data.used) {
      return res.status(403).json({ error: '이미 사용된 쿠폰입니다.' });
    }

    // 사용 처리
    const { error: updateError } = await supabase
      .from('verified_members')
      .update({ used: true })
      .eq('name', name)
      .eq('phone', phone);

    if (updateError) {
      console.error('❌ 쿠폰 사용 처리 실패:', updateError);
      return res.status(500).json({ error: '쿠폰 사용 처리 중 오류가 발생했습니다.' });
    }

    return res.status(200).json({ coupon: data.coupon_code });

  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('🔥 서버 에러:', e.message);
    } else {
      console.error('🔥 알 수 없는 서버 에러 발생:', e);
    }
    return res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
}
