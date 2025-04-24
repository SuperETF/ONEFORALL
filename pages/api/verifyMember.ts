import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: '이름과 전화번호를 입력해주세요.' });
  }

  const { data, error } = await supabase
    .from('verified_members')
    .select('coupon_code, used')
    .eq('name', name)
    .eq('phone', phone)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: '일치하는 정보가 없습니다.' });
  }

  if (data.used) {
    return res.status(403).json({ error: '이미 사용된 쿠폰입니다.' });
  }

  // 사용 처리 (선택 사항)
  await supabase
    .from('verified_members')
    .update({ used: true })
    .eq('name', name)
    .eq('phone', phone);

  return res.status(200).json({ coupon: data.coupon_code });
}
