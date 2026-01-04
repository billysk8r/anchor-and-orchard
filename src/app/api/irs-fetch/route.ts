import { NextResponse } from 'next/server';
import { getIrsData } from '@/lib/irs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ein = searchParams.get('ein');
  if (!ein) return NextResponse.json({ error: 'EIN required' }, { status: 400 });

  const data = await getIrsData(ein);
  if (data.error) return NextResponse.json({ error: data.error }, { status: 500 });
  
  return NextResponse.json(data);
}