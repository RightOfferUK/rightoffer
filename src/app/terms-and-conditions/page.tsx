import React from 'react';
import { FileText, Scale, AlertTriangle, Shield, Users, Home, Ban, Globe, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | RightOffer',
  description: 'Terms and Conditions for RightOffer - Read our terms of service and user agreement.',
};

const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen bg-navy-gradient">
      {/* Header */}
      <div className="bg-navy-gradient border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white font-dm-sans">
              Terms and Conditions
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
              Welcome to RightOffer. These Terms and Conditions (&quot;Terms&quot;, &quot;Terms and Conditions&quot;) govern your relationship 
              with the RightOffer platform (the &quot;Service&quot;) operated by Transparency UK Limited (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              Please read these Terms and Conditions carefully before using our Service. Your access to and use of the 
              Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all 
              visitors, users, and others who access or use the Service.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              <strong className="text-white">By accessing or using the Service, you agree to be bound by these Terms. 
              If you disagree with any part of the terms, then you may not access the Service.</strong>
            </p>
          </section>

          {/* Definitions */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                1. Definitions
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                For the purposes of these Terms and Conditions:
              </p>
              <ul className="space-y-2 text-white/80">
                <li><strong className="text-white">&quot;Platform&quot; or &quot;Service&quot;</strong> refers to the RightOffer website and related services</li>
                <li><strong className="text-white">&quot;User&quot;, &quot;You&quot;, &quot;Your&quot;</strong> refers to the individual accessing or using the Service</li>
                <li><strong className="text-white">&quot;Buyer&quot;</strong> refers to users submitting offers on properties</li>
                <li><strong className="text-white">&quot;Seller&quot;</strong> refers to property owners listing properties for sale</li>
                <li><strong className="text-white">&quot;Agent&quot;</strong> refers to real estate agents using the platform</li>
                <li><strong className="text-white">&quot;Real Estate Admin&quot;</strong> refers to real estate companies managing multiple agents</li>
                <li><strong className="text-white">&quot;Listing&quot;</strong> refers to a property advertised for sale on the platform</li>
                <li><strong className="text-white">&quot;Offer&quot;</strong> refers to a proposal to purchase a property submitted through the platform</li>
                <li><strong className="text-white">&quot;Company&quot;</strong> refers to Transparency UK Limited (Company No. 16769713)</li>
              </ul>
            </div>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                2. Acceptance of Terms
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                By creating an account, accessing, or using RightOffer, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms and Conditions, as well as our Privacy Policy. If you do not agree 
                with these terms, you must not use our Service.
              </p>
              <p className="text-white/80 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes. 
                Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                3. Eligibility
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                To use RightOffer, you must:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Not be prohibited from using the Service under applicable laws</li>
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the security and confidentiality of your account credentials</li>
              </ul>
              <p className="text-white/80 leading-relaxed mt-3">
                You are responsible for all activities that occur under your account. If you become aware of any 
                unauthorized use of your account, you must notify us immediately.
              </p>
            </div>
          </section>

          {/* Account Types and User Roles */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                4. Account Types and User Roles
              </h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4.1 Platform Administrator</h3>
                <p className="text-white/80 leading-relaxed">
                  Platform administrators have full access to manage all aspects of the platform, including user accounts, 
                  listings, and system settings.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4.2 Real Estate Admin</h3>
                <p className="text-white/80 leading-relaxed">
                  Real estate admins represent real estate companies and can:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Create and manage agent accounts within their organization</li>
                  <li>Monitor their organization&apos;s listing usage</li>
                  <li>Manage company information and settings</li>
                  <li>Have listing limits based on their subscription tier</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4.3 Agent</h3>
                <p className="text-white/80 leading-relaxed">
                  Agents are real estate professionals who can:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Create and manage property listings</li>
                  <li>Generate and send buyer codes</li>
                  <li>View and manage offers on their listings</li>
                  <li>Communicate with buyers and sellers</li>
                  <li>Must be associated with a real estate admin account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4.4 Seller</h3>
                <p className="text-white/80 leading-relaxed">
                  Sellers are property owners who:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Receive a unique seller code to access their listing</li>
                  <li>Can view all offers submitted on their property</li>
                  <li>See full buyer details including name and email</li>
                  <li>Work with their agent to manage their listing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4.5 Buyer</h3>
                <p className="text-white/80 leading-relaxed">
                  Buyers are individuals interested in purchasing properties who:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Can submit offers on listed properties</li>
                  <li>May receive a buyer code from an agent for preferential access</li>
                  <li>Can view seller names but not seller email addresses</li>
                  <li>Receive notifications about offer status updates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Use of the Service */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Home className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                5. Use of the Service
              </h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">5.1 Platform Purpose</h3>
                <p className="text-white/80 leading-relaxed">
                  RightOffer is a platform designed to facilitate property transactions by connecting buyers, sellers, 
                  and real estate professionals. The platform allows for the submission, viewing, and management of 
                  property offers in a transparent and efficient manner.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">5.2 Property Listings</h3>
                <p className="text-white/80 leading-relaxed">
                  Agents may create property listings on behalf of sellers. All listing information must be:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Accurate and not misleading</li>
                  <li>Updated promptly if any details change</li>
                  <li>Compliant with all applicable property advertising laws</li>
                  <li>Authorized by the property owner</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">5.3 Submitting Offers</h3>
                <p className="text-white/80 leading-relaxed">
                  When submitting an offer through the platform:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>You must provide accurate and truthful information</li>
                  <li>Offers are non-binding until formal contracts are signed</li>
                  <li>You acknowledge that your contact details will be shared with the seller</li>
                  <li>You may only have one pending offer per property at a time</li>
                  <li>You can withdraw your offer at any time before acceptance</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">5.4 Buyer and Seller Codes</h3>
                <p className="text-white/80 leading-relaxed">
                  Buyer and seller codes are unique access credentials:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Codes are personal and should not be shared with unauthorized parties</li>
                  <li>You are responsible for maintaining the confidentiality of your codes</li>
                  <li>Codes may expire or be revoked at the agent&apos;s discretion</li>
                  <li>Lost codes can be resent by the agent</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Ban className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                6. Prohibited Activities
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Using the Service for any illegal purpose or in violation of any laws</li>
                <li>Submitting false, misleading, or fraudulent information</li>
                <li>Impersonating another person or entity</li>
                <li>Attempting to gain unauthorized access to the platform or user accounts</li>
                <li>Interfering with or disrupting the Service or servers</li>
                <li>Transmitting viruses, malware, or other harmful code</li>
                <li>Scraping, harvesting, or collecting data from the platform without permission</li>
                <li>Using the Service to spam, harass, or abuse other users</li>
                <li>Reverse engineering or attempting to extract source code</li>
                <li>Creating multiple accounts to circumvent restrictions</li>
                <li>Submitting offers with no genuine intention to purchase</li>
                <li>Using the platform to conduct competing business activities</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                7. Intellectual Property
              </h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">7.1 Platform Ownership</h3>
                <p className="text-white/80 leading-relaxed">
                  The Service and its original content (excluding user-generated content), features, and functionality 
                  are and will remain the exclusive property of Transparency UK Limited and its licensors. The Service 
                  is protected by copyright, trademark, and other laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">7.2 User Content</h3>
                <p className="text-white/80 leading-relaxed">
                  By submitting content to the platform (including property listings, photos, and offer information), you grant us:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>A non-exclusive, worldwide, royalty-free license to use, display, and distribute your content</li>
                  <li>The right to use your content for platform operations and improvements</li>
                  <li>The right to display your content to relevant parties (buyers, sellers, agents)</li>
                </ul>
                <p className="text-white/80 leading-relaxed mt-2">
                  You retain all ownership rights to your content and are responsible for ensuring you have the right 
                  to submit such content.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">7.3 Trademarks</h3>
                <p className="text-white/80 leading-relaxed">
                  &quot;RightOffer&quot; and related logos are trademarks of Transparency UK Limited. You may not use these 
                  trademarks without our prior written permission.
                </p>
              </div>
            </div>
          </section>

          {/* Fees and Payment */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                8. Fees and Payment
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                Certain aspects of the Service may be provided for a fee. Real estate admins and agents may be subject 
                to subscription fees and listing limits based on their chosen plan.
              </p>
              <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                <li>Fees are subject to change with advance notice</li>
                <li>Payment terms will be specified in your service agreement</li>
                <li>Listing limits apply based on subscription tier</li>
                <li>Buyers and sellers do not pay fees to use the platform</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                9. Disclaimers and Limitations
              </h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">9.1 No Guarantee of Results</h3>
                <p className="text-white/80 leading-relaxed">
                  RightOffer is a facilitation platform only. We do not guarantee:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>That properties will sell or receive offers</li>
                  <li>That offers will be accepted</li>
                  <li>The accuracy or completeness of listing information</li>
                  <li>The qualifications or financial capacity of buyers</li>
                  <li>The successful completion of any property transaction</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">9.2 Not a Real Estate Agent</h3>
                <p className="text-white/80 leading-relaxed">
                  RightOffer is a technology platform and does not act as a real estate agent, broker, or legal advisor. 
                  We do not:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Provide legal, financial, or property advice</li>
                  <li>Verify property information or valuations</li>
                  <li>Conduct property surveys or inspections</li>
                  <li>Negotiate on behalf of buyers or sellers</li>
                  <li>Handle conveyancing or legal documentation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">9.3 Service Availability</h3>
                <p className="text-white/80 leading-relaxed">
                  The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not guarantee 
                  that the Service will be:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Available at all times without interruption</li>
                  <li>Error-free or free from viruses</li>
                  <li>Accurate, reliable, or complete</li>
                  <li>Compatible with all devices or browsers</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">9.4 Third-Party Interactions</h3>
                <p className="text-white/80 leading-relaxed">
                  We are not responsible for the actions, conduct, or communications of users of the platform. Any 
                  dealings between buyers, sellers, and agents are solely between those parties.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                10. Limitation of Liability
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                To the maximum extent permitted by law, Transparency UK Limited, its directors, employees, and affiliates 
                shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Loss of profits, revenue, or business opportunities</li>
                <li>Loss of data or information</li>
                <li>Failed property transactions or rejected offers</li>
                <li>Damages arising from unauthorized access to your account</li>
                <li>Errors or omissions in listing information</li>
                <li>Actions of other users of the platform</li>
              </ul>
              <p className="text-white/80 leading-relaxed mt-3">
                Our total liability for any claims arising out of or relating to these Terms or the Service shall not 
                exceed the amount you paid to us in the 12 months preceding the claim, or £100, whichever is greater.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                11. Indemnification
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Transparency UK Limited, its officers, directors, 
                employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including 
                reasonable legal fees, arising out of or in any way connected with:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Your access to or use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you submit to the platform</li>
                <li>Your interactions with other users</li>
              </ul>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                12. Data Protection and Privacy
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to 
                the collection and use of your information as described in our Privacy Policy.
              </p>
              <p className="text-white/80 leading-relaxed">
                You acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Your information will be shared with relevant parties as necessary for property transactions</li>
                <li>Buyer information (including email) is shared with sellers when offers are submitted</li>
                <li>Seller names (but not emails) are visible to buyers</li>
                <li>Agents have access to information related to their listings</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Ban className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                13. Termination
              </h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">13.1 By You</h3>
                <p className="text-white/80 leading-relaxed">
                  You may terminate your account at any time by contacting us. Upon termination:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Your access to the Service will be revoked</li>
                  <li>Active listings and offers may be affected</li>
                  <li>Some data may be retained for legal and operational purposes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">13.2 By Us</h3>
                <p className="text-white/80 leading-relaxed">
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1 ml-4">
                  <li>Breach of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Violation of applicable laws</li>
                  <li>At our sole discretion</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">13.3 Effect of Termination</h3>
                <p className="text-white/80 leading-relaxed">
                  Upon termination, all licenses and rights granted to you will immediately cease. Provisions of these 
                  Terms that by their nature should survive termination shall survive, including ownership provisions, 
                  warranty disclaimers, indemnity, and limitations of liability.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                14. Governing Law and Jurisdiction
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of England and Wales, without 
                regard to its conflict of law provisions.
              </p>
              <p className="text-white/80 leading-relaxed">
                Any disputes arising out of or relating to these Terms or the Service shall be subject to the exclusive 
                jurisdiction of the courts of England and Wales.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                15. Dispute Resolution
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                If you have any concerns or disputes about the Service, we encourage you to first contact us to seek 
                an informal resolution. We will make reasonable efforts to resolve the dispute in good faith.
              </p>
              <p className="text-white/80 leading-relaxed">
                If we are unable to resolve the dispute informally, you agree that any legal action shall be brought 
                exclusively in the courts of England and Wales.
              </p>
            </div>
          </section>

          {/* Severability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                16. Severability and Waiver
              </h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">16.1 Severability</h3>
                <p className="text-white/80 leading-relaxed">
                  If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed 
                  and interpreted to accomplish the objectives of such provision to the greatest extent possible under 
                  applicable law, and the remaining provisions will continue in full force and effect.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">16.2 Waiver</h3>
                <p className="text-white/80 leading-relaxed">
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those 
                  rights. The waiver of any such right or provision will be effective only if in writing and signed by 
                  our authorized representative.
                </p>
              </div>
            </div>
          </section>

          {/* Entire Agreement */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                17. Entire Agreement
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
                Transparency UK Limited regarding the use of the Service and supersede all prior agreements and 
                understandings, whether written or oral.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white font-dm-sans">
                18. Contact Us
              </h2>
            </div>
            
            <div className="space-y-3 ml-9">
              <p className="text-white/80 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mt-4">
                <div className="space-y-2">
                  <p className="text-white">
                    <strong>Company:</strong> Transparency UK Limited
                  </p>
                  <p className="text-white">
                    <strong>Company Number:</strong> 16769713
                  </p>
                  <p className="text-white">
                    <strong>Address:</strong> 167-169 Great Portland Street, 5th Floor, London, England, W1W 5PF
                  </p>
                  <p className="text-white">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:info@rightoffer.co.uk" className="text-purple-400 hover:text-purple-300 transition-colors">
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

          {/* Acceptance Notice */}
          <section className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Agreement</h3>
            <p className="text-white/80 leading-relaxed">
              By using RightOffer, you acknowledge that you have read, understood, and agree to be bound by these 
              Terms and Conditions. If you do not agree to these Terms, you must not use our Service.
            </p>
          </section>

        </div>

        {/* Navigation Links */}
        <div className="flex justify-center gap-6 mt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Home
          </Link>
          <span className="text-white/30">|</span>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;

