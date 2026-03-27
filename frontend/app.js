/* ─── LakshyaCV — app.js (GOV.UK Design System) ────────────────────────── */
"use strict";

let currentStep      = 1;
let selectedTemplate = "modern";
const TOTAL_STEPS    = 4;

/* ══ Job role descriptions ══════════════════════════════════════════════════ */
const JOB_ROLES = [
  { title: "Software Engineer", summary: "Software engineer with experience designing, developing, and maintaining production-grade systems. Writes clean, scalable code and collaborates with cross-functional teams to deliver reliable software. Participates in code reviews, system design discussions, and performance optimisation.", bullets: "Designed and developed software systems across the full development lifecycle\nWrote clean, maintainable code following team standards and best practices\nCollaborated with product, design, and QA teams to deliver features on schedule\nTroubleshooted and resolved bugs, improving system stability and performance\nParticipated in code reviews and contributed to system design decisions" },
  { title: "Frontend Developer", summary: "Frontend developer with experience building responsive, accessible user interfaces using modern web technologies. Integrates REST APIs, ensures cross-browser compatibility, and maintains design consistency across products.", bullets: "Built and maintained user interfaces using HTML, CSS, and JavaScript frameworks\nEnsured responsive design and cross-browser compatibility across devices\nIntegrated REST APIs and managed client-side data flow and state\nImproved UI performance and accessibility following web standards\nCollaborated with designers to maintain visual consistency" },
  { title: "Backend Developer", summary: "Backend developer with experience building server-side logic, RESTful APIs, and database systems. Focused on performance, security, and scalability to support production workloads.", bullets: "Developed server-side logic and RESTful APIs serving thousands of requests\nDesigned and managed relational and non-relational databases\nImplemented authentication, authorisation, and security best practices\nOptimised query performance and reduced server response times\nHandled third-party integrations and system-level troubleshooting" },
  { title: "Full Stack Developer", summary: "Full stack developer with experience across the entire software stack from database design to user interface. Builds, integrates, and deploys complete systems with a focus on maintainability and performance.", bullets: "Handled both frontend and backend development within a unified codebase\nDesigned complete systems including data models, APIs, and client interfaces\nIntegrated user interfaces with server-side logic and third-party services\nManaged deployments and maintained systems in production environments\nDebugged and resolved issues across the full stack" },
  { title: "Data Scientist", summary: "Data scientist with experience analysing structured and unstructured data to uncover actionable insights. Builds predictive models, applies statistical methods, and communicates findings clearly to technical and non-technical audiences.", bullets: "Analysed large datasets to identify patterns, trends, and business opportunities\nBuilt and evaluated machine learning models for prediction and classification tasks\nCleaned and preprocessed raw data from multiple sources\nCommunicated findings through visualisations and written reports\nCollaborated with engineering teams to integrate models into production" },
  { title: "Machine Learning Engineer", summary: "Machine learning engineer with experience designing, training, and deploying ML models at scale. Works with large datasets and focuses on model accuracy, performance, and integration into production systems.", bullets: "Designed and trained machine learning models for real-world use cases\nOptimised model performance, accuracy, and inference speed\nWorked with large-scale datasets for preprocessing, feature engineering, and training\nIntegrated trained models into production pipelines and APIs\nMonitored model performance in production and managed retraining cycles" },
  { title: "DevOps Engineer", summary: "DevOps engineer with experience automating deployment pipelines, managing cloud infrastructure, and ensuring high availability. Bridges development and operations to enable faster, more reliable software delivery.", bullets: "Automated CI/CD pipelines, reducing deployment time and human error\nManaged cloud infrastructure across AWS, Azure, or GCP\nMonitored system performance, uptime, and security across environments\nImplemented infrastructure as code using tools such as Terraform or Ansible\nCollaborated with development teams to improve build and release processes" },
  { title: "Product Manager", summary: "Product manager with experience defining product vision, gathering requirements, and driving cross-functional delivery. Translates business goals into actionable roadmaps and measures success through clear metrics.", bullets: "Defined product vision, strategy, and roadmap in collaboration with stakeholders\nGathered and prioritised requirements from engineering, design, and business teams\nCoordinated sprint planning and tracked delivery against milestones\nAnalysed user feedback and data to inform product decisions\nCommunicated product progress and outcomes to leadership and stakeholders" },
  { title: "Project Manager", summary: "Project manager with experience planning and delivering projects on time, within budget, and to scope. Strong communicator with a track record of managing resources, risks, and stakeholder expectations.", bullets: "Planned and managed project timelines, resources, and deliverables\nIdentified, tracked, and mitigated project risks throughout the lifecycle\nFacilitated regular status meetings and communicated progress to stakeholders\nCoordinated cross-functional teams to ensure alignment on scope and priorities\nDelivered projects within defined budget, timeline, and quality constraints" },
  { title: "UI/UX Designer", summary: "UI/UX designer with experience creating user interfaces and experiences that are intuitive, accessible, and visually consistent. Conducts user research, produces wireframes and prototypes, and collaborates closely with development teams.", bullets: "Designed user interfaces and interaction flows across web and mobile platforms\nCreated wireframes, mockups, and interactive prototypes for stakeholder review\nConducted user research and usability testing to validate design decisions\nImproved accessibility and usability based on user feedback and analytics\nCollaborated with developers to ensure accurate implementation of designs" },
  { title: "QA Engineer / Tester", summary: "QA engineer with experience designing test plans, executing manual and automated tests, and working with development teams to deliver high-quality software.", bullets: "Designed and executed test cases for functional, regression, and integration testing\nIdentified, documented, and tracked bugs through to resolution\nBuilt automated test suites to improve test coverage and reduce manual effort\nWorked with developers to reproduce issues and verify fixes\nContributed to improving quality processes and release standards" },
  { title: "Business Analyst", summary: "Business analyst with experience gathering and analysing requirements, translating business needs into technical specifications, and improving operational processes.", bullets: "Gathered and documented business requirements through workshops and interviews\nTranslated business needs into detailed functional and technical specifications\nAnalysed existing processes and identified opportunities for improvement\nWorked with development and product teams to ensure requirements were met\nProduced reports and dashboards to support business decision-making" },
  { title: "System Administrator", summary: "System administrator with experience managing servers, networks, and IT infrastructure. Ensures system availability, applies security updates, and resolves infrastructure issues.", bullets: "Managed and maintained servers, networks, and IT infrastructure\nMonitored system performance, availability, and security across environments\nApplied patches, updates, and configuration changes following change control processes\nTroubleshooted and resolved infrastructure and connectivity issues\nDocumented system configurations and maintained operational runbooks" },
  { title: "Cybersecurity Analyst", summary: "Cybersecurity analyst with experience monitoring systems for threats, conducting vulnerability assessments, and responding to incidents. Ensures organisational compliance with security standards.", bullets: "Monitored systems and networks for security threats and anomalous activity\nConducted vulnerability assessments and penetration testing exercises\nResponded to security incidents and coordinated remediation efforts\nImplemented and maintained security controls, policies, and tools\nEnsured compliance with security frameworks and regulatory requirements" },
  { title: "Database Administrator", summary: "Database administrator with experience designing, maintaining, and optimising relational and non-relational databases. Ensures data integrity, security, performance, and availability.", bullets: "Designed and maintained database schemas for production applications\nMonitored and optimised query performance and database resource usage\nImplemented backup, recovery, and high-availability strategies\nEnsured data integrity, access controls, and security compliance\nCollaborated with developers on data modelling and migration activities" },
  { title: "Mobile App Developer", summary: "Mobile app developer with experience building performant, user-friendly applications for Android and iOS platforms. Integrates APIs, maintains app quality, and iterates based on user feedback.", bullets: "Built and maintained mobile applications for Android and/or iOS platforms\nIntegrated REST APIs and managed local data storage and state\nEnsured performance, responsiveness, and quality across device types\nPublished and managed app releases through platform stores\nFixed bugs and shipped improvements based on user feedback and crash reports" },
  { title: "Cloud Engineer", summary: "Cloud engineer with experience designing and managing cloud infrastructure across major providers. Ensures scalability, cost efficiency, and reliability of cloud-hosted systems.", bullets: "Designed and maintained cloud infrastructure on AWS, Azure, or GCP\nImplemented infrastructure as code for repeatable and auditable deployments\nOptimised cloud resource usage to reduce costs without sacrificing performance\nEnsured security, compliance, and availability of cloud-hosted services\nAutomated cloud operations and deployments using scripting and pipeline tools" },
  { title: "Technical Support Engineer", summary: "Technical support engineer with experience diagnosing and resolving software and infrastructure issues for end users and customers. Focused on fast resolution and clear communication.", bullets: "Diagnosed and resolved technical issues for users and customers across multiple channels\nDocumented solutions and contributed to the team knowledge base\nEscalated complex issues to engineering teams with clear reproduction steps\nTracked and followed up on open cases to ensure timely resolution\nContributed to improving support processes and reducing ticket resolution time" },
  { title: "Sales Executive", summary: "Sales executive with experience identifying and pursuing sales opportunities, building lasting client relationships, and consistently meeting or exceeding targets.", bullets: "Identified and pursued new business opportunities through outreach and networking\nBuilt and maintained strong relationships with existing and prospective clients\nMet and exceeded monthly and quarterly sales targets\nNegotiated terms and closed deals across mid-market and enterprise accounts\nMaintained accurate records in CRM and reported pipeline progress to management" },
  { title: "Marketing Manager", summary: "Marketing manager with experience developing and executing campaigns across digital and traditional channels. Data-driven approach to brand growth, lead generation, and performance measurement.", bullets: "Developed and executed integrated marketing campaigns across multiple channels\nManaged content calendars, social media, and email marketing programmes\nAnalysed campaign performance and optimised based on data and A/B testing\nCoordinated with design, sales, and product teams on go-to-market activities\nTracked KPIs and reported marketing ROI to senior leadership" },
  { title: "HR Manager", summary: "HR manager with experience leading recruitment, onboarding, performance management, and employee relations. Ensures HR policies support a positive workplace culture and comply with employment legislation.", bullets: "Managed end-to-end recruitment processes across technical and non-technical roles\nOnboarded new employees and facilitated structured induction programmes\nHandled employee relations matters with fairness and confidentiality\nImplemented and maintained HR policies in line with employment law\nSupported managers through performance review cycles and development planning" }
];

