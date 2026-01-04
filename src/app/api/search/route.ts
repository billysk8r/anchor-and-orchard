import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) return NextResponse.json({ organizations: [] });

  try {
    const res = await fetch(`https://projects.propublica.org/nonprofits/api/v2/search.json?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (_error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}