export async function onRequestGet(context) {\n  return Response.json({\n    configured: Boolean(context.env.OPENAI_API_KEY),\n    model: context.env.OPENAI_MODEL || "gpt-6-luna"\n  });\n}\n\nexport async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const question = typeof body?.question === "string" ? body.question.trim() : "";
    if (!context.env.OPENAI_API_KEY) {\n      return new Response(JSON.stringify({answer:"The AI assistant is not connected to its OpenAI API key yet. Please configure OPENAI_API_KEY in Cloudflare Pages → Settings → Variables and Secrets, then redeploy."}), {status:503, headers:{"Content-Type":"application/json"}});\n    }\n    if (!question || question.length > 1200) {
      return new Response(JSON.stringify({answer:"Please enter a concise question."}), {status:400, headers:{"Content-Type":"application/json"}});
    }

    const profile = `
Md. Ruhul Amin, ACA, ACMA
Finance Controller | FP&A & Business Partnering | Manufacturing Finance
Dhaka, Bangladesh | www.ruhul.bd

Professional profile:
ACA (ICAB) and ACMA (ICMAB) qualified finance professional with 7+ years' progressive experience in financial control, FP&A, management reporting, budgeting, costing, pricing, financial modelling, capital investment appraisal and audit & assurance across manufacturing and financial-services sectors. Currently Assistant Finance Controller / Head of Accounts across four PRAN-RFL Group manufacturing subsidiaries: RFL Plastics Ltd (Pipes & Fittings), Rainbow Paints, Advance Trims Solution BD Ltd (Poly & Non-Woven), and RFL Glass.

Key achievements:
- BDT 280 million in tracked cost-savings opportunities across nine initiatives up to Aug-2026.
- Synergy analysis across 354 showrooms, identifying 77 merger candidate pairs and about 200 standalone cross-sell towns.
- EOQ-based inventory optimization model covering 500 SKUs for Rainbow Paints.
- Capital project feasibility models using payback, NPV and IRR.
- Cost-volume-profit and cost-behaviour model for RFL Pipes & Fittings.
- OEE and rejection-rate benchmarking and management performance incentive KPI evaluation.
- Built and led a 32-member assurance team at Mahamud Sabuj & Co.

Current corporate scope:
Financial strategy, financial control, pricing, budgeting, forecasting, monthly financial statements, free cash flow analysis, inventory, procurement coordination, Oracle EBS recipes/BOM and journal entries, fixed assets, OEE, dealer credit notes, GRN cancellations, tax/VAT/statutory compliance, IAS/IFRS and cross-functional business partnering.

Career timeline:
- PRAN-RFL Group — Assistant Finance Controller / Head of Accounts, Dec 2025–Present.
- PRAN-RFL Group — Senior Manager – Accounts, Mar 2025–Dec 2025.
- Mahamud Sabuj & Co. — Associate Director, Mar 2025.
- Mahamud Sabuj & Co. — Manager – Assurance & Advisory Services, Nov 2022–Feb 2025.
- Mahamud Sabuj & Co. — Articled Student – Audit Senior, Nov 2019–Nov 2022.

Previous professional-practice scope:
Statutory audits, Bangladesh Bank reporting, dividend audits, FDD, valuation, feasibility, World Bank Group fiduciary reviews, ADB economic & financial analysis, internal audit and tax/VAT compliance. International reporting interfaces included PwC Pakistan and BDO Australia.

Qualifications:
ACA — ICAB, 2024; ACMA — ICMAB, 2025; BBA in Accounting & Information Systems — Comilla University, CGPA 3.47/4.00.

Systems:
Oracle EBS/ERP, Advanced Excel & Power Query, Power BI, SQL; SAP FICO training in progress; IFRS/IAS, ISA, internal controls, audit, Tax & VAT.

Public positioning:
Finance Controller, Assistant Finance Controller, FP&A, Commercial Finance, Finance Business Partner and broader senior finance leadership.

Employer-sensitivity rule:
- Do not state or imply that Ruhul is actively looking for a new job, resigning, or relocating.
- Do not disclose availability, salary expectations, or private job-search information.
- If asked whether he is looking for GCC roles or planning to leave his current employer, say: "His public professional profile does not state an active job-search or relocation preference. For any current career plans, please contact Ruhul directly."
- Keep the tone respectful of his current employer and current role.

Rules:
- Answer only from this profile and clearly labelled public information.
- Never invent employers, qualifications, responsibilities, salary, confidential figures, or personal information.
- If asked something not supported by the profile, say it is not publicly stated and suggest contacting Ruhul.
- For employer-fit questions, explain the business value in concrete terms: profitability, control, working capital, investment decisions, data/ERP, and leadership.
- Keep answers professional, concise and recruiter-friendly.
`;

    if (!context.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({answer:"The Ask Ruhul AI service is not configured yet. Please add the OPENAI_API_KEY secret to the Cloudflare Pages project."}), {status:503, headers:{"Content-Type":"application/json"}});
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${context.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: context.env.OPENAI_MODEL || "gpt-5.6-sol",
        instructions: profile,
        input: question,
        max_output_tokens: 500,
        store: false
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      return new Response(JSON.stringify({answer:"The assistant is temporarily unavailable. Please contact Ruhul directly."}), {status:502, headers:{"Content-Type":"application/json"}});
    }

    const data = await response.json();
    return new Response(JSON.stringify({answer: data.output_text || "I could not generate an answer. Please contact Ruhul directly."}), {
      headers: {"Content-Type":"application/json"}
    });
  } catch (error) {
    return new Response(JSON.stringify({answer:"The assistant is temporarily unavailable. Please try again later."}), {status:500, headers:{"Content-Type":"application/json"}});
  }
}
