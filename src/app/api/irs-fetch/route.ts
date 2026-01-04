import { NextResponse } from 'next/server';

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ein = searchParams.get('ein');

  if (!ein) return NextResponse.json({ error: 'EIN required' }, { status: 400 });

  try {
    const profileUrl = `https://projects.propublica.org/nonprofits/organizations/${ein}`;
    const profileRes = await fetch(profileUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      next: { revalidate: 3600 }
    });

    if (!profileRes.ok) throw new Error("Could not load ProPublica profile");
    const html = await profileRes.text();

    const xmlLinkMatch = html.match(/\/nonprofits\/download-xml\?object_id=(\d+)/);
    if (!xmlLinkMatch) throw new Error("No digital XML filing found for this EIN.");

    const objectId = xmlLinkMatch[1];
    const xmlUrl = `https://projects.propublica.org/nonprofits/download-xml?object_id=${objectId}`;

    const xmlRes = await fetch(xmlUrl);
    if (!xmlRes.ok) throw new Error("Failed to download XML filing");
    const xmlText = await xmlRes.text();

    const filerBlockMatch = xmlText.match(/<Filer>([\s\S]*?)<\/Filer>/);
    let orgName = "Organization Name Not Found";
    
    if (filerBlockMatch) {
      const filerContent = filerBlockMatch[1];
      const nameLineMatches = Array.from(filerContent.matchAll(/<BusinessNameLine\dTxt>(.*?)<\/BusinessNameLine\dTxt>/g));
      if (nameLineMatches.length > 0) {
        orgName = nameLineMatches.map(match => decodeXmlEntities(match[1])).join(' ').trim().replace(/\s+/g, ' ');
      }
    }

    let cashAssets = 0;
    let investmentIncome = 0;
    let formType = "990";

    if (xmlText.includes('IRS990EZ')) {
      formType = "990EZ";
      investmentIncome = parseFloat(xmlText.match(/<InvestmentIncomeAmt>([\d.-]+)</)?.[1] || "0");
      cashAssets = parseFloat(xmlText.match(/<CashSavingsAndInvestmentsGrp>[\s\S]*?<EOYAmt>([\d.-]+)</)?.[1] || "0");
    } else {
      // Full 990: Sum of Savings and Non-Interest Bearing Cash
      investmentIncome = parseFloat(xmlText.match(/<CYInvestmentIncomeAmt>([\d.-]+)</)?.[1] || "0");
      
      const savingsAmt = parseFloat(xmlText.match(/<SavingsAndTempCashInvstGrp>[\s\S]*?<EOYAmt>([\d.-]+)</)?.[1] || "0");
      const nonInterestCashAmt = parseFloat(xmlText.match(/<CashNonInterestBearingGrp>[\s\S]*?<EOYAmt>([\d.-]+)</)?.[1] || "0");
      
      cashAssets = savingsAmt + nonInterestCashAmt;
    }

    const yearMatch = xmlText.match(/<TaxYr>(\d{4})<\/TaxYr>/);
    const taxYear = yearMatch ? yearMatch[1] : "N/A";

    return NextResponse.json({ 
      cashAssets, 
      investmentIncome, 
      formType, 
      year: taxYear,
      name: orgName
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}