

"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-50 py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Link href="/" className="inline-flex items-center text-ssblue hover:text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="border-0 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 lg:p-10">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ssblue to-blue-600 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-gray-600 mt-3">Last updated: January 17, 2025</p>
            </div>

            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                <p>Welcome to Smile Studio. By accessing or using our dental appointment booking service, you agree to be bound by these Terms of Service. Please read them carefully.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Using Our Services</h2>
                <p>You must follow any policies made available to you within the Services. You may use our Services only as permitted by law. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Your Account</h2>
                <p>To use our Services, you may need to create an account. You are responsible for maintaining the security of your account credentials and for any activity that occurs under your account. You must immediately notify us of any unauthorized use of your account.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Booking and Cancellation</h2>
                <p>When booking appointments through our Service, you agree to provide accurate and complete information. You may cancel or reschedule appointments according to the cancellation policy specified at the time of booking. Repeated no-shows or late cancellations may result in restrictions on your ability to use the Service.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Personal Information</h2>
                <p>Our privacy policy explains how we treat your personal data and protect your privacy when using our Services. By using our Services, you agree to the collection and use of information in accordance with our Privacy Policy.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Service Modifications</h2>
                <p>We are constantly updating and improving our Services. We may add or remove functionalities or features, and we may suspend or stop a Service altogether. You can stop using our Services at any time.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Warranties and Disclaimers</h2>
                <p>We provide our Services using reasonable skill and care. Other than as expressly set out in these Terms, we dont make any specific promises about our Services. We are not responsible for the actions or information provided by dental practitioners or other users.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Liability</h2>
                <p>To the extent permitted by law, we will not be responsible for lost profits, revenues, or data, financial losses, or indirect, special, consequential, exemplary, or punitive damages. Our total liability for any claims under these Terms is limited to the amount you paid us to use the Services.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to These Terms</h2>
                <p>We may modify these Terms to, for example, reflect changes to the law or changes to our Services. We will post notice of modifications to these Terms on this page. Changes will not apply retroactively and will become effective no sooner than 14 days after they are posted.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
                <p>If you have any questions about these Terms, please contact us at [your contact email].</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}