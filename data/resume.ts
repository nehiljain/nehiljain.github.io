import { Icons } from '@/components/icons';

export const DATA = {
  name: 'Nehil Jain',
  initials: 'NJ',
  org: 'Anyscale',
  title: 'Member of Technical Staff',
  currentFocus: 'Scaling AI infrastructure for the enterprise',
  location: 'SF Bay Area',
  // nehiljain.com lapsed in 2026 and its mail now goes to a third party. Add a new address to bring the Email links back.
  email: '',
  description: "An ML platform engineer who loves solving problems for customers at Anyscale. I have been partnering with ML team and leaders to scale their AI solutions with Ray. I have been coding for over 10+ years. I love distributed systems and the startup ethos. Also a bit of sketchnoting and pickleball (these keep changing)",
  avatarUrl: '/nehil_profile_pic.jpg',
  contact: {
    social: {
      GitHub: {
        icon: Icons.gitHub,
        url: 'https://github.com/nehiljain',
        label: 'GitHub',
        navbar: true
      },
      LinkedIn: {
        icon: Icons.linkedIn,
        url: 'https://linkedin.com/in/nehiljain',
        label: 'LinkedIn',
        navbar: true
      },
      Twitter: {
        icon: Icons.twitter,
        url: 'https://x.com/nehiljain',
        label: 'Twitter',
        navbar: true
      }
    }
  },
  skills: [
    {
      type: 'AI and Machine Learning',
      tools: [
        'Agentic Applications',
        'RAG',
        'LLM Serving (vLLM, Ray Serve)',
        'LLM Fine-tuning (LoRA, RLHF, GRPO)',
        'Sentence Transformers',
        'MLOps',
        'Forecasting'
      ]
    },
    {
      type: 'Data Engineering and Infrastructure',
      tools: [
        'Python',
        'SQL',
        'Ray (Data, Serve, Train)',
        'Spark / PySpark',
        'Dagster',
        'Airflow',
        'MLflow',
        'Snowflake',
        'Databricks',
        'dbt',
        'PyArrow'
      ]
    },
    {
      type: 'Cloud and Distributed Systems',
      tools: [
        'AWS',
        'Azure',
        'GCP',
        'Kubernetes',
        'Docker',
        'A100 / H100 / A10G / L40S GPUs'
      ]
    },
    {
      type: 'Frameworks and Tools',
      tools: [
        'PyTorch',
        'LangChain',
        'LangGraph',
        'LangSmith',
        'FastAPI',
        'Streamlit',
        'Playwright',
        'XGBoost',
        'pyGAM'
      ]
    }
  ],
  work: [
    {
      company: 'Anyscale',
      title: 'Member of Technical Staff',
      start: 'Sep 2025',
      end: 'Present',
      highlights: [
        'Field engineer for 10+ Fortune 500 accounts building on Ray.',
        'Own a book of strategic accounts and a qualified pre-sales pipeline.',
        'Drove 6x growth for a leading productivity-software customer by migrating Spark + OpenAI embeddings to Ray Data with self-hosted models.',
        'Shipped upstream Ray Data and Ray Serve fixes that unblocked customer training and serving workloads.',
        'Core team member for Ray on the Roads; delivered SF workshop to 150+ engineers and helped win a new customer through a 4-hour custom workshop.'
      ],
      href: 'https://www.anyscale.com/'
    },
    {
      company: 'DemoDrive AI',
      title: 'Founder & CEO',
      start: 'May 2024',
      end: 'Aug 2025',
      highlights: [
        'Built an agentic video editor for DevRel teams from zero (Playwright automation → AI scripting → Remotion render).',
        'Ran 70+ discovery interviews across Okta, Google, Stripe, Shopify, Microsoft; executed 3 product pivots in 8 months.',
        'Shipped 120+ automated videos cutting content creation time 70% across 5 pilots; secured 1 paid pilot and 2 design partners.',
        'Placed in 4 SF AI hackathons: 1st at MongoDB GenAI ($2k, KinConnect), solo 1st at Luma AI, 2nd at E2B × Fireworks AI (ProoferX), 3rd at LangChain Agents & Compound AI Systems (LazyPMs) - featured by Fireworks AI as a triple-hackathon placer.'
      ],
      href: 'https://github.com/demodrive-ai'
    },
    {
      company: 'QuantumBlack, McKinsey',
      title: 'Principal AI Engineer',
      start: 'Nov 2022',
      end: 'Apr 2024',
      highlights: [
        'Led AI engineering across Fortune 500 clients in insurance, CPG, and mining.',
        'Led a 7-person team building a life-insurance claims LLM RAG system (AWS Textract OCR beat GPT-4V, LangChain knowledge-graph, FastAPI) - 82% accuracy, 64% actuarial-dependency reduction, ~$5M/year savings.',
        'Built a dbt data-quality framework across 107 CPG supply-chain teams (70% → 98% pass rate, $30M+ EBITDA in a quarter).',
        'Managed 9 engineers across a copper-mining forecasting program - 18 production models, 40% faster deployments, 4+ patents.'
      ],
      href: 'https://www.mckinsey.com/capabilities/quantumblack/how-we-help-clients/'
    },
    {
      company: 'QuantumBlack, McKinsey',
      title: 'Senior AI Engineer II',
      start: 'Jan 2021',
      end: 'Oct 2022',
      highlights: [
        "Designed a Delta Lake feature store for a major telecom's churn-prediction program with automated retraining into CRM workflows - 11% QoQ customer win-back lift.",
        'Refactored Spark pipelines on a crushing-optimization workload (incremental processing, vectorized UDFs) cutting runtime from 2h to 4min (96%).',
        'Designed the pair-programming interview process across 12 McKinsey global offices.'
      ],
      href: 'https://www.mckinsey.com/capabilities/quantumblack/how-we-help-clients/'
    },
    {
      company: 'Super.com',
      title: 'Tech Lead - Data',
      start: 'Jan 2019',
      end: 'Nov 2020',
      highlights: [
        'Led a 12-person data + analytics team building the unified data platform (Airflow consuming 5M+ events/day into S3, dbt revenue models, Looker/Mode) - contributed to 22% YoY revenue uplift through Series B.',
        'Facilitated COVID war-room sessions with dbt unit-economics models, supporting vendor renegotiations for seven-figure savings, 18% OPEX cut, and 3 consecutive profitable months.',
        'Built a smart-bidding system (XGBoost on FastAPI/ECS) lifting margin 10% → 13%, cutting CPA 15%, driving 20% ROAS improvement.',
        'Rolled out self-serve analytics cutting KPI delivery 10d → 1d.'
      ],
      href: 'https://www.super.com/'
    },
    {
      company: 'Super.com',
      title: 'Founding Engineer - Data',
      start: 'Jul 2016',
      end: 'Dec 2018',
      highlights: [
        'Architected a scalable event pipeline from scratch processing 5M+ events/day at 98% reliability with sub-hourly latency and 20% cost cut via incremental processing.',
        'Built a location recognition model on 500K labeled chat events (Random Forest on Spark MLlib) - F1 0.96, 15% personalization lift, 8% reduction in time-to-booking.'
      ],
      href: 'https://www.super.com/'
    },
    {
      company: 'Athletigen',
      title: 'Co-Founder',
      start: 'Apr 2013',
      end: 'Jul 2016',
      highlights: [
        'Co-founded biotech startup combining genomics and AI for elite athletes.',
        'Scaled to 16,000 reports, built 8-person engineering team, and designed genetic analytics pipeline on Spark and AWS.'
      ],
      href: 'https://www.athletigen.com/'
    }
  ],
  education: [
    {
      school: 'BITS Pilani University',
      degree: 'MS in Mathematics & B.E. in Electronics',
      start: '2008',
      end: '2013',
      location: 'Pilani, Rajasthan, India'
    }
  ],
  projects: [
    {
      industry: 'AI Infrastructure',
      tag: 'Autoresearch',
      title: 'Batch Embeddings Optimization at Scale',
      status: 'current',
      description:
        "Ran an 80-experiment autoresearch-style sweep across a customer's AI search embedding pipeline (millions of pages), tuning Ray Data + self-hosted embedding throughput.",
      impact:
        '3.2x wall-time speedup, 60% GPU cost reduction, and stable 10M-row processing.',
      role: 'Member of Technical Staff',
      technologies: [
        'Ray Data',
        'Sentence Transformers',
        'LlamaFactory',
        'PyTorch',
        'A100 GPUs'
      ]
    },
    {
      industry: 'AI Infrastructure',
      tag: 'Claude Skills',
      title: 'Sales Context DataHub - Agent at Scale',
      status: 'current',
      description:
        'Built an agent-at-scale system over 7 fragmented internal sources (CRM, call recordings, support, ticketing, billing, chat and docs) for the field engineering team - Ray Data batch pipeline, recursive LLM summarization, dbt semantic layer, Claude agent skill, Streamlit app.',
      impact:
        'Cut weekly account-review prep from 2h to 20min (50+ person-hours saved weekly); the exec-summary format was adopted by leadership for a broader rollout.',
      role: 'Member of Technical Staff',
      technologies: [
        'Ray Data',
        'dbt',
        'Claude Skills',
        'Streamlit',
        'FastAPI',
        'PyArrow'
      ]
    },
    {
      industry: 'AI Infrastructure',
      title: 'Ray Data OSS Vector Sink Connector',
      status: 'current',
      description:
        'Shipped a production-grade vector-DB connector to Ray OSS with column-oriented batching, memory-safe sort+slice implementation, and a PyArrow hash-order bugfix.',
      impact:
        "Delivered faster write throughput and prevented silent data corruption; now part of Ray open source (ray-project/ray#58910) and unblocked a customer's pipeline migration.",
      role: 'Member of Technical Staff',
      technologies: ['Ray Data', 'PyArrow', 'Python', 'AWS']
    },
    {
      industry: 'AI Infrastructure',
      title: 'Production Ray Service Outage Restore',
      status: 'current',
      description:
        "Root-caused a 100%-timeout Ray Serve outage in a customer's production region in under 3 hours by finding a silent PyTorch CUDA driver mismatch.",
      impact:
        'Outage restored in <3 hours; shipped a fail-fast torch.cuda.is_available() startup assertion as systemic mitigation.',
      role: 'Member of Technical Staff',
      technologies: ['Ray Serve', 'Python', 'PyTorch', 'CUDA']
    },
    {
      industry: 'AI Infrastructure',
      title: 'Ray Data Backpressure - Upstream Platform Fix',
      status: 'current',
      description:
        "Unblocked a medical-imaging customer's training across TBs of data by root-causing a prefetch-vs-consume OOM at 95.7% node memory. Shipped a dynamic-output-queue-size backpressure default upstream.",
      impact:
        'Replaced 20+ overnight manual restarts per training cycle with unattended sustained training, freeing ML researchers.',
      role: 'Member of Technical Staff',
      technologies: ['Ray Data', 'PyTorch', 'H100 GPUs', 'Kubernetes']
    },
    {
      industry: 'Robotics',
      tag: 'Prototype',
      title: 'Autonomous Systems Ray Data Pipeline - Reference Pattern',
      status: 'past',
      description:
        'Prototyped a Ray Data reference pattern for autonomous-systems MCAP-to-tensor workloads, with on-the-fly H265 decoding and streaming reads from raw sensor data.',
      impact:
        'Reference design illustrating heterogeneous CPU-decode / GPU-train compute as an enablement artifact for customer evaluation - not a customer production deployment.',
      role: 'Member of Technical Staff',
      technologies: ['Ray Data', 'MCAP', 'H265', 'PyTorch']
    },
    {
      industry: 'DevTools',
      title: 'DemoDrive - AI Video Editor for DevRel',
      status: 'past',
      description:
        'Built AI-powered video editor from scratch with AI agents as first-class citizens. Created 120+ automated videos for 5 pilot customers.',
      impact:
        'Reduced content creation time by 70%. Secured 1 paid pilot and 2 design partners.',
      role: 'Founder & CEO',
      technologies: [
        'Django',
        'React',
        'Claude 3.5 Sonnet',
        'Gemini Flash',
        'Remotion',
        'Playwright',
        'ffmpeg'
      ]
    },
    {
      industry: 'Real Estate',
      tag: 'Applied AI',
      title: 'AI House Tour Video Generator',
      status: 'past',
      description:
        'Won Luma AI Hackathon as the only solo participant. Built tool that generates cinematic house tour videos from Zillow listings using AI.',
      impact:
        'Demonstrated end-to-end AI video generation pipeline producing 100+ videos from real estate data.',
      role: 'Solo Developer',
      technologies: ['Luma AI', 'Python', 'Zillow API']
    },
    {
      industry: 'DevTools',
      title: 'ProoferX - AI Documentation Validator',
      status: 'past',
      description:
        'Placed 2nd at the E2B × Fireworks AI Hackathon (2024) by building a multi-agent documentation validator that extracts code from technical guides, defines success criteria, and runs the code in sandboxes to catch broken examples.',
      impact:
        'Generated 18 validation reports and surfaced broken or incomplete code in official OpenAI, Vite, and E2B documentation - caught ~25% of tutorial issues automatically. Featured by Fireworks AI.',
      role: 'Tech Lead',
      technologies: [
        'LangGraph',
        'E2B Sandbox',
        'Fireworks AI (Llama)',
        'Firecrawl',
        'LangChain',
        'Pydantic'
      ]
    },
    {
      industry: 'DevTools',
      title: 'LazyPMs - AI Release Notes Generator',
      status: 'past',
      description:
        'Placed 3rd at the LangChain-sponsored Agents & Compound AI Systems Hackathon (2024) by building a multi-agent release-notes system.',
      impact:
        'Created a tool that transforms sparse release notes into rich documentation tailored for different audiences (CEO, developers, downstream teams) through coordinated AI agents.',
      role: 'Tech Lead',
      technologies: [
        'LangGraph',
        'LangChain',
        'Fireworks AI (Llama)',
        'GitHub API',
        'FastAPI',
        'Modal Labs',
        'Pipedream'
      ]
    },
    {
      industry: 'Events',
      tag: 'Applied AI',
      title: 'KinConnect - AI Hackathon Team Matcher',
      status: 'past',
      description:
        'Won 1st place at MongoDB GenAI Hackathon (2024) by building an AI-powered team matcher using MongoDB Hybrid Search (vector + keyword with Reciprocal Rank Fusion) on participant profiles, skills, and interests.',
      impact:
        '$2k in Fireworks AI credits awarded; dev cost stayed under $1 for the full prototype. Featured by Fireworks AI as the headline of their triple-hackathon placement article.',
      role: 'Tech Lead',
      technologies: [
        'Fireworks AI (Llama)',
        'MongoDB Atlas Hybrid Search',
        'FastAPI',
        'LangChain',
        'Pydantic'
      ]
    },
    {
      industry: 'Personal Finance',
      tag: 'Applied AI',
      title: 'AI-Driven Personal Budget Assistant',
      status: 'past',
      description:
        'Currently building an AI-driven application designed to automate the categorization of personal financial transactions. This project involves using state-of-the-art Large Language Models (LLMs) to classify transactions based on descriptions and enriched context from Google search results.',
      impact:
        'The initiative aims to reduce manual categorization errors, enhance user experience by minimizing the need for manual input, and improve financial management efficiency.',
      role: 'AI Engineer',
      technologies: ['Python', 'OpenAI API', 'Groq', 'LangSmith']
    },
    {
      industry: 'Insurance',
      tag: 'Applied AI',
      title: 'Insurance Claims Processing with LLM RAG',
      status: 'past',
      description:
        'Led 7-person team building LLM RAG system for life insurance policy processing. Built OCR ingestion pipeline using AWS Textract with LangChain integration.',
      impact:
        'Achieved 82% accuracy, reduced actuarial workflow dependencies by 64%, saving ~$5M annually.',
      role: 'Tech Lead',
      technologies: [
        'AWS',
        'Kubernetes',
        'Langchain',
        'FastAPI',
        'React',
        'Sagemaker'
      ]
    },
    {
      industry: 'Telecommunications',
      tag: 'MLOps',
      title: 'Telecom Customer Retention Enhancement',
      status: 'past',
      description:
        'Initiated and led the development of advanced machine learning models that successfully increased the customer win-back rate by 11%.',
      impact:
        'Enhanced customer retention strategies and set a new benchmark for predictive analytics in the telecommunications sector.',
      role: 'Tech Lead',
      technologies: ['AWS Databricks', 'Airflow', 'Dbx']
    },
    {
      industry: 'Mining',
      tag: 'ML Platform',
      title: 'Mining Operations Optimization',
      status: 'past',
      description:
        'Managed a team of 9 data engineers and machine learning experts to implement cutting-edge ML solutions that enhanced core mining processes.',
      impact:
        'Reduced mining carbon footprint by 4%. Implemented MLOps best practices for model versioning and deployment, involving 18 models in production retrained monthly.',
      role: 'ML Tech Lead',
      technologies: [
        'Azure Databricks',
        'Dagster',
        'Azure',
        'Snowflake',
        'dbt',
        'pyGAM'
      ]
    },
    {
      industry: 'Consumer Packaged Goods',
      tag: 'ML Platform',
      title: 'CPG Supply Chain Optimization',
      status: 'past',
      description:
        'Designed and implemented a comprehensive org-wide quality solution that significantly enhanced the reliability of data products, driving business decisions.',
      impact:
        'Increased revenue by 18% within a single quarter through predictive modeling of customer fulfillment rates.',
      role: 'ML Tech Lead',
      technologies: ['Snowflake', 'dbt', 'Azure', 'AzureML']
    },
    {
      industry: 'Travel and Hospitality',
      tag: 'Data Platform',
      title: 'Data-Driven Transformation at SnapTravel',
      status: 'past',
      description:
        "Led a team of 12 to overhaul SnapTravel's data platform, integrating advanced analytics that supported strategic business decisions.",
      impact:
        'Helped pivot the company from growth-focused strategies to profitability in just three months during the challenging first quarter of the COVID-19 pandemic.',
      role: 'Engineering Manager - Data',
      technologies: [
        'Airflow',
        'DBT',
        'Snowflake',
        'Looker',
        'Dynamo DB',
        'Spark'
      ]
    },
    {
      industry: 'Health and Fitness',
      tag: 'ML Platform',
      title: 'Athletigen Data Intelligence Platform',
      status: 'past',
      description:
        'Founded and led the development of a data intelligence platform integrating various data sources and accessed by thousands of users.',
      role: 'Founding Engineer',
      technologies: [
        'Python',
        'Spark',
        'AWS (Redshift, Lambda, EC2, S3)',
        'R',
        'd3.js',
        'MongoDb'
      ]
    }
  ],
  navbar: [
    {
      href: '/',
      label: 'Home',
      icon: Icons.logo
    },
    {
      href: '/projects',
      label: 'Projects',
      icon: Icons.code
    },
    {
      href: '/cv',
      label: 'CV',
      icon: Icons.user
    },
    {
      href: '/writing',
      label: 'Writing',
      icon: Icons.pen
    }
  ]
};
