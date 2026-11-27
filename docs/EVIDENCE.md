# EVIDENCE.md — what we can say on stage (checked 2026-11-26)

Tags: [FACT] = read in the source. [TO VERIFY] = team must open and confirm before using.

1. [FACT] Review of 54 articles on pet ownership and owners' mental health: positive 17, mixed 19, none 13, negative 5.
   "Pet Ownership and Quality of Life: A Systematic Review of the Literature", Vet Sci 2021 (doi 10.3390/vetsci8120332). https://pubmed.ncbi.nlm.nih.gov/34941859/ · https://pmc.ncbi.nlm.nih.gov/articles/PMC8705563/
2. [FACT] Review of 116 studies on pet attachment and mental health: better 15, worse 22, mixed 36, no relationship 33.
   https://pmc.ncbi.nlm.nih.gov/articles/PMC12023967/
3. [FACT] Systematic review (17 studies, people with mental health conditions): benefits reported, and also the
   practical and emotional burden of pet ownership and the impact of losing a pet.
   "The power of support from companion animals for people living with mental health problems", 2018 (doi 10.1186/s12888-018-1613-2). https://pubmed.ncbi.nlm.nih.gov/29402247/
4. [FACT] Thai WHO-5 (WHO-5-T): translated, back-translated, field-tested; 274 primary-care patients;
   reliable and valid; depression-screen cut-off < 12 (primary care, adults).
   "Reliability and validity of the Thai version of the WHO-Five Well-Being Index in primary care patients", 2009 (doi 10.1111/j.1440-1819.2009.01933.x). https://repository.li.mahidol.ac.th/handle/123456789/28126
   We use < 12 only for a gentle card. It was validated in adult patients, not in teens or the general public.
   [TO VERIFY] Thai item wording: the Thai questionnaire is shown as an image in this supplementary file:
   https://media.springernature.com/original/springer-static/esm/art%3A10.1186%2Fs12888-024-06154-8/MediaObjects/12888_2024_6154_MOESM4_ESM.docx
   → transcribe it into `content/who5-th.json` and have a teacher double-check. Do NOT let AI translate.
5. [FACT] Competitor Daylio: 5-point mood + activities, stats on how activities relate to mood, including a
   confidence level (Low/Medium/High). https://daylio.net/ · https://daylio.net/faq/?p=36
   → we must NOT claim "first app to correlate mood and activities". Our difference is pet-specific (joy + burden),
   WHO-5, pet timeline, non-clinical report, Thai, always-on help.
   Pet-side trackers (DogLog, PetKit) log the pet's routine and health, not the owner's mood.
