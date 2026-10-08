# Md. Ruhul Amin — Executive Personal Website

A vibrant, executive-style, responsive personal brand website built as a static site.

Positioning: Md. Ruhul Amin, ACA, ACMA — Finance • Business • Technology • Leadership

Sections: Home / About / Career / Expertise / Impact / Leadership / Credentials / Insights / Future / Contact

Included: responsive design, sticky navigation, animated impact counters, interactive career modal, scroll progress, mobile navigation, executive portfolio layout, SEO metadata, no WordPress, no framework dependency.

Before publishing: replace the portrait placeholder with the real professional photograph; replace LinkedIn URL; replace hello@ruhul.bd with preferred email; add a real downloadable PDF CV.

Hosting: upload to GitHub and deploy with Cloudflare Pages.


## Ask Ruhul AI
The public employer/recruiter chatbot is available at `/ask.html` and calls the Pages Function at `/api/ask`.

For Cloudflare Pages, add these as **encrypted secrets / variables** before deploying:
- `OPENAI_API_KEY` — your OpenAI API key (secret)
- `OPENAI_MODEL` — optional; defaults to `gpt-5.6-luna`

Never place the OpenAI API key in client-side HTML/JavaScript or commit it to GitHub.


### Public Executive Resume
The homepage has a recruiter-facing **Download Executive Resume** section. Add the employer-safe PDF as `resume.pdf` in the repository root so the download button serves it. The public version intentionally omits availability and salary-expectation details.
