---
name: glm-master-skill
description: Documentation-only master skill for discovering and installing official open-source GLM capabilities. Use when TAG 9 Studio needs GLM OCR, multimodal analysis, document-based writing, image generation, visual grounding, resume screening, PDF conversion, PRD-to-app, stock analysis, or website replication.
---

# GLM Master Skill

Use this skill as the safe capability router for the official GLM open-source skill ecosystem.

## Source and license

- Official source: `zai-org/GLM-skills`
- License: Apache-2.0
- Upstream path: `skills/glm-master-skill`

Do not claim this skill changes the host model into GLM-5.2. It discovers and routes to GLM services and official GLM skills. Most executable GLM skills require a `ZHIPU_API_KEY`.

## Capability catalog

### OCR and document intelligence

- `glmocr`: general OCR for images and PDFs
- `glmocr-table`: extract tables into Markdown
- `glmocr-formula`: extract formulas into LaTeX
- `glmocr-handwriting`: recognize handwriting
- `glmocr-sdk`: GLM-OCR SDK guidance

### Image and multimodal intelligence

- `glm-image-gen`: text-to-image generation
- `glmv-caption`: caption and describe images, videos, and documents
- `glmv-grounding`: locate objects and produce bounding-box visualizations
- `glmv-prompt-gen`: derive image-generation prompts from visual references

### Business and production workflows

- `glmv-doc-based-writing`: generate reports and content from PDF/DOCX sources
- `glmv-resume-screen`: evaluate resumes against defined criteria
- `glmv-pdf-to-ppt`: convert PDFs into presentations
- `glmv-pdf-to-web`: convert papers into project websites
- `glmv-prd-to-app`: build applications from PRDs and prototypes
- `glmv-stock-analyst`: multi-source market analysis
- `glmv-web-replication`: reproduce public website frontends

## Routing procedure

1. Identify the user's required capability.
2. Select the smallest matching GLM skill; avoid loading unrelated skills.
3. Read the selected skill's official `SKILL.md` before execution.
4. Confirm required environment variables and packages.
5. Never place API keys in source code, commits, logs, or skill files.
6. Preserve source attribution and applicable licenses.
7. For high-stakes outputs, verify results with authoritative sources and state limitations.

## Installation methods

Preferred package installation:

```bash
npx clawhub@latest install <skill-name>
```

Official GitHub source:

```text
https://github.com/zai-org/GLM-skills/tree/main/skills/<skill-name>
```

## API key requirement

Most downstream skills require:

```bash
export ZHIPU_API_KEY="your-key"
```

Store the key only in the deployment platform's encrypted environment-variable or secrets manager. Never commit `.env` files containing secrets.

## TAG 9 optimization policy

For Consultant OS, prioritize these skills:

1. `glmv-doc-based-writing` for grounded client reports and SOP-driven writing.
2. `glmocr` and `glmocr-table` for intake documents, forms, and market-research tables.
3. `glmv-caption` for visual evidence and content analysis.
4. `glmv-prd-to-app` for converting validated specifications into applications.
5. `glm-image-gen` for marketing creative generation.

Use progressive loading: activate only the selected skill and its necessary references. This preserves context and reduces token consumption.
