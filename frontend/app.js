/* ─── LakshyaCV — app.js ─────────────────────────────────────────────────── */
"use strict";

let currentStep      = 1;
let selectedTemplate = "modern";
const TOTAL_STEPS    = 4;

// ─── Job Role Descriptions ────────────────────────────────────────────────────
const JOB_ROLES = [
  {
    title: "Software Engineer",
    summary: "Software engineer with extensive experience designing, developing, and maintaining complex, high-throughput production-grade systems. Writes clean, scalable, and highly testable code while collaborating with cross-functional product and engineering teams to deliver reliable software architectures. Actively participates in rigorous code reviews, comprehensive system design discussions, and continuous performance optimization to ensure system resilience and maintainability over the software lifecycle.",
    bullets: "Designed and developed scalable software systems across the full software development lifecycle, from initial architecture to deployment and monitoring\nWrote clean, maintainable, and highly efficient code adhering strictly to team standards, design patterns, and industry best practices\nCollaborated directly with product managers, UX/UI design, and QA teams to define technical requirements and deliver complex features strictly on schedule\nTroubleshooted, profiled, and resolved critical production bugs, significantly improving system stability, resource utilization, and overall application performance\nParticipated in extensive code reviews, enforced quality gates, and contributed decisively to high-level system design and architectural decisions"
  },
  {
    title: "Frontend Developer",
    summary: "Frontend developer with deep expertise in building highly responsive, accessible, and performant user interfaces utilizing modern web technologies and component-driven architectures. Integrates complex REST and GraphQL APIs, enforces strict cross-browser compatibility, and maintains precise design system consistency across large-scale enterprise products.",
    bullets: "Built and maintained complex, state-driven user interfaces utilizing modern HTML, CSS, and advanced JavaScript frameworks\nEnsured pixel-perfect responsive design, seamless cross-device functionality, and strict cross-browser compatibility across all supported platforms\nIntegrated REST and GraphQL APIs, engineered robust client-side data flow pipelines, and managed complex global application state\nAudited and improved UI rendering performance, minimized asset payloads, and enforced strict web accessibility (WCAG) standards\nCollaborated closely with UI/UX designers to translate wireframes into functional code while maintaining strict visual consistency and design system integrity"
  },
  {
    title: "Backend Developer",
    summary: "Backend developer specializing in architecting and constructing robust server-side logic, high-performance RESTful/gRPC APIs, and highly optimized distributed database systems. Focused strictly on system performance, robust security protocols, and horizontal scalability to support high-volume, mission-critical production workloads.",
    bullets: "Developed resilient server-side logic, microservices, and RESTful APIs capable of reliably serving millions of concurrent requests\nArchitected, modeled, and managed highly scalable relational and non-relational database clusters, ensuring data integrity and availability\nImplemented advanced authentication mechanisms, precise authorization controls, and stringent security best practices to protect sensitive data\nProfiled systems, optimized complex query execution plans, and significantly reduced server latency and API response times\nEngineered seamless third-party service integrations, managed asynchronous message queues, and executed comprehensive system-level troubleshooting"
  },
  {
    title: "Full Stack Developer",
    summary: "Full stack developer with comprehensive expertise across the entire software architecture, extending from advanced database schema design to responsive client-side user interfaces. Architects, integrates, tests, and deploys fully functional, end-to-end systems with a strict focus on code maintainability, system security, and optimal execution performance.",
    bullets: "Handled concurrent frontend and backend development streams within unified codebases and distributed microservice architectures\nArchitected complete end-to-end systems, including normalized data models, secure API gateways, and dynamic client-facing interfaces\nIntegrated sophisticated user interfaces with complex server-side business logic, external data providers, and third-party SaaS services\nConfigured automated CI/CD pipelines, managed containerized deployments, and maintained highly available systems in rigorous production environments\nSystematically debugged, profiled, and resolved complex architectural bottlenecks and operational issues spanning the full technology stack"
  },
  {
    title: "Data Scientist",
    summary: "Data scientist possessing advanced experience analyzing massive datasets of structured and unstructured data to uncover actionable, statistically significant business insights. Engineers robust predictive models, applies rigorous statistical methodologies, and communicates complex quantitative findings definitively to both technical stakeholders and executive leadership.",
    bullets: "Analyzed massive, multi-dimensional datasets to systematically identify hidden patterns, operational trends, and high-value business opportunities\nEngineered, trained, and rigorously evaluated advanced machine learning models for complex prediction, forecasting, and classification tasks\nCleaned, normalized, and preprocessed vast quantities of raw, noisy data ingested from diverse internal and external sources\nCommunicated complex analytical findings and model outputs through precise data visualizations and comprehensive written technical reports\nCollaborated directly with data engineering teams to operationalize machine learning models and integrate them seamlessly into scalable production environments"
  },
  {
    title: "Machine Learning Engineer",
    summary: "Machine learning engineer with specialized expertise in designing, training, optimizing, and deploying deep learning and ML models at enterprise scale. Processes highly complex, large-scale datasets with a relentless focus on maximizing model accuracy, minimizing inference latency, and ensuring reliable integration into high-throughput production pipelines.",
    bullets: "Architected and trained sophisticated machine learning and deep learning models tailored for specific, high-impact real-world operational use cases\nSystematically optimized model architecture and hyperparameters to maximize prediction accuracy and minimize inference latency in production environments\nEngineered high-performance data pipelines for massive-scale datasets, encompassing complex preprocessing, feature engineering, and distributed training\nPackaged and deployed trained models into highly available production pipelines, serving predictions via optimized REST/gRPC APIs\nImplemented continuous monitoring for model drift and performance degradation, establishing automated retraining cycles to maintain production accuracy"
  },
  {
    title: "DevOps Engineer",
    summary: "DevOps engineer with extensive experience architecting automated deployment pipelines, provisioning scalable cloud infrastructure, and enforcing stringent high-availability standards. Bridges software development and IT operations to eliminate bottlenecks, enforce security protocols, and enable highly accelerated, reliably reproducible software delivery lifecycles.",
    bullets: "Architected and automated robust CI/CD pipelines, drastically reducing software deployment lead times and eliminating manual intervention errors\nProvisioned, configured, and managed highly scalable, resilient cloud infrastructure spanning AWS, Azure, or GCP environments\nDeployed comprehensive telemetry, monitoring system performance, resource utilization, and security compliance across all staging and production environments\nEngineered immutable infrastructure using infrastructure-as-code (IaC) configuration management tools such as Terraform, CloudFormation, or Ansible\nCollaborated directly with software development teams to optimize containerization strategies, streamline build processes, and enforce release management standards"
  },
  {
    title: "Product Manager",
    summary: "Product manager with proven experience defining strategic product vision, extracting precise technical requirements, and driving disciplined cross-functional execution. Translates high-level business objectives into strictly prioritized, actionable product roadmaps, measuring operational success definitively through objective, data-driven key performance indicators.",
    bullets: "Defined long-term product vision, core strategy, and comprehensive roadmaps in strict alignment with executive stakeholders and market demands\nExtracted, documented, and ruthlessly prioritized functional requirements across engineering, UX/UI design, and internal business operations teams\nDirected agile sprint planning ceremonies, managed backlog grooming, and rigorously tracked feature delivery against non-negotiable project milestones\nSynthesized quantitative user analytics and qualitative feedback to validate hypotheses and inform highly objective, data-driven product decisions\nCommunicated product development progress, risk assessments, and measurable business outcomes definitively to executive leadership and key stakeholders"
  },
  {
    title: "Project Manager",
    summary: "Project manager with extensive experience defining project scope, allocating resources, and executing complex deliverables precisely on schedule and within strict budget constraints. Enforces rigorous risk management protocols, facilitates clear cross-functional communication, and strictly controls stakeholder expectations throughout the entire project lifecycle.",
    bullets: "Developed highly detailed project plans, defining critical paths, strict timelines, resource allocations, and concrete project deliverables\nProactively identified, documented, and systematically mitigated operational and technical risks throughout the entire project execution lifecycle\nFacilitated mandatory status synchronization meetings, enforcing accountability and communicating objective progress metrics to all relevant stakeholders\nCoordinated distributed, cross-functional teams to eliminate operational silos and ensure strict alignment on project scope and immediate execution priorities\nDelivered complex technical projects successfully within rigidly defined budget parameters, non-negotiable timelines, and exact quality constraints"
  },
  {
    title: "UI/UX Designer",
    summary: "UI/UX designer with advanced expertise in engineering user interfaces and digital experiences that are highly intuitive, strictly accessible, and visually cohesive. Executes rigorous user research methodologies, produces high-fidelity wireframes and interactive prototypes, and enforces exact design specifications during collaboration with frontend development teams.",
    bullets: "Engineered logical user interfaces and frictionless interaction flows across complex web applications and native mobile platform environments\nProduced detailed wireframes, high-fidelity mockups, and fully interactive prototypes to facilitate objective stakeholder review and technical validation\nExecuted structured user research methodologies and rigorous usability testing to empirically validate design hypotheses and interface decisions\nIteratively improved platform accessibility (WCAG compliance) and core usability metrics based entirely on quantitative analytics and objective user feedback\nCollaborated directly with frontend software engineers to enforce pixel-perfect implementation and maintain strict adherence to centralized design systems"
  },
  {
    title: "QA Engineer / Tester",
    summary: "QA engineer with comprehensive experience architecting rigorous test plans, executing exhaustive manual and automated testing protocols, and enforcing strict quality gates prior to software release. Focused entirely on identifying critical defects early in the development lifecycle and guaranteeing absolute product reliability in production environments.",
    bullets: "Engineered and executed comprehensive test cases encompassing functional, regression, integration, and end-to-end system testing methodologies\nSystematically identified, isolated, meticulously documented, and tracked critical software defects through to verified technical resolution\nArchitected and maintained robust automated testing frameworks to maximize code coverage and minimize manual regression testing overhead\nCollaborated directly with software developers to reliably reproduce edge-case issues and rigorously verify the efficacy of deployed code fixes\nEnforced stringent quality assurance processes, maintained test environments, and dictated strict software release standards and criteria"
  },
  {
    title: "Business Analyst",
    summary: "Business analyst with extensive experience extracting complex operational requirements, translating abstract business objectives into precise technical specifications, and re-engineering workflows. Leverages data analytics and cross-functional stakeholder collaboration to systematically eliminate process inefficiencies and drive measurable operational improvements.",
    bullets: "Extracted, analyzed, and thoroughly documented complex business requirements through structured stakeholder workshops and targeted interviews\nTranslated abstract business objectives into highly detailed, actionable functional and technical specifications for software engineering teams\nAudited existing operational workflows, identified process bottlenecks, and prescribed data-driven strategies for systematic workflow optimization\nActed as the definitive liaison between software development and product teams to guarantee exact adherence to documented business requirements\nEngineered comprehensive data reports and real-time analytical dashboards to support objective, metric-driven business decision-making processes"
  },
  {
    title: "System Administrator",
    summary: "System administrator with deep technical expertise in provisioning, securing, and maintaining enterprise-grade server infrastructure, complex networks, and core IT systems. Enforces absolute system availability, executes rigorous security patch management, and resolves critical infrastructure faults to guarantee uninterrupted business operations.",
    bullets: "Provisioned, configured, and meticulously maintained physical and virtualized server environments, complex network topologies, and core IT infrastructure\nDeployed comprehensive telemetry to monitor real-time system performance, network availability, and absolute security compliance across all operational environments\nExecuted critical software patches, firmware updates, and infrastructure configuration changes in strict adherence to formal change control protocols\nDiagnosed, isolated, and rapidly resolved complex infrastructure outages, hardware failures, and network connectivity disruptions\nAuthored and maintained exhaustive system configuration documentation, disaster recovery plans, and standardized operational runbooks"
  },
  {
    title: "Cybersecurity Analyst",
    summary: "Cybersecurity analyst with specialized experience actively monitoring enterprise networks for advanced threats, executing rigorous vulnerability assessments, and managing immediate incident response protocols. Enforces strict organizational compliance with mandated security frameworks, cryptographic standards, and data protection regulations.",
    bullets: "Deployed advanced SIEM tools to continuously monitor enterprise systems, networks, and endpoints for zero-day security threats and anomalous behavioral activity\nExecuted systematic vulnerability assessments, static/dynamic code analysis, and comprehensive penetration testing exercises on internal infrastructure\nManaged immediate incident response protocols, containing active security breaches and coordinating comprehensive forensic remediation efforts\nArchitected, deployed, and rigorously maintained logical security controls, strict access management policies, and perimeter defense systems\nEnforced absolute organizational compliance with complex cybersecurity frameworks, industry regulations, and legal data protection mandates"
  },
  {
    title: "Database Administrator",
    summary: "Database administrator with extensive expertise architecting, maintaining, and relentlessly optimizing large-scale relational and non-relational database clusters. Enforces absolute data integrity, strict cryptographic security protocols, high-speed query performance, and guaranteed high availability across all mission-critical production systems.",
    bullets: "Architected, normalized, and strictly maintained complex database schemas and indexing strategies for high-throughput production applications\nContinuously profiled database instances, optimized expensive query execution plans, and minimized overall database compute and storage resource consumption\nEngineered and tested resilient backup protocols, point-in-time recovery procedures, and failover mechanisms to guarantee absolute high availability\nEnforced strict data integrity constraints, precise role-based access controls (RBAC), and comprehensive security compliance auditing\nCollaborated directly with software engineering teams to execute complex data modeling, schema migrations, and large-scale data ETL operations"
  },
  {
    title: "Mobile App Developer",
    summary: "Mobile app developer with deep experience engineering highly performant, memory-efficient, and user-friendly native or cross-platform applications for Android and iOS ecosystems. Integrates complex backend APIs, enforces strict application quality standards, and executes rapid iteration cycles based strictly on telemetry and crash analytics.",
    bullets: "Engineered and maintained robust, highly optimized mobile applications tailored for native Android and/or iOS operating system environments\nIntegrated complex REST and GraphQL APIs, engineered resilient offline synchronization, and managed efficient local data storage and application state\nEnforced strict UI rendering performance, minimized battery/memory consumption, and guaranteed seamless responsiveness across heavily fragmented device types\nCompiled, signed, and managed secure application releases strictly adhering to Apple App Store and Google Play Store deployment guidelines\nSystematically isolated bugs, patched memory leaks, and shipped continuous performance improvements based entirely on automated crash reports and user telemetry"
  },
  {
    title: "Cloud Engineer",
    summary: "Cloud engineer with specialized expertise in architecting, provisioning, and securing complex, distributed cloud infrastructure across major tier-one providers. Enforces absolute horizontal scalability, aggressive cost optimization, and guaranteed fault tolerance for all cloud-hosted microservices and enterprise systems.",
    bullets: "Architected and provisioned highly resilient, globally distributed cloud infrastructure environments on AWS, Azure, or Google Cloud Platform (GCP)\nEngineered comprehensive infrastructure-as-code (IaC) templates to guarantee strictly repeatable, auditable, and automated infrastructure deployments\nContinuously audited cloud resource allocation, aggressively optimizing compute and storage usage to minimize operational expenditures without degrading performance\nArchitected secure virtual private clouds (VPCs), enforced strict IAM policies, and guaranteed high availability and disaster recovery for all hosted services\nAutomated complex cloud operations, configuration management, and application deployments utilizing advanced scripting and CI/CD pipeline orchestration tools"
  },
  {
    title: "Technical Support Engineer",
    summary: "Technical support engineer with deep diagnostic expertise in rapidly identifying and resolving complex software, hardware, and network infrastructure issues for enterprise end-users. Focused entirely on minimizing mean-time-to-resolution (MTTR), enforcing precise technical communication, and continuously optimizing tiered support escalation workflows.",
    bullets: "Systematically diagnosed, isolated, and rapidly resolved complex technical software and infrastructure faults for end-users across multiple synchronous and asynchronous channels\nAuthored highly detailed technical solutions, root cause analyses, and standardized troubleshooting protocols to populate the centralized engineering knowledge base\nEscalated critical, systemic issues directly to core engineering teams, providing exact reproduction steps, log files, and environmental variables\nManaged complex ticket queues, rigorously tracking open cases and enforcing strict service-level agreements (SLAs) to guarantee timely technical resolution\nAnalyzed support ticket telemetry to identify recurring platform defects, contributing directly to the systematic optimization of tier-one support processes"
  },
  {
    title: "Sales Executive",
    summary: "Sales executive with a proven track record of identifying high-value commercial opportunities, executing strategic outbound acquisitions, and aggressively exceeding organizational revenue targets. Utilizes rigorous pipeline management methodologies, advanced enterprise negotiation tactics, and data-driven forecasting to consistently close complex, high-yield business contracts.",
    bullets: "Executed targeted outbound prospecting and strategic networking protocols to systematically identify, qualify, and acquire new high-value business opportunities\nEngineered and strictly maintained highly profitable commercial relationships with key decision-makers across existing enterprise and prospective client accounts\nConsistently outperformed mandated monthly and quarterly revenue quotas through aggressive pipeline execution and high-conversion closing methodologies\nExecuted complex contract negotiations, defining pricing structures and service level agreements to close highly competitive mid-market and enterprise deals\nMaintained absolute data fidelity within the organizational CRM, providing executive management with highly accurate revenue forecasting and pipeline analytics"
  },
  {
    title: "Marketing Manager",
    summary: "Marketing manager with extensive experience engineering and deploying high-ROI, multi-channel marketing campaigns spanning digital and traditional acquisition vectors. Employs a strictly quantitative, data-driven approach to brand positioning, qualified lead generation, budget allocation, and continuous performance optimization.",
    bullets: "Engineered, budgeted, and deployed highly targeted, integrated marketing campaigns simultaneously across diverse digital, social, and traditional acquisition channels\nDirected comprehensive content distribution strategies, algorithmic social media optimization, and highly segmented, automated email marketing operations\nContinuously extracted and analyzed campaign telemetry, executing rapid A/B multivariate testing to optimize conversion rates and minimize customer acquisition costs (CAC)\nSynchronized go-to-market strategies and product launch activities directly with internal software design, enterprise sales, and product management teams\nMonitored critical performance indicators (KPIs) in real-time, delivering definitive, data-backed reports on marketing ROI and budget efficiency to executive leadership"
  },
  {
    title: "HR Manager",
    summary: "Human resources manager with comprehensive expertise directing enterprise-scale talent acquisition, structured onboarding, rigorous performance evaluation, and complex employee relations protocols. Enforces strict organizational compliance with all local and federal employment legislation while engineering logical, scalable HR policies to maintain operational efficiency.",
    bullets: "Directed highly optimized, end-to-end talent acquisition pipelines, sourcing, interviewing, and securing top-tier talent for complex technical and non-technical roles\nEngineered and executed structured, accelerated employee onboarding and induction protocols to minimize time-to-productivity for new organizational hires\nInvestigated and resolved complex, high-risk employee relations matters, enforcing absolute operational fairness, strict documentation, and legal confidentiality\nAuthored, implemented, and rigorously maintained comprehensive HR policy frameworks, guaranteeing absolute compliance with all evolving employment laws and regulations\nDirected standardized performance evaluation cycles, enforcing objective KPI-driven assessments, and facilitating structured professional development and remediation plans"
  }
];


// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  populateRoleDropdowns();
  addBlock("experience");
  addBlock("education");
  addBlock("projects");
  updateCompleteness();
  document.querySelectorAll("input, textarea").forEach(el => {
    el.addEventListener("input", updateCompleteness);
  });
});

// ─── Populate all role dropdowns ──────────────────────────────────────────────
function populateRoleDropdowns() {
  const selects = document.querySelectorAll(".role-dropdown");
  selects.forEach(sel => {
    JOB_ROLES.forEach(role => {
      const opt = document.createElement("option");
      opt.value = role.title;
      opt.textContent = role.title;
      sel.appendChild(opt);
    });
  });
  // Also populate the static summary dropdown
  const summarySelect = document.getElementById("summary-role-select");
  if (summarySelect) {
    JOB_ROLES.forEach(role => {
      const opt = document.createElement("option");
      opt.value = role.title;
      opt.textContent = role.title;
      summarySelect.appendChild(opt);
    });
  }
}

// ─── Generate Panel ───────────────────────────────────────────────────────────
function openGeneratePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.classList.toggle("open");
}

function previewGeneratedText(selectId, targetFieldId) {
  const select = document.getElementById(selectId);
  const useBtn = select?.closest(".generate-panel")?.querySelector(".btn-use-description");
  if (useBtn) useBtn.disabled = !select.value;
}

