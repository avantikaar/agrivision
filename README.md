<div align="center">



\# 🌱 AgriVision



\*\*AI-powered crop disease detection and regional outbreak intelligence for smallholder farmers\*\*



\[!\[Live Demo](https://img.shields.io/badge/Live\_Demo-agrivision--orcin.vercel.app-10b981?style=for-the-badge\&logo=vercel)](https://agrivision-orcin.vercel.app)

\[!\[API Docs](https://img.shields.io/badge/API\_Docs-Swagger-059669?style=for-the-badge\&logo=swagger)](https://agrivision-45zi.onrender.com/api/docs/)

\[!\[GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge\&logo=github)](https://github.com/avantikaar/agrivision)



!\[Dashboard](docs/dashboard.png)



</div>



\---



\## 📌 Overview



\*\*AgriVision\*\* is a full-stack platform that lets farmers photograph a sick crop leaf and receive an AI-powered diagnosis, treatment plan, and regional outbreak warning — all within seconds.



Built to address a real problem: \*\*86% of Indian farmers are smallholders who lose 20–30% of their crop every year to preventable diseases\*\*, with only \~1 agricultural extension officer available per 1,000+ farmers.



The platform ingests geotagged disease reports, runs them through an async AI pipeline, and surfaces district-level outbreak intelligence so farmers can take preventive action before a disease spreads across fields.



\*\*Live Demo:\*\* https://agrivision-orcin.vercel.app

\*\*Test account:\*\* `farmer1` / `testpass123`



\---



\## ✨ Features



<table>

<tr>

<td width="50%">



\### 🧠 AI Disease Detection

\- Google Gemini 2.5 Flash (Vision) classifies crop diseases from leaf photos

\- Structured JSON response: disease name, confidence score, crop type

\- Fallback handling for unclear or invalid images



\### 💬 Multi-Language Treatment Plans

\- LLM-generated treatment guidance in English, Hindi, Kannada, Tamil

\- Specific chemical/organic dosages and application timing

\- Personalized to crop type and farmer's preferred language



</td>

<td width="50%">



\### ⚠️ Regional Outbreak Detection

\- Aggregates geotagged reports per district

\- Fires alerts when 3+ reports of the same disease occur within 7 days

\- Deduplicates alerts to avoid notification spam



\### 🔐 Secure Multi-Role API

\- JWT authentication with access + refresh tokens

\- Role-based access (farmer vs admin)

\- Pagination, filtering, and CORS-secured cross-origin access



</td>

</tr>

</table>



\---



\## 🏗️ Architecture



