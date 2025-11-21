'use client'

import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300 text-sm mb-4 inline-block"
          >
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy & Disclaimer
          </h1>
          <p className="text-gray-400 text-sm">
            Last updated: November 2024
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-300">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              CosmicBase ("we", "our", or "the application") is a decentralized application (dApp)
              that allows users to create privacy-preserving astrology NFTs on the blockchain.
              This Privacy Policy and Disclaimer outlines how we handle your data and the terms
              under which you use our service.
            </p>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Data Collection</h2>
            <p className="leading-relaxed mb-4">
              To create your birth chart NFT, we collect the following personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Birth date (year, month, day)</li>
              <li>Birth time (hour, minute)</li>
              <li>Birth location (latitude, longitude)</li>
              <li>Optional display name</li>
              <li>Blockchain wallet address</li>
            </ul>
            <p className="leading-relaxed mt-4">
              <strong className="text-white">Important:</strong> We do NOT collect email addresses,
              real names (unless voluntarily provided as display name), or any other identifying information.
            </p>
          </section>

          {/* Data Storage & Encryption */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Storage & Encryption</h2>
            <p className="leading-relaxed mb-4">
              Your birth data is processed and stored as follows:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Fully Homomorphic Encryption (FHE):</strong> Your sensitive
                birth data (date, time, location) is encrypted using Zama's FHEVM technology before
                being stored on the blockchain. This data can only be decrypted by you.
              </li>
              <li>
                <strong className="text-white">On-chain storage:</strong> Encrypted data is stored on
                the Ethereum Sepolia testnet blockchain and is immutable once recorded.
              </li>
              <li>
                <strong className="text-white">IPFS:</strong> Your NFT metadata and chart image are
                stored on IPFS (InterPlanetary File System), a decentralized storage network.
              </li>
              <li>
                <strong className="text-white">No centralized storage:</strong> We do NOT store your
                personal data on any centralized servers or databases.
              </li>
            </ul>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Usage</h2>
            <p className="leading-relaxed">
              Your data is used solely for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Calculating your astrological birth chart</li>
              <li>Generating your NFT artwork</li>
              <li>Storing encrypted birth data on-chain</li>
              <li>Enabling future compatibility checks with other users (using encrypted computation)</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We do NOT sell, share, or transfer your personal data to third parties for marketing
              or any other purposes.
            </p>
          </section>

          {/* Third Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Services</h2>
            <p className="leading-relaxed mb-4">
              Our application interacts with the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">OpenStreetMap Nominatim:</strong> For geocoding birth
                location searches. Their privacy policy applies to location queries.
              </li>
              <li>
                <strong className="text-white">Pinata/IPFS:</strong> For decentralized storage of
                NFT metadata and images.
              </li>
              <li>
                <strong className="text-white">Ethereum Network:</strong> For blockchain transactions
                and smart contract interactions.
              </li>
              <li>
                <strong className="text-white">Wallet Providers:</strong> Your chosen wallet provider
                (MetaMask, etc.) has its own privacy policy.
              </li>
            </ul>
          </section>

          {/* Disclaimer & Liability */}
          <section className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-4">6. Disclaimer & Limitation of Liability</h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                <strong className="text-white">NO WARRANTY:</strong> This application is provided "AS IS"
                and "AS AVAILABLE" without any warranties of any kind, express or implied. We make no
                guarantees regarding the accuracy, reliability, or availability of the service.
              </p>
              <p className="leading-relaxed">
                <strong className="text-white">TESTNET ONLY:</strong> This application currently operates
                on the Ethereum Sepolia testnet. Do not use tokens with real monetary value.
              </p>
              <p className="leading-relaxed">
                <strong className="text-white">ASTROLOGY DISCLAIMER:</strong> Astrological calculations
                and interpretations are for entertainment purposes only. We make no claims about the
                accuracy, validity, or predictive value of astrological information.
              </p>
              <p className="leading-relaxed">
                <strong className="text-white">LIMITATION OF LIABILITY:</strong> In no event shall
                CosmicBase, its developers, or affiliates be liable for any direct, indirect, incidental,
                special, consequential, or punitive damages arising from:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Your use or inability to use the service</li>
                <li>Any errors or omissions in the content</li>
                <li>Loss of data or unauthorized access to your data</li>
                <li>Smart contract bugs or blockchain network issues</li>
                <li>Actions of third-party services</li>
                <li>Any other matter relating to the service</li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. User Responsibilities</h2>
            <p className="leading-relaxed mb-4">
              By using CosmicBase, you acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You are voluntarily providing your personal birth data</li>
              <li>You are solely responsible for the accuracy of the information you provide</li>
              <li>You understand that blockchain transactions are irreversible</li>
              <li>You are responsible for securing your wallet and private keys</li>
              <li>You will not use the service for any illegal or unauthorized purpose</li>
              <li>You accept full responsibility for any consequences of using this service</li>
            </ul>
          </section>

          {/* Data Retention & Deletion */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention & Deletion</h2>
            <p className="leading-relaxed">
              <strong className="text-white">Blockchain Immutability:</strong> Due to the nature of
              blockchain technology, data stored on-chain cannot be modified or deleted. Once your
              NFT is minted, the encrypted data and metadata will remain on the blockchain permanently.
            </p>
            <p className="leading-relaxed mt-4">
              <strong className="text-white">Local Storage:</strong> We use browser local storage for
              temporary session data (e.g., pending mint information). You can clear this data through
              your browser settings.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Security</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Fully Homomorphic Encryption (FHE) for sensitive data</li>
              <li>Client-side encryption (data is encrypted before leaving your browser)</li>
              <li>No centralized database that could be breached</li>
              <li>Open-source smart contracts for transparency</li>
            </ul>
            <p className="leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic storage is 100%
              secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Experimental Nature */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Experimental Technology</h2>
            <p className="leading-relaxed">
              This application uses experimental technologies including Fully Homomorphic Encryption
              (FHE) and blockchain smart contracts. These technologies are still evolving and may
              contain undiscovered vulnerabilities. By using this service, you acknowledge that you
              understand and accept the risks associated with experimental technology.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We reserve the right to update this Privacy Policy and Disclaimer at any time. Changes
              will be effective immediately upon posting. Your continued use of the service after any
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact</h2>
            <p className="leading-relaxed">
              This project was built for the Zama AI Guild Developer Program - Builder Track.
              For questions or concerns regarding this privacy policy, please open an issue on
              the project's GitHub repository.
            </p>
          </section>

          {/* Acknowledgment */}
          <section className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-purple-300 mb-3">Acknowledgment</h2>
            <p className="leading-relaxed text-sm">
              By using CosmicBase, you acknowledge that you have read, understood, and agree to be
              bound by this Privacy Policy and Disclaimer. If you do not agree with these terms,
              please do not use the service.
            </p>
          </section>

        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