/* ══ Init ════════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  populateRoleDropdowns();
  addBlock("experience");
  addBlock("education");
  addBlock("projects");
  updateCompleteness();
  document.querySelectorAll(".govuk-input, .govuk-textarea").forEach(el => {
    el.addEventListener("input", updateCompleteness);
  });
});

/* ══ Populate role dropdowns ═════════════════════════════════════════════════ */
function populateRoleDropdowns() {
  const summarySelect = document.getElementById("summary-role-select");
  if (summarySelect) {
    JOB_ROLES.forEach(r => {
      const o = document.createElement("option");
      o.value = r.title; o.textContent = r.title;
      summarySelect.appendChild(o);
    });
  }
}

/* ══ Generate panel ══════════════════════════════════════════════════════════ */
function openGeneratePanel(panelId) {
  document.getElementById(panelId)?.classList.toggle("lc-open");
}

function previewGeneratedText(selectId) {
  const sel = document.getElementById(selectId);
  const panel = sel?.closest(".lc-generate-panel");
  const btn = panel?.querySelector(".lc-btn-use");
  if (btn) btn.disabled = !sel.value;
}

function insertGeneratedText(selectId, targetFieldId, panelId) {
  const sel   = document.getElementById(selectId);
  const field = document.getElementById(targetFieldId);
  const panel = document.getElementById(panelId);
  if (!sel?.value || !field) return;
  const role = JOB_ROLES.find(r => r.title === sel.value);
  if (!role) return;
  field.value = targetFieldId === "summary" ? role.summary : role.bullets;
  field.dispatchEvent(new Event("input"));
  panel?.classList.remove("lc-open");
  showToast("Draft inserted. Please personalise it before submitting.", "success");
  field.focus();
  field.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ══ Template selection ══════════════════════════════════════════════════════ */
function selectTemplate(name) {
  selectedTemplate = name;
  ["classic", "executive", "modern"].forEach(t => {
    document.getElementById(`tpl-${t}`)?.classList.toggle("lc-selected", t === name);
  });
  const nameMap = { classic: "Classic (B&W)", executive: "Executive (Navy)", modern: "Modern (Teal)" };
  const badge = document.getElementById("sidebar-tpl-name");
  if (badge) badge.textContent = nameMap[name] || name;
}

/* ══ Step navigation ══════════════════════════════════════════════════════════ */
function goToStep(step) {
  if (step === 2 && !validateStep1()) return;

  document.querySelector(`#step-${currentStep}`)?.classList.remove("lc-active");
  currentStep = step;
  document.querySelector(`#step-${currentStep}`)?.classList.add("lc-active");

  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const state = i < currentStep ? "lc-done" : i === currentStep ? "lc-active" : "";
    const vEl = document.getElementById(`step-v-${i}`);
    if (vEl) { vEl.classList.remove("lc-done","lc-active"); if (state) vEl.classList.add(state); }
    const hEl = document.getElementById(`step-h-${i}`);
    if (hEl) { hEl.classList.remove("lc-done","lc-active"); if (state) hEl.classList.add(state); }
  }

  if (step === 4) buildReviewPanel();
  window.scrollTo({ top: 0, behavior: "smooth" });
  hideError();
}