function insertGeneratedText(selectId, targetFieldId, panelId) {
  const select   = document.getElementById(selectId);
  const field    = document.getElementById(targetFieldId);
  const panel    = document.getElementById(panelId);
  if (!select?.value || !field) return;

  const role = JOB_ROLES.find(r => r.title === select.value);
  if (!role) return;

  // Determine if this is a summary field or a bullets field
  const isSummary = targetFieldId === "summary";
  field.value = isSummary ? role.summary : role.bullets;
  field.dispatchEvent(new Event("input"));

  if (panel) panel.classList.remove("open");
  showToast("Draft inserted. Please personalise it before submitting.", "success");
  field.focus();
  field.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ─── Template Selection ───────────────────────────────────────────────────────
function selectTemplate(name) {
  selectedTemplate = name;
  ["classic", "executive", "modern"].forEach(t => {
    document.getElementById(`tpl-${t}`).classList.toggle("selected", t === name);
  });
  const nameMap = { classic: "Classic (B&W)", executive: "Executive (Navy)", modern: "Modern (Teal)" };
  const badge = document.getElementById("sidebar-tpl-name");
  if (badge) badge.textContent = nameMap[name] || name;
}

// ─── Step Navigation ──────────────────────────────────────────────────────────
function goToStep(step) {
  if (step === 2 && !validateStep1()) return;

  document.querySelector(`#step-${currentStep}`).classList.remove("active");
  currentStep = step;
  document.querySelector(`#step-${currentStep}`).classList.add("active");

  // Sync both vertical sidebar and horizontal mobile trackers
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const state = i < currentStep ? "done" : i === currentStep ? "active" : "todo";
    const vEl = document.getElementById(`step-v-${i}`);
    if (vEl) { vEl.classList.remove("done","active","todo"); vEl.classList.add(state); }
    const hEl = document.getElementById(`step-h-${i}`);
    if (hEl) { hEl.classList.remove("done","active","todo"); hEl.classList.add(state); }
  }

  if (step === 4) buildReviewPanel();
  window.scrollTo({ top: 0, behavior: "smooth" });
  hideError();
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateStep1() {
  const name  = val("p-name");
  const email = val("p-email");
  if (!name) {
    showError("Please enter your full name before continuing.");
    document.getElementById("p-name").focus(); return false;
  }
  if (!email) {
    showError("Please enter your email address before continuing.");
    document.getElementById("p-email").focus(); return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("Please enter a valid email address.");
    document.getElementById("p-email").focus(); return false;
  }
  return true;
}

// ─── Tips ─────────────────────────────────────────────────────────────────────
function toggleTip(id) {
  document.getElementById(id)?.classList.toggle("open");
}

// ─── Repeatable Blocks ────────────────────────────────────────────────────────
let blockCounters = { experience: 0, education: 0, projects: 0 };

function addBlock(type) {
  const id        = ++blockCounters[type];
  const container = document.getElementById(`${type}-blocks`);
  const div       = document.createElement("div");
  div.className   = "repeat-block";
  div.id          = `${type}-block-${id}`;
  div.innerHTML   = blockTemplate(type, id);
  container.appendChild(div);

  // Populate any role dropdowns in newly added block
  const newSelects = div.querySelectorAll(".role-dropdown");
  newSelects.forEach(sel => {
    JOB_ROLES.forEach(role => {
      const opt = document.createElement("option");
      opt.value = role.title;
      opt.textContent = role.title;
      sel.appendChild(opt);
    });
  });

  div.style.opacity = "0";
  div.style.transform = "translateY(8px)";
  requestAnimationFrame(() => {
    div.style.transition = "opacity 0.2s, transform 0.2s";
    div.style.opacity = "1";
    div.style.transform = "translateY(0)";
  });
  updateCompleteness();
}

function removeBlock(type, id) {
  const container = document.getElementById(`${type}-blocks`);
  if (container.querySelectorAll(".repeat-block").length <= 1) {
    showToast("You need at least one entry.", "error"); return;
  }
  const el = document.getElementById(`${type}-block-${id}`);
  el.style.transition = "opacity 0.15s, transform 0.15s";
  el.style.opacity = "0";
  el.style.transform = "translateY(-6px)";
  setTimeout(() => el.remove(), 160);
  updateCompleteness();
}

function ordinal(n) {
  const s = ["th","st","nd","rd"], v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

function blockTemplate(type, id) {
  const typeLabel = type === "experience" ? "Role" : type === "education" ? "Qualification" : "Project";
  const header    = `
    <div class="repeat-block-header">
      <span class="repeat-block-label">${typeLabel} ${ordinal(id)}</span>
      <button class="btn-remove" onclick="removeBlock('${type}',${id})" type="button">Remove</button>
    </div>`;

  if (type === "experience") return `${header}
    <div class="form-row">
      <div class="form-group">
        <label for="exp-company-${id}">Company / Organisation</label>
        <input type="text" id="exp-company-${id}" placeholder="e.g. Acme Technologies Ltd." oninput="updateCompleteness()" />
      </div>
      <div class="form-group">
        <label for="exp-role-${id}">Job Title</label>
        <input type="text" id="exp-role-${id}" placeholder="e.g. Software Engineer" oninput="updateCompleteness()" />
      </div>
    </div>
    <div class="form-group">
      <label for="exp-period-${id}">Period</label>
      <span class="hint-text">e.g. Jan 2022 &ndash; Mar 2024, or 2022 &ndash; Present</span>
      <input type="text" id="exp-period-${id}" placeholder="Jan 2022 – Present" />
    </div>
    <div class="form-group">
      <div class="field-action-row">
        <label for="exp-bullets-${id}">Achievements / Responsibilities</label>
        <button class="btn-generate-desc" type="button" onclick="openGeneratePanel('exp-gen-panel-${id}')">
          <svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:white;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Generate
        </button>
      </div>
      <div class="generate-panel" id="exp-gen-panel-${id}">
        <div class="generate-panel-title">
          <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:var(--col-info);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Pre-defined Description Generator
        </div>
        <div class="generate-warning">
          <strong>Before you use this:</strong> These are generic bullet points written for a typical role. You must personalise them with your real achievements, numbers, and outcomes. A generic description will not stand out &mdash; use this only as a starting draft to refine.
        </div>
        <div class="generate-select-row">
          <div class="select-wrap">
            <select class="role-dropdown" id="exp-role-select-${id}"
              onchange="previewGeneratedText('exp-role-select-${id}', 'exp-bullets-${id}')">
              <option value="">Select your job role&hellip;</option>
            </select>
          </div>
          <button class="btn-use-description" id="exp-use-btn-${id}" type="button" disabled
            onclick="insertGeneratedText('exp-role-select-${id}', 'exp-bullets-${id}', 'exp-gen-panel-${id}')">
            Use as Draft
          </button>
        </div>
      </div>
      <span class="hint-text">One achievement per line. Start with a strong action verb.</span>
      <textarea id="exp-bullets-${id}" rows="5"
        placeholder="Developed and maintained RESTful APIs serving 50,000+ daily requests&#10;Reduced deployment pipeline time from 45 minutes to 8 minutes through CI/CD automation&#10;Led a team of 3 engineers to deliver a new billing module ahead of schedule&#10;Resolved critical production incidents with an average resolution time of under 2 hours"
        oninput="updateCompleteness()"></textarea>
    </div>`;

  if (type === "education") return `${header}
    <div class="form-row">
      <div class="form-group">
        <label for="edu-institution-${id}">Institution</label>
        <input type="text" id="edu-institution-${id}" placeholder="e.g. University of Toronto" oninput="updateCompleteness()" />
      </div>
      <div class="form-group">
        <label for="edu-year-${id}">Year / Period</label>
        <input type="text" id="edu-year-${id}" placeholder="2020 – 2024" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="edu-degree-${id}">Degree / Programme</label>
        <input type="text" id="edu-degree-${id}" placeholder="Bachelor of Science in Computer Science" oninput="updateCompleteness()" />
      </div>
      <div class="form-group">
        <label for="edu-gpa-${id}">GPA (optional)</label>
        <span class="hint-text">Include only if 3.5 or above</span>
        <input type="text" id="edu-gpa-${id}" placeholder="3.8 / 4.0" />
      </div>
    </div>`;

  if (type === "projects") return `${header}
    <div class="form-row">
      <div class="form-group">
        <label for="proj-name-${id}">Project Name</label>
        <input type="text" id="proj-name-${id}" placeholder="e.g. Inventory Management System" oninput="updateCompleteness()" />
      </div>
      <div class="form-group">
        <label for="proj-url-${id}">URL / GitHub Link</label>
        <span class="hint-text">Shown as &ldquo;View&rdquo; hyperlink in the PDF</span>
        <input type="url" id="proj-url-${id}" placeholder="github.com/yourname/project" />
      </div>
    </div>
    <div class="form-group">
      <label for="proj-tech-${id}">Tech Stack</label>
      <span class="hint-text">Comma-separated technologies used</span>
      <input type="text" id="proj-tech-${id}" placeholder="Python, Django, PostgreSQL, Docker, React" />
    </div>
    <div class="form-group">
      <label for="proj-desc-${id}">Description</label>
      <span class="hint-text">What problem does it solve? One bullet per line.</span>
      <textarea id="proj-desc-${id}" rows="3"
        placeholder="Built a web-based inventory system used by a local business to track 500+ products&#10;Reduced manual stock-taking time by 70% through automated reorder alerts&#10;Deployed on a cloud VPS with automated daily backups and uptime monitoring"
        oninput="updateCompleteness()"></textarea>
    </div>`;
}

// ─── Skills Tags ──────────────────────────────────────────────────────────────
function renderSkillTags() {
  const tags    = val("skills").split(",").map(s => s.trim()).filter(Boolean);
  const preview = document.getElementById("skills-preview");
  preview.innerHTML = tags.map(t => `<span class="skill-tag">${escHtml(t)}</span>`).join("");
  updateCompleteness();
}

// ─── Char Counter ─────────────────────────────────────────────────────────────
function updateCharCount(el, counterId, max) {
  const len     = el.value.length;
  const counter = document.getElementById(counterId);
  counter.textContent = `${len} / ${max}`;
  counter.classList.toggle("warn", len > max * 0.9);
}

// ─── Completeness ─────────────────────────────────────────────────────────────
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
  // Mobile bar
  const mFill = document.getElementById("completeness-fill");
  const mPct  = document.getElementById("completeness-pct");
  if (mFill) mFill.style.width = `${pct}%`;
  if (mPct)  mPct.textContent  = `${pct}%`;
  // Sidebar bar
  const sFill = document.getElementById("sidebar-fill");
  const sPct  = document.getElementById("sidebar-pct");
  if (sFill) sFill.style.width = `${pct}%`;
  if (sPct)  sPct.textContent  = `${pct}%`;
}

// ─── Review Panel ─────────────────────────────────────────────────────────────
function buildReviewPanel() {
  const expCount  = document.querySelectorAll("[id^='exp-company-']").length;
  const eduCount  = document.querySelectorAll("[id^='edu-institution-']").length;
  const projCount = document.querySelectorAll("[id^='proj-name-']").length;
  const skills    = val("skills").split(",").filter(s => s.trim()).length;
  const tplNames  = { classic: "Classic (Black & White)", executive: "Executive (Navy)", modern: "Modern (Teal)" };

  const chips = [
    { label: "Name",       value: val("p-name")    || "—" },
    { label: "Title",      value: val("p-title")   || "—" },
    { label: "Email",      value: val("p-email")   || "—" },
    { label: "Location",   value: val("p-location")|| "—" },
    { label: "Template",   value: tplNames[selectedTemplate] || selectedTemplate },
    { label: "Experience", value: `${expCount} role${expCount !== 1 ? "s" : ""}` },
    { label: "Education",  value: `${eduCount} entr${eduCount !== 1 ? "ies" : "y"}` },
    { label: "Skills",     value: `${skills} skill${skills !== 1 ? "s" : ""}` },
    { label: "Projects",   value: `${projCount} project${projCount !== 1 ? "s" : ""}` },
  ];

  document.getElementById("review-grid").innerHTML = chips.map(c => `
    <div class="review-chip">
      <div class="review-chip-label">${c.label}</div>
      <div class="review-chip-value">${escHtml(String(c.value))}</div>
    </div>`).join("");
}

// ─── Collect Form Data ────────────────────────────────────────────────────────
function collectFormData() {
  const experience = [];
  document.querySelectorAll("[id^='exp-company-']").forEach(el => {
    const id = el.id.split("-").pop();
    experience.push({
      company: val(`exp-company-${id}`), role: val(`exp-role-${id}`),
      period:  val(`exp-period-${id}`),  bullets: val(`exp-bullets-${id}`),
    });
  });
  const education = [];
  document.querySelectorAll("[id^='edu-institution-']").forEach(el => {
    const id = el.id.split("-").pop();
    education.push({
      institution: val(`edu-institution-${id}`), degree: val(`edu-degree-${id}`),
      year: val(`edu-year-${id}`), gpa: val(`edu-gpa-${id}`),
    });
  });
  const projects = [];
  document.querySelectorAll("[id^='proj-name-']").forEach(el => {
    const id = el.id.split("-").pop();
    projects.push({
      name: val(`proj-name-${id}`), description: val(`proj-desc-${id}`),
      tech: val(`proj-tech-${id}`), url: val(`proj-url-${id}`),
    });
  });
  return {
    personal: {
      name: val("p-name"), title: val("p-title"), email: val("p-email"),
      phone: val("p-phone"), location: val("p-location"),
      linkedin: val("p-linkedin"), github: val("p-github"), website: val("p-website"),
    },
    summary: val("summary"), skills: val("skills"), template: selectedTemplate,
    experience, education, projects,
  };
}

// ─── Generate PDF ─────────────────────────────────────────────────────────────
async function generateResume() {
  const btn = document.getElementById("generate-btn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Generating PDF&hellip;`;

  try {
    const payload  = collectFormData();
    const response = await fetch("/generate", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Server error ${response.status}`);
    }
    const blob = await response.blob();
    const url  = URL.createObjectURL(blob);
    const name = (payload.personal.name || "resume").replace(/\s+/g, "_").toLowerCase();
    const a    = Object.assign(document.createElement("a"), { href: url, download: `${name}_resume.pdf` });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Resume PDF is downloading.", "success");
  } catch (err) {
    showToast(`Error: ${err.message}`, "error");
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = "Download PDF";
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function val(id)    { return (document.getElementById(id)?.value || "").trim(); }
function escHtml(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function showError(msg) {
  const b = document.getElementById("error-banner");
  b.textContent = msg; b.classList.add("show");
  b.scrollIntoView({ behavior: "smooth", block: "center" });
}
function hideError() { document.getElementById("error-banner").classList.remove("show"); }

let toastTimer;
function showToast(msg, type = "") {
  const t = document.getElementById("toast");
  t.textContent = msg; t.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 4000);
}
