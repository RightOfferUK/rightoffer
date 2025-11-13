import React from 'react';
import { Shield, Mail, Lock, Eye, Users, Database, Cookie, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | RightOffer',
  description: 'Privacy Policy for RightOffer - Learn how we collect, use, and protect your personal information.',
};

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-navy-gradient">
      {/* Header */}
      <div className="bg-navy-gradient border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white font-dm-sans">
              Privacy Policy
            </h1>
          </div>
          <p className="text-white/70 text-lg">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section>
            <p className="text-white/80 leading-relaxed">
              At RightOffer, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              By using RightOffer, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                1. Information We Collect
              </h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">1.1 Personal Information</h3>
                <p className="text-white/80 leading-relaxed">
                  We collect personal information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Name and contact information (email address)</li>
                  <li>Property details (addresses, listing information)</li>
                  <li>Offer details (amounts, funding types, buyer preferences)</li>
                  <li>Company information (for real estate agents and admins)</li>
                  <li>Communication preferences and history</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">1.2 Automatically Collected Information</h3>
                <p className="text-white/80 leading-relaxed">
                  When you access our platform, we automatically collect certain information, including:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, actions taken)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log data and analytics information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                2. How We Use Your Information
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                <li><strong className="text-white">Service Delivery:</strong> To provide, maintain, and improve our platform and services</li>
                <li><strong className="text-white">Communication:</strong> To send you property updates, offer notifications, and important service announcements</li>
                <li><strong className="text-white">Authentication:</strong> To verify your identity and manage your account access</li>
                <li><strong className="text-white">Transaction Processing:</strong> To facilitate property offers and communications between buyers and sellers</li>
                <li><strong className="text-white">Customer Support:</strong> To respond to your inquiries and provide technical assistance</li>
                <li><strong className="text-white">Analytics:</strong> To understand how users interact with our platform and improve user experience</li>
                <li><strong className="text-white">Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
                <li><strong className="text-white">Security:</strong> To detect, prevent, and address fraud, security issues, and technical problems</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                3. Information Sharing and Disclosure
              </h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <p className="text-white/80 leading-relaxed">
                We may share your information in the following circumstances:
              </p>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.1 With Property Transaction Parties</h3>
                <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                  <li>Buyer information is shared with sellers when an offer is submitted</li>
                  <li>Seller names (but not emails) are shared with buyers viewing property listings</li>
                  <li>Real estate agents have access to their clients&apos; information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.2 With Service Providers</h3>
                <p className="text-white/80 leading-relaxed">
                  We may share information with third-party service providers who perform services on our behalf, including:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Email delivery services (Resend)</li>
                  <li>Cloud storage providers (Supabase)</li>
                  <li>Database hosting (MongoDB)</li>
                  <li>Analytics providers</li>
                  <li>Authentication services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.3 For Legal Reasons</h3>
                <p className="text-white/80 leading-relaxed">
                  We may disclose your information if required by law or in response to valid legal requests, such as:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Compliance with legal obligations</li>
                  <li>Protection of our rights and property</li>
                  <li>Prevention of fraud or security issues</li>
                  <li>Protection of the safety of our users or the public</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.4 Business Transfers</h3>
                <p className="text-white/80 leading-relaxed">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                4. Data Security
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication mechanisms</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and user authentication</li>
                <li>Secure cloud infrastructure</li>
              </ul>
              <p className="text-white/80 leading-relaxed mt-3">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, 
                we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                5. Cookies and Tracking Technologies
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our platform and store certain information. 
                Cookies are files with small amounts of data that are sent to your browser from a website and stored on your device.
              </p>
              <p className="text-white/80 leading-relaxed">
                We use cookies for:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Session management and authentication</li>
                <li>Preference settings</li>
                <li>Security purposes</li>
                <li>Analytics and performance monitoring</li>
              </ul>
              <p className="text-white/80 leading-relaxed mt-3">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
                if you do not accept cookies, you may not be able to use some portions of our platform.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                6. Your Data Rights
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                <li><strong className="text-white">Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong className="text-white">Deletion:</strong> Request deletion of your personal information</li>
                <li><strong className="text-white">Objection:</strong> Object to our processing of your personal information</li>
                <li><strong className="text-white">Restriction:</strong> Request restriction of processing of your information</li>
                <li><strong className="text-white">Portability:</strong> Request transfer of your information to another service</li>
                <li><strong className="text-white">Withdraw Consent:</strong> Withdraw your consent to processing where we rely on consent</li>
              </ul>
              <p className="text-white/80 leading-relaxed mt-3">
                To exercise any of these rights, please contact us using the information provided below.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                7. Data Retention
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                unless a longer retention period is required or permitted by law. This includes:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Active account data: Retained while your account is active</li>
                <li>Property listings: Retained for historical and audit purposes</li>
                <li>Transaction records: Retained in accordance with legal and regulatory requirements</li>
                <li>Communications: Retained for customer service and legal compliance purposes</li>
              </ul>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                8. Children&apos;s Privacy
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                Our platform is not intended for use by children under the age of 18. We do not knowingly collect personal 
                information from children under 18. If you are a parent or guardian and become aware that your child has 
                provided us with personal information, please contact us. If we become aware that we have collected personal 
                information from children without verification of parental consent, we will take steps to remove that information.
              </p>
            </div>
          </section>

          {/* Third-Party Links */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                9. Third-Party Links
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                Our platform may contain links to third-party websites or services that are not owned or controlled by RightOffer. 
                We have no control over and assume no responsibility for the content, privacy policies, or practices of any 
                third-party websites or services. We encourage you to review the privacy policy of every site you visit.
              </p>
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                10. International Data Transfers
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your country, state, 
                province, or other governmental jurisdiction where data protection laws may differ. We ensure that appropriate 
                safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data 
                protection laws.
              </p>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                11. Changes to This Privacy Policy
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this policy. You are advised 
                to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when 
                they are posted on this page.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                12. Contact Us
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                If you have any questions about this Privacy Policy, or if you wish to exercise any of your data rights, 
                please contact us:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mt-4">
                <div className="space-y-2">
                  <p className="text-white">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:privacy@rightoffer.co.uk" className="text-purple-400 hover:text-purple-300 transition-colors">
                      info@rightoffer.co.uk
                    </a>
                  </p>
                  <p className="text-white">
                    <strong>Website:</strong>{' '}
                    <a href="https://rightoffer.co.uk" className="text-purple-400 hover:text-purple-300 transition-colors">
                      www.rightoffer.co.uk
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* GDPR Compliance Notice */}
          <section className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">UK GDPR Compliance</h3>
            <p className="text-white/80 leading-relaxed">
              RightOffer is committed to complying with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. 
              We are the data controller for the personal information we collect and process through our platform.
            </p>
          </section>

        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