/* ══ Validation ══════════════════════════════════════════════════════════════ */
function validateStep1() {
  const name  = val("p-name");
  const email = val("p-email");
  if (!name)  { showError("Enter your full name before continuing."); document.getElementById("p-name").focus(); return false; }
  if (!email) { showError("Enter your email address before continuing."); document.getElementById("p-email").focus(); return false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError("Enter a valid email address."); document.getElementById("p-email").focus(); return false; }
  return true;
}

/* ══ Tips ════════════════════════════════════════════════════════════════════ */
function toggleTip(id) {
  document.getElementById(id)?.classList.toggle("lc-open");
}

/* ══ Repeat blocks ═══════════════════════════════════════════════════════════ */
let blockCounters = { experience: 0, education: 0, projects: 0 };

function addBlock(type) {
  const id        = ++blockCounters[type];
  const container = document.getElementById(`${type}-blocks`);
  const div       = document.createElement("div");
  div.className   = "lc-repeat-block";
  div.id          = `${type}-block-${id}`;
  div.innerHTML   = blockTemplate(type, id);
  container.appendChild(div);

  // Populate any role dropdowns inside new block
  div.querySelectorAll(".lc-role-dropdown").forEach(sel => {
    JOB_ROLES.forEach(r => {
      const o = document.createElement("option");
      o.value = r.title; o.textContent = r.title;
      sel.appendChild(o);
    });
  });

  div.style.opacity = "0";
  requestAnimationFrame(() => { div.style.transition = "opacity 0.2s"; div.style.opacity = "1"; });
  updateCompleteness();
}

