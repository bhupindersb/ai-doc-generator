import { PageLayout } from "@/components/PageLayout";

const sections = [
  {
    title: "1. Information we collect",
    content: [
      { sub: "Account information", text: "When you sign in with GitHub, we receive your GitHub username, display name, email address, and profile picture URL. We store these to identify your account and personalise your dashboard." },
      { sub: "Code you submit", text: "When you generate documentation, the code you paste is sent to our AI provider (currently Groq / Anthropic) to produce the output. We store the input code and the generated output in our database so you can access your history. We do not use your code to train AI models." },
      { sub: "Usage data", text: "We track how many documents you generate per month to enforce plan limits. We log the language and doc type selected, and the number of tokens used per generation." },
      { sub: "Payment information", text: "Payments are processed by Razorpay. We do not store your card details, bank account numbers, or UPI IDs. We receive a customer ID and subscription ID from Razorpay to manage your plan." },
      { sub: "Technical data", text: "We collect standard server logs including IP addresses, browser user-agent strings, and request timestamps for security monitoring and debugging. These are retained for 30 days." },
    ],
  },
  {
    title: "2. How we use your information",
    content: [
      { sub: "To provide the service", text: "Your account data is used to authenticate you. Your code submissions are processed by AI to generate documentation. Usage data is used to enforce plan limits." },
      { sub: "To improve the product", text: "We analyse aggregate usage patterns (which languages are most popular, which doc types are used most) to prioritise features. This is always aggregate — never individual." },
      { sub: "To communicate with you", text: "We may email you about billing events (subscription renewals, payment failures), product updates you've opted into, and security notices. We do not send marketing emails without opt-in." },
    ],
  },
  {
    title: "3. Data sharing and third parties",
    content: [
      { sub: "AI providers", text: "Code you submit is sent to Groq (and optionally Anthropic) for processing. These providers process data on our behalf and are contractually prohibited from using your data to train their models. See Groq's privacy policy at groq.com/privacy and Anthropic's at anthropic.com/privacy." },
      { sub: "Database", text: "We use Supabase (hosted on AWS ap-south-1, Mumbai) for our database. Data is encrypted at rest and in transit." },
      { sub: "Payments", text: "Razorpay processes all payments. They are PCI-DSS compliant. See razorpay.com/privacy for details." },
      { sub: "Hosting", text: "Our application runs on Vercel (US East region). Vercel does not have access to your data beyond what is necessary to serve HTTP requests." },
      { sub: "No selling of data", text: "We do not sell, rent, or share your personal data with any third parties for advertising or commercial purposes. Full stop." },
    ],
  },
  {
    title: "4. Data retention",
    content: [
      { sub: "Account data", text: "Retained for as long as your account is active. If you delete your account, we delete your profile, documents, and usage logs within 30 days." },
      { sub: "Generated documents", text: "Stored indefinitely so you can access your history. You can delete individual documents from your dashboard at any time." },
      { sub: "Server logs", text: "Retained for 30 days then automatically deleted." },
      { sub: "Billing records", text: "Retained for 7 years as required by Indian tax law (GST compliance)." },
    ],
  },
  {
    title: "5. Your rights",
    content: [
      { sub: "Access", text: "You can view all your generated documents in your dashboard history tab at any time." },
      { sub: "Deletion", text: "Email hello@beveez.tech with subject 'Delete my account' and we will delete all your personal data within 30 days." },
      { sub: "Export", text: "Email hello@beveez.tech to request a copy of all data we hold about you in JSON format." },
      { sub: "Correction", text: "If your name or email is incorrect in our system, email us and we will correct it within 7 days." },
    ],
  },
  {
    title: "6. Security",
    content: [
      { sub: "Encryption", text: "All data is encrypted in transit using TLS 1.3. Database data is encrypted at rest using AES-256." },
      { sub: "Access control", text: "Only essential team members can access production data. All access is logged and audited." },
      { sub: "Incident response", text: "In the event of a data breach affecting your personal data, we will notify you by email within 72 hours." },
    ],
  },
  {
    title: "7. Cookies",
    content: [
      { sub: "Session cookies", text: "We use a single session cookie (next-auth.session-token) to keep you signed in. This is a strictly necessary cookie — the service cannot function without it." },
      { sub: "No tracking cookies", text: "We do not use advertising cookies, third-party analytics cookies, or any tracking pixels. DocAI is ad-free." },
    ],
  },
  {
    title: "8. Children",
    content: [
      { sub: "Age requirement", text: "DocAI is not intended for users under 13 years of age. We do not knowingly collect data from children. If you believe a child has provided us with personal data, please contact us immediately." },
    ],
  },
  {
    title: "9. Changes to this policy",
    content: [
      { sub: "Notification", text: "We will notify you by email at least 14 days before making any material changes to this policy. Continued use of the service after the effective date constitutes acceptance." },
    ],
  },
  {
    title: "10. Contact",
    content: [
      { sub: "Data controller", text: "Beveez Tech, Kharar, Punjab, India. Email: hello@beveez.tech" },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PageLayout>
      {/* Header */}
      <div className="border-b border-ink-800 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-ink-800 border border-ink-700 rounded-full px-4 py-1.5 mb-6 text-xs font-mono text-lime">
            <span className="w-1.5 h-1.5 bg-lime rounded-full" />Privacy Policy
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Privacy Policy</h1>
          <p className="text-ink-400 font-mono text-sm">
            Last updated: 1 August 2026 · Effective: 1 August 2026
          </p>
          <p className="text-ink-400 font-mono text-sm mt-4 leading-relaxed">
            This policy explains what data DocAI (operated by Beveez Tech) collects, how we use it, and what rights you have. We've written it in plain English — no legal jargon.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          {sections.map(section => (
            <div key={section.title}>
              <h2 className="text-lg font-display font-bold mb-6 text-lime">{section.title}</h2>
              <div className="space-y-5">
                {section.content.map(item => (
                  <div key={item.sub}>
                    <p className="font-display font-bold text-sm mb-1.5">{item.sub}</p>
                    <p className="text-ink-400 font-mono text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Contact box */}
          <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6 text-center">
            <p className="font-display font-bold text-sm mb-2">Questions about your privacy?</p>
            <p className="text-ink-400 font-mono text-sm mb-4">We aim to respond to all privacy requests within 48 hours.</p>
            <a href="mailto:hello@beveez.tech" className="text-lime font-mono text-sm hover:underline">hello@beveez.tech →</a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
