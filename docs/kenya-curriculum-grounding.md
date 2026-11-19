# Kenya curriculum grounding for the Smartschool assistant

The `smart-assistant` Supabase Edge Function grounds education-related questions with Google Search and instructs Gemini to prioritise current primary Kenyan sources.

## Source hierarchy

1. Kenya Institute of Curriculum Development (KICD): https://kicd.ac.ke/cbc-materials/curriculum-designs/
2. KICD regular curriculum designs by grade: https://kicd.ac.ke/cbc-materials/curriculum-designs/regular-curriculum-designs/
3. KICD approved CBC course materials: https://kicd.ac.ke/cbc-materials/approved-cbc-course-materials/
4. Kenya National Examinations Council (KNEC): https://www.knec.ac.ke/
5. Ministry of Education: https://www.education.go.ke/

## Curriculum separation

- Legacy 8-4-4 / KCSE material is for learners who are actually in the Form 1–4 cohort or registered for KCSE.
- CBC/CBE Grade 1–12 uses the relevant KICD curriculum design for the learner's grade and learning area.
- Senior School Grade 10–12 answers must distinguish the relevant pathway and learning area.
- Current KNEC assessment circulars and regulations take precedence for examination/assessment instructions, but do not replace KICD curriculum designs.

## Response requirements

- The Edge Function uses the Africa/Nairobi date for the current-date instruction.
- Education queries enable Gemini Google Search grounding and return source URLs when grounding metadata is available.
- The assistant should not invent learning outcomes, strands, sub-strands, lesson allocations, term coverage, examination formats or assessment weightings.
- If grade/form, subject, pathway or academic year materially changes the answer, ask for clarification.
- Substantial educational answers should identify the curriculum/level, teach with Kenyan examples, include practice when appropriate, and show sources.
- Search grounding is not a substitute for a reviewed curriculum document repository. For high-stakes school planning, staff should verify against the latest official curriculum design and circular before adoption.

## Maintenance

Review official KICD, KNEC and Ministry publications at the start of each academic year and whenever a circular or curriculum revision is released. Record the document title, issuing body, publication date, grade, learning area, version and source URL when a formal curriculum document library is introduced.
