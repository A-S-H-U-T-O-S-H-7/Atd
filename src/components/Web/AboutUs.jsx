import React from "react";
import {
  Info,
  Award,
  Users,
  CheckCircle,
  CreditCard,
  Calculator,
  TrendingUp,
  FileText,
  Download,
  Shield,
  Building
} from "lucide-react";
import Image from "next/image";

const AboutUs = () => {
  return <div className="bg-white pt-5 text-gray-800">
      {/* Banner Image Section */}
      <div className=" mx-4  md:mx-10 border border-emerald-400 
                            bg-gradient-to-br from-emerald-50 to-cyan-50
                            shadow-lg shadow-emerald-100
                            rounded-xl
                            p-4 md:p-6">
        <div>
          <Image src="/AboutUs.jpg" alt="Aboutus Banner" width={4500} height={4200} className="w-500 h-60 rounded-xl" priority />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 py-6 space-y-12  mx-auto">
        <section className="text-center">
          <p className="text-lg max-w-3xl mx-auto">
            ATD Money is India's No. 1 personal loan app, providing Salary &
            Payday loans of up to ₹50,000 for salaried individuals across PAN
            India.
          </p>
        </section>

        <div className="bg-purple-50 p-3 md:p-8 rounded-2xl shadow-sm border border-purple-100">
          <p>
            ATD Money is a leading digital lending platform, owned and operated by
            <strong> ATD FINANCIAL SERVICES PVT LTD</strong>, a Non-Banking Financial Company (NBFC) established in <strong>1996</strong> and registered with the Reserve Bank of India (RBI) under <strong>License No. B-12-00315</strong> (verification available on the
            <i> Sachet RBI Portal </i>). With a strong foundation and decades of experience, we are committed to delivering hassle-free, transparent, and responsible lending services. Our goal is to empower individuals to overcome financial challenges and regain control of their financial well-being. At ATD Money, we believe in providing financial freedom in a smooth, efficient, and user-friendly manner.
          </p>
        </div>

        <section className="grid md:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <Info className="text-blue-500 mr-3" size={24} />
              <h2 className=" text-xl md:text-2xl font-semibold">
                Company Info
              </h2>
            </div>
            <ul className="space-y-2">
              <li>
                <strong>App Name:</strong> ATD Money
              </li>
              <li>
                <strong>Owner (NBFC):</strong> ATD FINANCIAL SERVICES PVT LTD
              </li>
              <li>
                <strong>Lender:</strong> ATD FINANCIAL SERVICES PVT LTD
              </li>
              <li>
                <strong>RBI License:</strong> B-12-00315 (<a target="_blank" href="https://sachet.rbi.org.in/" className="text-blue-500 underline">
                  Verify
                </a>)
              </li>
              <li>
                <strong>Established:</strong> 1996
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-6">
              <Award className="text-purple-500 mr-3" size={24} />
              <h2 className="text-xl md:text-2xl font-semibold">
                Key Features
              </h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>Instant Approval & Disbursement within minutes</li>
              <li>Loan Amount: ₹3,000 to ₹50,000</li>
              <li>Flexible Tenure up to 365 days</li>
              <li>No Hidden charges - Zero prepayment penalty</li>
              <li>Max APR: 45.85%</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-6">
              <Users className="text-green-500 mr-3" size={24} />
              <h2 className="text-xl md:text-2xl font-semibold">
                Eligibility Criteria
              </h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>Indian Citizen</li>
              <li>Salaried Employee with minimum ₹25,000/month</li>
              <li>Age: 18+ years</li>
              <li>Valid PAN & Aadhaar</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-6">
              <CheckCircle className="text-yellow-500 mr-3" size={24} />
              <h2 className="text-xl md:text-2xl font-semibold">
                Why ATD Money?
              </h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>30,000+ mini loans disbursed</li>
              <li>Low interest rates, No paperwork</li>
              <li>Only E-Mandate required, No PDC/NACH</li>
              <li>App tailored for salaried professionals</li>
              <li>Fully Digital Process</li>
            </ul>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          <section className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md border border-purple-100">
            <div className="flex items-center mb-6">
              <CreditCard className="text-purple-600 mr-3" size={24} />
              <h2 className="text-xl md:text-2xl font-semibold">
                Loan Details & Charges
              </h2>
            </div>
            <ul className="space-y-2">
              <li>
                <strong>Loan Amount:</strong> ₹3,000 – ₹50,000
              </li>
              <li>
                <strong>Rate of Interest (ROI):</strong> 0.067% per day
              </li>
              <li>
                <strong>Processing Fee:</strong> 3.5% – 7.5% + GST (18%)
              </li>
              <li>
                <strong>Documentation Fee:</strong> 3.5% – 7.5% + GST (18%)
              </li>
              <li>
                Above charges (Except ROI) varies depending upon, risk profile
                of the customer, past relation of the customer, Prompt
                repayment of earlier loans etc.
              </li>
            </ul>
          </section>

          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md border border-blue-100">
            <div className="flex items-center mb-6">
              <Calculator className="text-blue-600 mr-3" size={24} />
              <h2 className="text-xl md:text-2xl font-semibold">
                Loan Example Calculation
              </h2>
            </div>
            <p className="pb-4">
              For a 5,000 loan with 91-day tenure, the cost breakdown is as
              following:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Interest Payable: 304.85</li>
              <li>
                Processing + Documentation Fees (3.5% + 3.5%): 413.00 (Incl.
                GST @18% Rs. 63.00)
              </li>
              <li>Disbursed Amount: 4,587.00 (after deductions)</li>
              <li>Total Repayable Amount: 5,305.00</li>
              <li>Our Presence across India</li>
            </ul>
            <p className="pt-4">
              <strong>Prepayment Charges- Rs.0/-</strong> When customers delay their scheduled repayment, a penalty is charged. We made our customers aware regarding fees & charges through agreement which we shared on their registered email ids.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-md border border-green-100">
          <div className="flex items-center mb-6">
            <TrendingUp className="text-green-600 mr-3" size={24} />
            <h2 className="text-xl md:text-2xl font-semibold">
              Benefits & Risks
            </h2>
          </div>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Get access to higher amounts & tenures as you repay on time.
            </li>
            <li>
              Credit Score Improvement – Your payment behavior is shared with
              credit rating agencies. Timely repayments enhance your CIBIL
              score.
            </li>
          </ul>
        </div>

        <section className="grid md:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <FileText className="text-gray-700 mr-3" size={24} />
              <h2 className="text-xl md:text-2xl font-semibold">
                Required Documents
              </h2>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Recent Photograph</li>
              <li>PAN Card</li>
              <li>Aadhaar Card</li>
              <li>Address Proof</li>
              <li>Last 6 Months' Bank Statement</li>
              <li>Latest 3 Month Salary Slip</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <Download className="text-gray-700 mr-3" size={24} />
              <h2 className="text-xl md:text-2xl font-semibold">
                How to Apply
              </h2>
            </div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Download & Install ATD Money App</li>
              <li>Create Profile & Upload Documents</li>
              <li>Submit Loan Application</li>
              <li>Get Approval in 3 minutes</li>
              <li>E-sign Agreement</li>
              <li>Amount credited to bank in 10 minutes</li>
            </ol>
          </div>
        </section>

        <section className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-md border border-green-100">
          <div className="flex items-center mb-6">
            <Shield className="text-green-600 mr-3" size={24} />
            <h2 className="text-xl md:text-2xl font-semibold">
              Security & Data Protection
            </h2>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>496-bit SSL encryption for safe transactions</li>
            <li>Compliant with RBI 2022 Digital Lending Guidelines</li>
            <li>All data is secured with encrypted connections.</li>
            <li>Our IT team ensures top-level security compliance.</li>
            <li>No access to contacts/SMS/location without consent</li>
            <li>Fully secure data practices and encrypted info usage</li>
          </ul>
        </section>

        <section className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <Building className="text-gray-700 mr-3" size={24} />
            <h2 className="text-xl md:text-2xl font-semibold">
              Outsourced Collection Centre
            </h2>
          </div>
          <p>
            <strong>Agency:</strong> SR Enterprises, Delhi
          </p>
          <p>
            <strong>Contact:</strong> Mr. Satish Kumar Singh – +91 88025 71767
          </p>
        </section>

        <footer className="text-center pt-10 pb-6 text-sm text-gray-500">
          <p className="border-t border-gray-200 pt-6">
            ATD Money – Empowering Salaried Individuals Across India
          </p>
        </footer>
      </div>
    </div>;
};

export default AboutUs;
