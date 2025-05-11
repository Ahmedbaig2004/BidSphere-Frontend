import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy & Platform Rules</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">Privacy Policy</h2>
          <div className="space-y-4 text-blue-100">
            <p>
              At BidSphere, we take your privacy seriously. This Privacy Policy describes how we collect, use, 
              and share information when you use our blockchain-based bidding platform.
            </p>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">Information We Collect</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal information that you provide (name, email address, phone number)</li>
              <li>Wallet addresses and transaction history on the platform</li>
              <li>Bidding activity and history</li>
              <li>Device information and usage data</li>
            </ul>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">How We Use Your Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our platform</li>
              <li>To process transactions and verify bids</li>
              <li>To communicate with you about your account and activity</li>
              <li>To improve our services and develop new features</li>
              <li>To detect and prevent fraud or unauthorized access</li>
            </ul>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">Information Sharing</h3>
            <p>
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers who help operate our platform</li>
              <li>Legal authorities when required by law</li>
              <li>Other users (limited to transaction-specific information)</li>
            </ul>
          </div>
        </section>
        
        <section id="bidding-rules" className="mb-8 pt-4">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">Bidding Rules</h2>
          <div className="space-y-4 text-blue-100">
            <p>
              To ensure a fair and transparent bidding environment, all users must adhere to the following rules:
            </p>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">Bid Placement</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>All bids are binding once placed</li>
              <li>Minimum bid increments may vary by auction</li>
              <li>Your bid must be higher than the current highest bid</li>
              <li>You cannot bid on your own listings</li>
              <li>You cannot place consecutive bids without another bidder in between</li>
            </ul>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">Wallet Requirements</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must have sufficient funds in your connected wallet to place a bid</li>
              <li>Only approved cryptocurrency wallets may be used</li>
              <li>Your wallet must remain connected throughout the bidding process</li>
            </ul>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">Auction Completion</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>The highest bidder at auction close wins the item</li>
              <li>Payment processing begins automatically at auction close</li>
              <li>Failure to complete payment may result in account restrictions</li>
            </ul>
          </div>
        </section>
        
        <section id="platform-rules" className="mb-8 pt-4">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">Platform Rules & Code of Conduct</h2>
          <div className="space-y-4 text-blue-100">
            <p>
              BidSphere is committed to maintaining a respectful, secure, and transparent environment. All users must follow these guidelines:
            </p>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">User Conduct</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Do not engage in fraudulent activity or misrepresentation</li>
              <li>Do not create multiple accounts to manipulate bidding</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Communicate respectfully with other users and our staff</li>
            </ul>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">Prohibited Items</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Illegal goods or services</li>
              <li>Counterfeit items or unauthorized copies</li>
              <li>Hazardous or dangerous materials</li>
              <li>Items that promote hate speech or discrimination</li>
            </ul>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">Account Security</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for maintaining the security of your account</li>
              <li>Do not share your login credentials or wallet information</li>
              <li>Report any suspicious activity immediately</li>
            </ul>
          </div>
        </section>
        
        <section id="terms" className="mb-8 pt-4">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">Terms of Service</h2>
          <div className="space-y-4 text-blue-100">
            <p>
              By using BidSphere, you agree to abide by the following terms and conditions:
            </p>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">User Accounts</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for maintaining the confidentiality of your account information</li>
              <li>You may not transfer or sell your account to another person</li>
              <li>We reserve the right to suspend or terminate accounts that violate our policies</li>
            </ul>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">Intellectual Property</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>All content on BidSphere is protected by copyright, trademark, and other laws</li>
              <li>You may not use our trademarks, logos, or branding without explicit permission</li>
              <li>When you submit content to our platform, you grant us a non-exclusive license to use it</li>
            </ul>
            
            <h3 className="text-xl font-medium text-blue-300 mt-6">Limitation of Liability</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>BidSphere is provided "as is" without warranties of any kind</li>
              <li>We are not liable for any damages arising from your use of our platform</li>
              <li>You agree to indemnify and hold us harmless from any claims related to your use of BidSphere</li>
            </ul>
          </div>
        </section>
        
        <div className="mt-12 text-center text-blue-200">
          <p>Last updated: November 2023</p>
          <p className="mt-2">
            If you have any questions about our Privacy Policy or Platform Rules,<br />
            please contact us at <span className="text-blue-300">support@bidsphere.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 