function removeBlock(type, id) {
  const container = document.getElementById(`${type}-blocks`);
  if (container.querySelectorAll(".lc-repeat-block").length <= 1) { showToast("You need at least one entry.", "error"); return; }
  const el = document.getElementById(`${type}-block-${id}`);
  el.style.transition = "opacity 0.15s"; el.style.opacity = "0";
  setTimeout(() => el.remove(), 160);
  updateCompleteness();
}

function ordinal(n) { const s=["th","st","nd","rd"],v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); }

function blockTemplate(type, id) {
  const typeLabel = type === "experience" ? "Role" : type === "education" ? "Qualification" : "Project";
  const hdr = `<div class="lc-repeat-header"><span class="lc-repeat-label">${typeLabel} ${ordinal(id)}</span><button class="lc-btn-remove" onclick="removeBlock('${type}',${id})" type="button">Remove</button></div>`;

  if (type === "experience") return `${hdr}
    <div class="lc-form-row">
      <div class="govuk-form-group">
        <label class="govuk-label" for="exp-company-${id}">Company / Organisation</label>
        <input class="govuk-input" type="text" id="exp-company-${id}" placeholder="e.g. Acme Technologies Ltd." oninput="updateCompleteness()" />
      </div>
      <div class="govuk-form-group">
        <label class="govuk-label" for="exp-role-${id}">Job Title</label>
        <input class="govuk-input" type="text" id="exp-role-${id}" placeholder="e.g. Software Engineer" oninput="updateCompleteness()" />
      </div>
    </div>
    <div class="govuk-form-group">
      <label class="govuk-label" for="exp-period-${id}">Period</label>
      <div class="govuk-hint">e.g. Jan 2022 &ndash; Mar 2024, or 2022 &ndash; Present</div>
      <input class="govuk-input" type="text" id="exp-period-${id}" placeholder="Jan 2022 – Present" />
    </div>
    <div class="govuk-form-group">
      <div class="lc-field-header">
        <label class="govuk-label" for="exp-bullets-${id}">Achievements / Responsibilities</label>
        <button class="lc-btn-generate" type="button" onclick="openGeneratePanel('exp-gen-panel-${id}')">
          <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Generate
        </button>
      </div>
      <div class="lc-generate-panel" id="exp-gen-panel-${id}">
        <div class="lc-generate-panel__header">Pre-defined Description Generator</div>
        <div class="lc-generate-panel__body">
          <div class="lc-generate-warning"><strong>Important:</strong> These are generic bullet points. You must personalise them with your real achievements, numbers, and outcomes before using. A generic description will not stand out.</div>
          <div class="lc-generate-row">
            <select class="govuk-select lc-role-dropdown" id="exp-role-select-${id}" onchange="previewGeneratedText('exp-role-select-${id}')">
              <option value="">Select your job role&hellip;</option>
            </select>
            <button class="lc-btn-use" type="button" id="exp-use-btn-${id}" disabled
              onclick="insertGeneratedText('exp-role-select-${id}','exp-bullets-${id}','exp-gen-panel-${id}')">
              Use as Draft
            </button>
          </div>
        </div>
      </div>
      <div class="govuk-hint">One achievement per line. Start with a strong action verb.</div>
      <textarea class="govuk-textarea" id="exp-bullets-${id}" rows="5"
        placeholder="Developed and maintained RESTful APIs serving 50,000+ daily requests&#10;Reduced deployment pipeline time from 45 minutes to 8 minutes through CI/CD automation&#10;Led a team of 3 engineers to deliver a new billing module ahead of schedule"
        oninput="updateCompleteness()"></textarea>
    </div>`;

  if (type === "education") return `${hdr}
    <div class="lc-form-row">
      <div class="govuk-form-group">
        <label class="govuk-label" for="edu-institution-${id}">Institution</label>
        <input class="govuk-input" type="text" id="edu-institution-${id}" placeholder="e.g. University of Toronto" oninput="updateCompleteness()" />
      </div>
      <div class="govuk-form-group">
        <label class="govuk-label" for="edu-year-${id}">Year / Period</label>
        <input class="govuk-input" type="text" id="edu-year-${id}" placeholder="2020 – 2024" />
      </div>
    </div>
    <div class="lc-form-row">
      <div class="govuk-form-group">
        <label class="govuk-label" for="edu-degree-${id}">Degree / Programme</label>
        <input class="govuk-input" type="text" id="edu-degree-${id}" placeholder="Bachelor of Science in Computer Science" oninput="updateCompleteness()" />
      </div>
      <div class="govuk-form-group">
        <label class="govuk-label" for="edu-gpa-${id}">GPA (optional)</label>
        <div class="govuk-hint">Include only if 3.5 or above</div>
        <input class="govuk-input" type="text" id="edu-gpa-${id}" placeholder="3.8 / 4.0" />
      </div>
    </div>`;

  if (type === "projects") return `${hdr}
    <div class="lc-form-row">
      <div class="govuk-form-group">
        <label class="govuk-label" for="proj-name-${id}">Project Name</label>
        <input class="govuk-input" type="text" id="proj-name-${id}" placeholder="e.g. Inventory Management System" oninput="updateCompleteness()" />
      </div>
      <div class="govuk-form-group">
        <label class="govuk-label" for="proj-url-${id}">URL / GitHub Link</label>
        <div class="govuk-hint">Shown as &ldquo;View&rdquo; hyperlink in the PDF</div>
        <input class="govuk-input" type="url" id="proj-url-${id}" placeholder="github.com/yourname/project" />
      </div>
    </div>
    <div class="govuk-form-group">
      <label class="govuk-label" for="proj-tech-${id}">Tech Stack</label>
      <div class="govuk-hint">Comma-separated technologies used</div>
      <input class="govuk-input" type="text" id="proj-tech-${id}" placeholder="Python, Django, PostgreSQL, Docker, React" />
    </div>
    <div class="govuk-form-group">
      <label class="govuk-label" for="proj-desc-${id}">Description</label>
      <div class="govuk-hint">What problem does it solve? One bullet per line.</div>
      <textarea class="govuk-textarea" id="proj-desc-${id}" rows="3"
        placeholder="Built a web-based inventory system used by a local business to track 500+ products&#10;Reduced manual stock-taking time by 70% through automated reorder alerts"
        oninput="updateCompleteness()"></textarea>
    </div>`;
}