6. [FACT, checked 2026-11-26] Hotlines still in service in 2026:
   - 1323 สายด่วนสุขภาพจิต (กรมสุขภาพจิต), free, 24 h — Mar 2026 news on the department expanding 1323 + online chat:
     https://www.hfocus.org/content/2026/03/37246 · https://thestandard.co/mental-health-middle-east-crisis/ · dept site https://www.dmh.go.th/
   - 1669 สายด่วนการแพทย์ฉุกเฉิน (สถาบันการแพทย์ฉุกเฉินแห่งชาติ), 24 h, for emergencies outside hospitals — Aug 2026 news still uses 1669:
     https://www.hfocus.org/content/2026/08/39230 · official advice page https://www.prd.go.th/th/content/category/detail/id/35/iid/244285
   - Note: a 2023 plan to merge 1669 into 191 was reported (https://www.thaipbs.or.th/news/content/332330), but 2026 news shows 1669 still in use.
     Re-check once on the morning of 28 Nov before the demo (1 minute).
7. [FACT] WHO-5 official English version and scoring (raw 0–25 × 4). WHO/UCN/MSD/MHE/2024.1, licence CC BY-NC-SA 3.0 IGO
   (non-commercial use allowed with citation). https://cdn.who.int/media/docs/default-source/mental-health/who-5_english-original4da539d6ed4b49389e3afe47cda2326a.pdf
8. [TO VERIFY] PDPA: health-related data is sensitive personal data requiring explicit consent; check minors' consent rules
   before any teen version.

9. [FACT] Animal-assisted interventions: goal-oriented, structured, intentionally include animals in health, education and human services; involve people with knowledge of the people and animals; include AAT, AAE and AAA. IAHAIO definitions: https://habri.org/assets/uploads/AAI-Definitions-FINAL.pdf · https://iahaio.org/?p=46
10. [FACT] AAT is directed/delivered by health or human service providers within their scope of practice; aims at physical, social, emotional or cognitive function (AVMA). https://atwork.avma.org/resources-tools/avma-policies/animal-assisted-interventions-definitions
    AAT uses a plan, monitors progress and is documented; AAE is run by a qualified teacher; AAA = visiting animals for motivational, educational, recreational purposes. https://vetsocialwork.tennessee.edu/animal-assisted-interventions-2/
11. [FACT] Evidence is mixed/early: 2026 review on anxiety says evidence is fragmented across populations and methods (https://pmc.ncbi.nlm.nih.gov/articles/PMC12840666); dog-assisted interventions review says reporting quality needs improvement (https://pmc.ncbi.nlm.nih.gov/articles/PMC7617605); inpatient review reports reduced stress, pain, anxiety, with risks of allergies, infections and accidents reduced by hygiene protocols (https://pmc.ncbi.nlm.nih.gov/articles/7185850).
12. [FACT] Thailand: therapy-dog teams work with hospitals and schools (older adults with dementia, psychiatric patients, children with special needs, blind/deaf children) https://mgronline.com/qol/detail/9690000054608 · Mahavajiralongkorn Thanyaburi Hospital (Department of Medical Services) uses therapy dogs for late-stage cancer patients and families https://www.pptvhd36.com/health/news/2761
13. [FACT] AAIs should only use animals in good physical and emotional health (ASPCA). https://www.aspca.org/about-us/aspca-policy-and-position-statements/animal-assisted-interventions

14. [FACT] ST-5 items, options (0–3) and cut-offs 0–4 / 5–7 / 8–9 / 10–15 — Department of Mental Health form as printed in Department of Health document: https://hp.anamai.moph.go.th/web-upload/4xceb3b571ddb70741ad132d75876bc41d/tinymce/OPDC/OPDC2565-F/IDC2_2/opdc_2565_IDC2-2_08.pdf (time frame 2–4 weeks: https://hdmall.co.th/health-tools/stress-test.html). 2Q/9Q deliberately NOT used in the app (self-harm item needs clinical follow-up).
15. [FACT] Foster-to-adopt: ~73% of foster-to-adopt dogs were adopted (ASU, https://education.asu.edu/about/news/taking-test-drive-shelter-dogs); dogs returning after a week of fostering were no more stressed than before (Virginia Tech 2026, https://news.vt.edu/articles/2026/01/cals-foster-dogs-study.html).
16. [FACT] BKK Prawet shelter (BKK Adopter): animals health-checked, screened, vaccinated, sterilized (https://www.dailynews.co.th/news/5422583/); adopter conditions (https://www.dailynews.co.th/articles/3614740/); phone 0 2328 7460, 0 2245 3311 Mon–Fri 08.30–16.30, LINE, Facebook BKK Adopter (https://thestandard.co/?p=1085104).
17. [FACT] Costs: food+treats 1,000–3,000/month; small dog ~24,000/yr, large ~28,000/yr (KResearch); emergency fund 3–6 months; illness examples (ttb) — Thairath 16 Dec 2025 https://www.thairath.co.th/money/personal_finance/finance_banking/2902292 · example private clinic list (combo vaccine 420, rabies 240, deworm 170+, flea 320+, consult 150, cat spay 4,000/5,000+) https://page.line.me/483uinhb/showcase/2080695408240861 · BMA mobile units: free rabies vaccine, microchip, sterilization https://www.thansettakij.com/health-wellness/662052
18. [FACT] Thai therapy-dog course: owner + dog bonded ≥ 1 year, ~30 hours theory + practice (https://www.khaosod.co.th/sentangsedtee/?p=212128); curriculum from Therapy Dog Association Switzerland VTHS (https://www.thaipost.net/economy-news/1011186/). Course fee not found → app says so.

19. [FACT, checked 2026-11-26] RSPCA Queensland, dogs adopted 1 Jan 2019 – 31 Dec 2020: 6,212 adoptions (5,587 dogs), 865 readmissions; 552 (64%) of returns happened within the first 14 days (checked in the paper text 2026-11-26). The authors note the adoption-fee refund policy may have influenced this; time in foster before adoption was protective. Thumpkin et al., Animals 2022, 12, 2568. https://doi.org/10.3390/ani12192568 · https://pubmed.ncbi.nlm.nih.gov/36230311/
    App wording: "64% ของการคืนเกิดใน 14 วันแรก (552 จาก 865 ครั้ง, การรับเลี้ยงสุนัข 6,212 ครั้ง, RSPCA Queensland 2019–2020)" + always add "ไม่ใช่ข้อมูลไทย และไม่ได้บอกผลของ Pawlune".
20. [FACT] Cats: not eating >24 h, breathing problems, straining in the litter box → immediate vet; lack of urination is life-threatening; cats hide illness (VCA Hospitals "Recognizing the Signs of Illness in Cats"). https://vcahospitals.com/know-your-pet/recognizing-signs-of-illness-in-cats · not eating risks hepatic lipidosis (VCA/Chewy vet quote) https://www.chewy.com/education/cat/health-and-wellness/my-cat-wont-eat-alone
21. [FACT] Normal adjustment for a new cat is usually 1–2 weeks, depends on temperament and other animals (Maddie's Fund). https://maddiesfund.org/kb-bringing-your-new-cat-home.htm · hiding/less eating in the first days can be normal (Best Friends) https://bestfriends.org/node/546835
22. [FACT] Settling room, carrier for transport, let the cat leave the carrier on its own, keep other animals separate for the first days (Battersea). https://www.battersea.org.uk/pet-advice/cat-advice/settling-your-cat-new-home · new cat with resident pets: confine to one room for days, sometimes weeks (SF SPCA) https://www.sfspca.org/resource/moving-with-your-cat/
23. [FACT] Keep the shelter's food at first and switch gradually over ~6 days (Best Friends, same link as 21).
24. [FACT] First vet visit within a week of adoption, bring the shelter's vaccination record (Petfinder) https://www.petfinder.com/cats-and-kittens/adoption/new-cat/first-30-days

25. [FACT] Dogs: "3-3-3" (3 days / 3 weeks / 3 months) is a loose guideline used by shelters, not a schedule (SF SPCA). https://www.sfspca.org/blog/3-3-3-guideline/
26. [FACT] Adopted dogs may still be decompressing from shelter stress during the first two weeks (San Diego Humane Society). https://sdhumane.org/resources/adopting-helping-a-dog-adjust-to-a-new-home/
27. [FACT] Keep the shelter's food for the first several days, then switch slowly (Camp Bow Wow). https://www.campbowwow.com/blogs/2024/march/the-3-3-3-rule-for-dog-adoption/
28. [FACT] Introduce dogs on neutral ground, parallel walks, supervise all interactions (ASPCA; SPCA Tampa Bay PDF). https://www.aspca.org/pet-care/general-pet-care/introducing-dogs-each-other · https://spca.org/wp-content/uploads/2023/07/Dog-to-Dog-Introductions.pdf
29. [FACT] GDV/bloat: life-threatening, needs immediate care; signs non-productive retching, drooling, panting, bloated/painful abdomen (Cornell Riney Canine Health Center). https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-topics/gastric-dilatation-volvulus-gdv-or-bloat
30. [FACT] Heatstroke: heavy panting, drooling, bloody diarrhea, vomiting, weakness, confusion, seizures, collapse (Cornell). https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-information/heatstroke-medical-emergency

## Do not say
- "Pawlune ลดอัตราการคืนสัตว์" (no pilot data) · "ทดลอง 14 วันรับประกันว่าเข้ากัน" · "AI จับคู่" (it is rule-based)
- "สัตว์เลี้ยงช่วยรักษา/บำบัด" · "งานวิจัยยืนยันว่า…" (it doesn't) · "แอปแรกของโลก" · any user count we don't have.
