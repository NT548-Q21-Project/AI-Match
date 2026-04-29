import { CV } from "../types/cv";
import { Job } from "../types/job";
import { MatchResult } from "../types/matching";
import { Application } from "../types/application";

export const MOCK_USER_CANDIDATE = {
  id: "u1",
  auth_id: "auth1",
  email: "candidate@example.com",
  role: "candidate" as const,
  created_at: new Date().toISOString(),
  full_name: "John Candidate",
};

export const MOCK_USER_RECRUITER = {
  id: "u2",
  auth_id: "auth2",
  email: "recruiter@example.com",
  role: "recruiter" as const,
  created_at: new Date().toISOString(),
  full_name: "Alice Recruiter",
};

export const MOCK_CVS: CV[] = [
  { id: "cv1", user_id: "u1", file_name: "john_doe_cv.pdf", title: "Software Engineer Lead", created_at: "2024-01-10T10:00:00Z" },
  { id: "cv2", user_id: "u1", file_name: "frontend_dev.docx", title: "Frontend Specialist", created_at: "2024-02-15T14:30:00Z" },
  { id: "cv3", user_id: "u1", file_name: "fullstack_v3.pdf", title: "Fullstack Engineer", created_at: "2024-03-20T09:15:00Z" },
];

export const MOCK_JOBS: Job[] = [
  {
    id: "j1",
    recruiter_id: "u2",
    title: "Senior Python Developer",
    description: "Design high-performance APIs and microservices for our core platform.",
    location: "Remote",
    status: "active",
    applications_count: 2,
    created_at: "2024-04-01T08:00:00Z",
    responsibilities: "Build APIs;Design database schema;Work with DevOps team",
    requirements: "8+ years of Python experience;Strong knowledge of FastAPI or Django;Experience with PostgreSQL and Redis;AWS expertise",
    nice_to_have: "AWS;Kubernetes;Redis;LangChain",
    benefits: "Full health coverage;Remote work allowance;$3k yearly learning budget;Flexible hours"
  },
  {
    id: "j2",
    recruiter_id: "u2",
    title: "Frontend Engineer (React)",
    description: "Build beautiful and performant user interfaces using modern React.",
    location: "Singapore",
    status: "active",
    applications_count: 1,
    created_at: "2024-04-10T09:00:00Z",
    responsibilities: "Implement pixel-perfect UI;Optimize web performance;Collaborate with design team",
    requirements: "Proficiency in React 18+ and TypeScript;Experience with Tailwind CSS;Understanding of state management (Zustand/Redux);Pixel-perfect UI implementation skills",
    nice_to_have: "Figma;Next.js;Framer Motion",
    benefits: "Modern office in CBD;Free snacks and drinks;Private health insurance;Quarterly team retreats"
  },
  {
    id: "j3",
    recruiter_id: "u2",
    title: "DevOps Specialist",
    description: "Manage CI/CD pipelines and infrastructure as code.",
    location: "Hybrid",
    status: "active",
    applications_count: 0,
    created_at: "2024-03-25T11:00:00Z",
    responsibilities: "Maintain CI/CD pipelines;Monitor infrastructure;Ensure zero downtime deployments",
    requirements: "Kubernetes and Docker mastery;Terraform or Pulumi experience;CI/CD pipeline optimization;Security-first mindset",
    nice_to_have: "AWS certifications;Go programming;Experience with Datadog",
    benefits: "Latest MacBook Pro;Home office setup budget;Fitness membership;Annual performance bonus"
  },
  {
    id: "j4",
    recruiter_id: "some_other_id",
    title: "Product Manager",
    description: "Drive product strategy and work closely with engineering teams.",
    location: "London",
    status: "active",
    applications_count: 5,
    created_at: "2024-04-05T10:00:00Z",
    responsibilities: "Define product roadmap;Write detailed PRDs;Conduct user research;Coordinate cross-functional teams",
    requirements: "3+ years of product management;Strong analytical skills;Excellent communication;Experience in B2B SaaS",
    nice_to_have: "CS degree;SQL experience;Agile/Scrum master certification",
    benefits: "Share options;Central London office;Unlimited vacation;Work from anywhere (1 month/year)"
  },
  {
    id: "j5",
    recruiter_id: "u2",
    title: "Backend Engineer (Go)",
    description: "High concurrency microservices for real-time data processing.",
    location: "Remote",
    status: "closed",
    applications_count: 10,
    created_at: "2024-02-01T08:00:00Z",
    responsibilities: "Develop high throughput microservices;Optimize database queries;Write unit and integration tests",
    requirements: "Go proficiency;Distributed systems knowledge;gRPC and Protobuf;Message queue experience (Kafka/RabbitMQ)",
    nice_to_have: "C/C++ experience;PostgreSQL internal knowledge;Contributions to open-source",
    benefits: "Global health insurance;Remote-first culture;Regular tech meetups;Generous parental leave"
  },
];

export const MOCK_MATCH_RESULTS: MatchResult[] = [
  {
    id: "m1",
    cv_id: "cv1",
    job_id: "j1",
    candidate_id: "u1",
    score: 85,
    strengths: ["Strong proficiency in FastAPI and asynchronous Python patterns", "Extensive experience with AWS infrastructure and serverless architecture", "Proven track record of migrating legacy monoliths to microservices"],
    weaknesses: ["Limited direct experience with Elasticsearch for complex search queries", "Could benefit from more exposure to frontend frameworks to better understand API consumption"],
    explanation: "Candidate has strong backend foundations that align perfectly with our Python stack.",
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app1",
    candidate_id: "u1",
    candidate_name: "John Candidate",
    job_id: "j1",
    cv_id: "cv1",
    cv_title: "Software Engineer Lead",
    applied_at: "2024-04-12T10:00:00Z",
    status: "pending",
    job: MOCK_JOBS[0],
    match_result: MOCK_MATCH_RESULTS[0],
    cv: MOCK_CVS[0]
  },
  {
    id: "app2",
    candidate_id: "u1",
    candidate_name: "John Candidate",
    job_id: "j2",
    cv_id: "cv2",
    cv_title: "Frontend Specialist",
    applied_at: "2024-04-15T11:30:00Z",
    status: "viewed",
    job: MOCK_JOBS[1],
    cv: MOCK_CVS[1]
  },
  {
    id: "app3",
    candidate_id: "u1",
    candidate_name: "John Candidate",
    job_id: "j3",
    cv_id: "cv3",
    cv_title: "Fullstack Engineer",
    applied_at: "2024-04-18T09:00:00Z",
    status: "withdrawn" as any,
    job: MOCK_JOBS[2],
    cv: MOCK_CVS[2]
  },
];