/* ══ Skills tags ══════════════════════════════════════════════════════════════ */
function renderSkillTags() {
  const tags    = val("skills").split(",").map(s => s.trim()).filter(Boolean);
  const preview = document.getElementById("skills-preview");
  preview.innerHTML = tags.map(t => `<strong class="lc-skill-tag">${escHtml(t)}</strong>`).join("");
  updateCompleteness();
}

/* ══ Char counter ════════════════════════════════════════════════════════════ */
function updateCharCount(el, counterId, max) {
  const len = el.value.length;
  const counter = document.getElementById(counterId);
  counter.textContent = `${len} / ${max}`;
  counter.classList.toggle("lc-char-counter--warn", len > max * 0.9);
}

/* ══ Completeness ════════════════════════════════════════════════════════════ */
function updateCompleteness() {
  const checks = [
    !!val("p-name"), !!val("p-email"), !!val("p-title"), !!val("p-phone"),
    !!val("summary"), !!val("skills"),
    !!document.querySelector("[id^='exp-company-']")?.value?.trim(),
    !!document.querySelector("[id^='exp-bullets-']")?.value?.trim(),
    !!document.querySelector("[id^='edu-institution-']")?.value?.trim(),
    !!document.querySelector("[id^='proj-name-']")?.value?.trim(),
  ];
  const pct = Math.round(checks.filter(Boolean).length / checks.length * 100);
  ["completeness-fill","sidebar-fill"].forEach(id => { const el = document.getElementById(id); if (el) el.style.width = `${pct}%`; });
  ["completeness-pct","sidebar-pct"].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = `${pct}%`; });
}

