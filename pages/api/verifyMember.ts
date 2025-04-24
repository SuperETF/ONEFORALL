// pages/api/verifyMember.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '@/lib/supabaseClient';

interface VerifyMemberBody {
  name: string;
  phone: string;
}

type SuccessResponse = { coupon: string };
type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
  }

  const { name, phone } = req.body as VerifyMemberBody;

  if (!name || !phone) {
    return res.status(400).json({ error: '이름과 전화번호를 입력해주세요.' });
  }

  try {
    const { data, error } = await supabase
      .from('verified_members')
      .select('coupon_code, used')
      .eq('name', name)
      .eq('phone', phone)
      .single();

    if (error) {
      return res.status(500).json({ error: '쿠폰 조회에 실패했습니다.' });
    }
    if (!data) {
      return res.status(404).json({ error: '등록되지 않은 멤버입니다.' });
    }
    if (data.used) {
      return res.status(403).json({ error: '이미 사용된 쿠폰입니다.' });
    }

    const { error: updateError } = await supabase
      .from('verified_members')
      .update({ used: true })
      .eq('name', name)
      .eq('phone', phone);

    if (updateError) {
      return res.status(500).json({ error: '쿠폰 사용 처리 중 오류가 발생했습니다.' });
    }

    return res.status(200).json({ coupon: data.coupon_code });

  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '알 수 없는 에러';
    return res.status(500).json({ error: `서버 에러: ${message}` });
  }
}