/* ══ Review panel ════════════════════════════════════════════════════════════ */
function buildReviewPanel() {
  const expCount  = document.querySelectorAll("[id^='exp-company-']").length;
  const eduCount  = document.querySelectorAll("[id^='edu-institution-']").length;
  const projCount = document.querySelectorAll("[id^='proj-name-']").length;
  const skills    = val("skills").split(",").filter(s => s.trim()).length;
  const tplNames  = { classic: "Classic (Black & White)", executive: "Executive (Navy)", modern: "Modern (Teal)" };

  const rows = [
    { label: "Name",       value: val("p-name")    || "Not provided" },
    { label: "Title",      value: val("p-title")   || "Not provided" },
    { label: "Email",      value: val("p-email")   || "Not provided" },
    { label: "Location",   value: val("p-location")|| "Not provided" },
    { label: "Template",   value: tplNames[selectedTemplate] || selectedTemplate },
    { label: "Experience", value: `${expCount} role${expCount !== 1 ? "s" : ""}` },
    { label: "Education",  value: `${eduCount} entr${eduCount !== 1 ? "ies" : "y"}` },
    { label: "Skills",     value: `${skills} skill${skills !== 1 ? "s" : ""}` },
    { label: "Projects",   value: `${projCount} project${projCount !== 1 ? "s" : ""}` },
  ];

  document.getElementById("review-grid").innerHTML = rows.map(r => `
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">${r.label}</dt>
      <dd class="govuk-summary-list__value">${escHtml(String(r.value))}</dd>
    </div>`).join("");
}

/* ══ Collect form data ═══════════════════════════════════════════════════════ */
function collectFormData() {
  const experience = [];
  document.querySelectorAll("[id^='exp-company-']").forEach(el => {
    const id = el.id.split("-").pop();
    experience.push({ company: val(`exp-company-${id}`), role: val(`exp-role-${id}`), period: val(`exp-period-${id}`), bullets: val(`exp-bullets-${id}`) });
  });
  const education = [];
  document.querySelectorAll("[id^='edu-institution-']").forEach(el => {
    const id = el.id.split("-").pop();
    education.push({ institution: val(`edu-institution-${id}`), degree: val(`edu-degree-${id}`), year: val(`edu-year-${id}`), gpa: val(`edu-gpa-${id}`) });
  });
  const projects = [];
  document.querySelectorAll("[id^='proj-name-']").forEach(el => {
    const id = el.id.split("-").pop();
    projects.push({ name: val(`proj-name-${id}`), description: val(`proj-desc-${id}`), tech: val(`proj-tech-${id}`), url: val(`proj-url-${id}`) });
  });
  return {
    personal: { name: val("p-name"), title: val("p-title"), email: val("p-email"), phone: val("p-phone"), location: val("p-location"), linkedin: val("p-linkedin"), github: val("p-github"), website: val("p-website") },
    summary: val("summary"), skills: val("skills"), template: selectedTemplate,
    experience, education, projects,
  };
}

/* ══ Generate PDF ════════════════════════════════════════════════════════════ */
async function generateResume() {
  const btn = document.getElementById("generate-btn");
  btn.disabled = true;
  btn.innerHTML = `<span class="lc-spinner"></span>&nbsp; Generating&hellip;`;
  try {
    const payload  = collectFormData();
    const response = await fetch("/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err.detail || `Server error ${response.status}`); }
    const blob = await response.blob();
    const url  = URL.createObjectURL(blob);
    const name = (payload.personal.name || "resume").replace(/\s+/g, "_").toLowerCase();
    const a    = Object.assign(document.createElement("a"), { href: url, download: `${name}_resume.pdf` });
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    showToast("Your resume PDF is downloading.", "success");
  } catch (err) {
    showToast(`Error: ${err.message}`, "error");
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = "Download PDF";
  }
}

/* ══ Utilities ═══════════════════════════════════════════════════════════════ */
function val(id)    { return (document.getElementById(id)?.value || "").trim(); }
function escHtml(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function showError(msg) {
  const b = document.getElementById("error-banner");
  const t = document.getElementById("error-banner-text");
  if (t) t.textContent = msg;
  b?.classList.add("lc-show");
  b?.scrollIntoView({ behavior: "smooth", block: "center" });
}
function hideError() { document.getElementById("error-banner")?.classList.remove("lc-show"); }

let toastTimer;
function showToast(msg, type = "") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `lc-toast lc-toast--${type} lc-show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("lc-show"), 4500);
}
