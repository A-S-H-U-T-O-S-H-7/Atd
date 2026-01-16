"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { BiSolidLock } from "react-icons/bi";
import { FaAngleDown, FaAngleLeft } from "react-icons/fa6";


export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(null);
  const router = useRouter();



  const sections = [
    {
      title: "Information We Collect",
      content: `
        <p class="mb-4">The collection of information underneath this Privacy Policy is conducted for the subsequent categories of services mentioned below:</p>
        
        <p class="mb-2"><strong class="font-semibold">A.</strong> Information we collect for Lending Services through Digital Platform for facilitation the Loan being disbursed by NBFC, which is registered and governed by RBI. Details of the NBFC are mentioned in the website and the mobile application as well.</p>
        
        <p class="mb-4"><strong class="font-semibold">B.</strong> Information we collect for Non- Lending Services through Digital Platform when a User registering for a loan application on the above said Platform.</p>
        
        <p class="mb-4">Information we collect about you refers to facilitate the above mentioned 2 services which will be required to access, collect and share Personal Information with NBFC, registered and governed by RBI and third-party (if any) providing the value added services in our association. In this situation, we are able to provide the information securely and ensure that each recipient of the personal information follow confidentiality, constancy and secrecy obligations and sign covenants in this regard. Our platform may additionally make records available to third parties including NBFC, government agencies, courts, legal investigators , and different non-affiliated third parties as asked with the aid of You or Your authorized representative, or otherwise when required or permitted by law.</p>
        
        <ol class="list-decimal ml-6 space-y-2">
          <li>Identification Information: Name, gender, current and permanent residential / correspondence address, contact number, date of birth, marital status, e mail ID or other required contact information for processing the any application with us.</li>
          <li>KYC Information like PAN, ADHAAR, Signature and Photograph.</li>
          <li>Bank account details or other repayments related details.</li>
          <li>Any Other details which are important and required while processing the loan application or may be required by us for providing the product & services of ATD Financial Services Pvt Ltd or its related (at any manner) entity.</li>
          <li>Transaction Information: We examine, gather and monitor only financial transactional SMS for description of the transactions and the corresponding amounts for credit risk evaluation. Other SMS records aren't accessed.</li>
          <li>Storage Information: A user may down load and show information which includes all the applicable charges, fee etc. which a user may additionally seek advice from, or to upload required documents for processing the loan application.</li>
          <li>We read Name and Phone number information when you select the contact as a reference during the filling up the loan application form as the same is required for evaluation of the credit risk for processing the loan application and remain available in the software till repayment of any running loan. We don't upload your contact list provided as a reference to our servers in case your loan is not sanctioned or not disbursed.</li>
          <li>Information provided by way of customers thru our Website or Services and at the time of registration, use the centers and offerings to be had, information mechanically obtained and amassed will consist of information required for availing respective product & Services.</li>
          <li>Information from credit bureaus and customer service vendors to help ATD Finance with client verification and diligence required for ATD Finance and its related (at any manner) entity.</li>
          <li>Log information: Domain server through which the User accesses the App Search queries, IP cope with, crashes, date and time.</li>
          <li>SMS: With your permission, we may ship sms to verify registered quantity, collect and display handiest financial transactional/promotional messages for description of the transactions and the corresponding quantities for credit risk assessment (Other SMS records is not accessed).</li>
          <li>Details required for management or services and product development.</li>
          <li>Record and/or reveal calls if ATD Finance experience important for pleasant checks and staff training. Such recordings will also be used to help ATD Finance combat fraud.</li>
          <li>Feedback given via you.</li>
          <li>Third-party advertisements: We may use third-party advertising companies to serve ads when you visit our Website or Application. These companies may use information about your usage preferences (but not your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you. ATD Finance is not responsible for product and services of such websites and is also not responsible for their privacy practices, which ATD Finance does not own, manage or control. (However now not your name, address, e-mail cope with, or phone quantity) about your visits to this and different web sites with the intention to offer classified ads about items and services of interest to you. ATD Finance isn't always chargeable for product and offerings of such websites and is likewise no longer liable for their privateness practices, which ATD Finance does now not very own, manage or manage.</li>
          <li>Termination of account: While you can terminate your account as according to terms of use, your data may continue to be stored in archive on our servers even after the deletion or the termination of your account.</li>
          <li>Retention of accumulated Information: The statistics collected from you will be retained at some stage in the (i) validity of your Account and for the reason of submission of such facts, (ii) As consented by way of you whilst growing your User Account (iii) As required via any regulatory norms including but not restrained to the norms prescribed beneath Prevention of Money Laundering Act, 2002</li>
          <li>We ask site visitors to our site to use their social media logins (Facebook, Gmail, Instagram, LinkedIn etc. ) to provide customer review and remarks on our website.</li>
          <li>We collect certain device information provided for our above mentioned lending and non-lending services. Information which collected by the Application, and its usage, depends on how you manage your privacy controls on your device.</li>
          <li>Post installation of the Application, we store the collected information with unique identifiers tied to the device uses by you. Collection of information starts once you download and install the Application and later one during the process this seeks permissions from you for required information from the device. For the purpose of improvising the Application functionality, we do collect your Log information through domain server which the User accesses the App Search, IP address, crashes, date etc</li>
          <li>In addition to the above, we also track and collect the data related to the performance of the Application and other diagnostic data for identifying and resolving any technical glitches that may be identified from such data and also for improving the overall functionality of the Application.</li>
          <li>We do collect device location and request access for camera and microphone to facilitate lending services. We do use of this information, as to verify your address (provided at the time of application) we collect your device location information, to scan and capture the required details of KYC and other documents as per the policy of NBFC in accordance with applicable laws, we required the camera access. We transfer these information to the NBFC and shall not store any such data. The microphone permissions require to enable a two-way communication between our authorised representative and you to perform and complete your Video KYC for the Lending Services. Your audio may be recorded for regulatory purpose.</li>
        </ol>
      `
    },
    {
      title: "Information about you we collect from third parties",
      content: `
        <p class="mb-4">For making the Services to be had to you, we may additionally accumulate credit statistics via acquiring particular authorisations from you (if required beneath applicable legal guidelines), from certain third parties together with credit score bureaus or credit score rating corporations as your 'authorised representative' from time to time according with applicable laws at some point of the mortgage adventure as can be requested by NBFC.</p>
        <p class="mb-4">In order to facilitate credit score products to you, we might also receive certain records regarding file verification, compensation repute etc from certain third events which includes payment gateway and NSDL.</p>
        <p class="mb-4">We may similarly acquire your bank account numbers or UPI fee statistics on behalf of NBFC to facilitate collection and repayment of loan payments.</p>
        <p class="mb-4">We shall only accumulate this facts/information on a required basis strictly for the reason of offering you with the Product & Services. The information amassed from such third parties aren't retained by us. We acquire this data as part of our outsourcing obligations to our associated NBFC and is immediately transferred to the NBFC upon collection.</p>
      `
    },
    {
      title: "Information you give us about you",
      content: `
        <p class="mb-4"><strong class="font-semibold">A.</strong> In due path of using our Services, you are required to post records to allow our Services. We use this information to create your profile and provide you with the satisfactory available offerings. Mentioned beneath is a number of the statistics we collect from you:</p>
        
        <p class="mb-4"><strong class="font-semibold">B.</strong></p>
        
        <ul class="list-disc ml-6 space-y-2">
          <li>Data provided with the aid of you through filling in paperwork within the Application or on the Website.</li>
          <li>PAN Card, Aadhaar Card, monetary data inclusive of business enterprise name, month-to-month earnings, bank account no., bank statements, credit statistics, copies of identification documents which are forwarded to NBFC for the onboarding of your application to avail the offerings.</li>
          <li>Data generated via your usage of our Platform</li>
          <li>Data supplied with the aid of corresponding with us (as an instance, with the aid of electronic mail or chat).</li>
          <li>Data and facts, you offer while you check in to apply the Website, download or check in on our App, subscribe to any of our Services (including making use of for a loan), search for a Service, and whilst you report a hassle with our App, our Services, or any of our Sites.</li>
          <li>Data which include your call, address, gender, date of delivery, e mail deal with, cellphone number, username, password and other registration data.</li>
          <li>Wherever feasible, we indicate the necessary and the optional fields. You usually have the option to not provide any information by means of selecting no longer to use a particular service or function on the Platform. While you could browse a few sections of our Platform without being a registered member as cited above.</li>
          <li>We in no way and at no factor take any biometric information from you for any of our services or operations. In case, if any of our representatives ask for the equal from you, we request you to kindly chorus from doing the same and cope with this issue to our Grievance Officer (the info of the identical have been supplied underneath).</li>
          <li>This records allows us create your profiles, whole mandatory KYC as per the necessities of our NBFC who provide you the Services, release and approve loans and offer you with custom designed support in case of issues. Please note that we do now not store any records provided via you except for the fundamental statistics inclusive of name, cope with, and contact info and so on.</li>
        </ul>
      `
    },
    {
      title: "Storage of Personal Information",
      content: `
        <p class="mb-4">We only store some important information which is required for processing a loan application such as name, address, contact information. We ensure that all data / information is stored in servers located in India and that too compliance with all the statutory/regulatory obligations. Rest any other information required while processing of the application which is as per the instructions of the NBFC and transfer the same to the NBFC upon the completion of the preliminary onboarding.</p>
      `
    },
    {
      title: "Collection of Specific Non-Personal Information",
      content: `
        <p class="mb-4">We automatically tune sure facts approximately you based upon your behavior on our Platform. We use these records to do inner research on our customers' demographics, hobbies, and behavior to better recognize, shield and serve our customers and improve our services. This statistics is compiled and analyzed on an aggregated basis.</p>
        <p class="mb-4">Cookies are small data documents that a Website stores on your laptop. We will use cookies on our Website just like different lending websites / apps and on line marketplace web sites / apps. Use of this data allows us identify you for you to make our Website greater person friendly. Most browsers will permit you to decline cookies but if you pick out to try this it would have an effect on carrier on a few components of Our Website.</p>
        <p class="mb-4">If you pick to make a buy thru the Platform, we collect records approximately your buying behavior. We keep this statistics as vital to solve disputes, offer customer support and troubleshoot problems as accredited by using regulation. If you send us personal correspondence, together with emails or letters, or if different users or third events send us correspondence approximately your sports or postings on the Website, we accumulate such facts into a document unique to you.</p>
      `
    },
    {
      title: "Consent of the Customers",
      content: `
        <p class="mb-4">When an applicant request for any loan or financial solutions from us, we initially attain the authority from such applicant for the compilation, storage, investigation, publishing and distribution, at any time the Customer Data.</p>
        <p class="mb-4">At this website, by providing the Customer Data to ATD Money, the Customer (or the user) bestow his/her express permission to the fact that his/her personal data will be preserved and processed by us. The Customer has the authority to access their private data and to have it modified or amended by contacting ATD Money.</p>
        <p class="mb-4">While using this Web Site, you are not allowed to use the data and information for any illegal or unauthorized activities through hacking, cracking or defacing any portion of the site.</p>
      `
    },
    {
      title: "Prominent Disclosure",
      content: `
        <p class="mb-4">ATD Money shield Customer Data against unlawful use in the similar manner in which we care for our private information.</p>
        <p class="mb-4">The ATD MONEY (hereinafter 'Digital Lending App') is focused on ensuring the protection of personal information of our clients which has been given to us or gathered by us when you utilize our items and administrations which are worked under our brand. Our Privacy Statement is planned and created to comprehend the protection and security of customer's' personal information.</p>
        <p class="mb-4">This Privacy Statement/Policy clarifies the assortment, use, assurance, divulgence, sharing and move, assuming any, of "personal information" by ATD MONEY . ATD MONEY  maintains its authority to revise this Privacy Policy every now and then dependent on changes according to the business, legitimate and administrative prerequisites and relevant laws and the equivalent will be refreshed on this site. You are urged to intermittently visit this page to survey the approach and any changes. By utilizing our site or our items/administrations or in any case giving data to us through this application, you assent that your personal information might be utilized and dealt with as depicted in this Privacy Statement.</p>
        <p class="mb-4">This Privacy Policy is liable to changes according to applicable laws and guidelines and will stand altered from time to time. ATD Money  app ensures that your personal information will never be selling, leasing or renting out to anybody and keeping this thumb rule for data protection, ATD Money  may disclose the Personal Information for below mentioned cases.</p>
        <p class="mb-4"><strong class="font-semibold">Administrator</strong> - For our internal business purposes only we shall provide access to your Personal information to our authorized administrator who shall be under confidentiality obligations for the same.</p>
        <p class="mb-4"><strong class="font-semibold">Affiliates</strong> - ATD Money may disclose Personal Information to its affiliates with respect to respond to your requests for not to receive or limit your receipt for information or the Services related to marketing materials etc.</p>
        <p class="mb-4"><strong class="font-semibold">Business Partners</strong> -We may use certain trusted third party companies and individuals to help us provide, analyse, and improve the Services including but not limited to data storage, maintenance services, database management, credit bureaus, rating agencies, web analytics, payment processing, and improvement of the Platform's features. These third parties may have access to your information only for purposes of performing these tasks on our behalf and under obligations similar to those in this Privacy Policy.</p>
        <p class="mb-4"><strong class="font-semibold">Service Providers</strong> - We may share your Personal Information with the service providers, including NBFC, who are working with us in connection with the operation of the Services or the Platform, so long as such service providers are subject to confidentiality restrictions consistent with this Privacy Policy.</p>
        <p class="mb-4"><strong class="font-semibold">Joint Marketing Arrangements</strong> - Where permitted by law, we may share your Personal Information with joint marketers with whom we have a marketing arrangement, we would require all such joint marketers to have written contracts with us that specify the appropriate use of your Personal Information, require them to safeguard your Personal Information, and prohibit them from making unauthorized or unlawful use of your Personal Information</p>
        <p class="mb-4"><strong class="font-semibold">Persons Who Acquire Our Assets or Business</strong> - If we sell or transfer any of our business or assets, certain Personal Information may be a part of that sale or transfer. In the event of such a sale or transfer, we will notify you.</p>
        <p class="mb-4"><strong class="font-semibold">Legal and Regulatory Authorities</strong> - We may be required to disclose your Personal Information due to legal or regulatory requirements. In such instances, we reserve the right to disclose your Personal Information as required in order to comply with our legal obligations, including but not limited to complying with court orders, warrants, or discovery requests. We may also disclose your Personal Information(a) to law enforcement officers or others; (b) to Credit Information Companies; (c) to comply with a judicial proceeding, court order, or legal process served on us or the Platform; (d) to enforce or apply this Privacy Policy or the Terms of Service or our other policies or Agreements; (e) for an insolvency proceeding involving all or part of the business or asset to which the information pertains; (f) respond to claims that any Personal Information violates the rights of third-parties; (g) or protect the rights, property, or personal safety of the Company, or the general public. You agree and acknowledge that we may not inform you prior to or after disclosures made according to this section.</p>
        
        <ol class="list-decimal ml-6 space-y-2">
          <li>Authentication of your credit and economic position, reference checks, verification of private, demographic details/ data given to us at the time of filling loan application or any time afterward and making correlated inquiries through indication on account of the data and information provided to, or gathered by, ATD Money  as and when we consider necessary;</li>
          <li>Distributing, obtaining and/ or unveiling any characteristic of your individual, biometric, demographic, trade, credit and economic details/information/ data to any credit institution, financial agency, Reserve Bank of India, any other government/independent authority or any third party engaged by ATD Money  for intention of accurate certification and evaluation of the Customer Data, for statistics concerning Customer's Account, to gratify any lawfully enforceable process or observance purpose, or for archiving Client's Data and for complying with the regulations valid from time to time.</li>
          <li>Use of your details and data to perk up our services to the clientele and to keep them informed about our newly launched products or other information that may be relevant to such clients. We may go halves a little of the client data to third parties who may move toward or get in touch with you to provide striking offers to you through commercial ad or advertise campaigns, information flow etc.</li>
          <li>It may become essential for ATD Money to unveil the Customer Data to the representatives, other service providers and suppliers throughout usual business operations for the above referred intention.</li>
          <li>We may also tempt visitors to this website to take part in market research and analysis and other parallel activities. ATD Money will use the client information to perk up the visitor experience on the site and make ensuing offers to the visitor on products which may be relevant to him / her.</li>
        </ol>
        <p class="mb-4">On the other hand, these parties would be required to make use of the data/info gathered from ATD Money either for the reasons equally agreed with ATD Money or for the purposes specifically allowed by the pertinent laws solely. ATD Money will endeavor to take all sensible steps to make sure that the privacy of the Customer Data is preserved by commanding strict privacy policy on all the private and non-statutory third parties to whom it discloses such information.</p>
        <p class="mb-4">ATD Money is sturdily devoted to shielding the privacy of its clientele and has taken all essential and logical actions to look after the secrecy of the Client Data and its diffusion through the world wide web and it shall not be detained accountable for disclosure of the not to be disclosed information as per this policy or in terms of the contract, if any, with the clientele. Additionally, we use little bits of data called "cookies" pile up on users, computers to encourage a constant connection. "Cookies" let us store data/info about your predilection as well as passwords and permit you to move to diverse pages of our website without re-entering your secret code information. Any information gathered is stored in protected databases shielded with a range of access controls and is taken care as private information by us. Consequently, you should be watchful with the practice of the username and password by keeping privacy and make certain that you do not intentionally or unintentionally split, give and make possible illegal use of it.</p>
        <p class="mb-4">Notwithstanding anything mentioned hereinabove, ATD Money shall not be responsible for the actions or omissions of the NBFC or parties with whom the Personal Information is shared, nor shall ATD Money be responsible and/or liable for any additional information you may choose to provide directly to any Lender / service provider or third party.</p>
      `
    },
    {
      title: "Exclusions of Privacy Policy",
      content: `
        <p class="mb-4">We do not vend, deal, or otherwise transmit your personal exclusive details/data/info to outside parties. This does not comprise reliable third parties who lend us a hand in maintaining and running our Web site, conducting our trade, or serving you, on condition that those parties agree to keep this information private. Other websites that you may access through ATD Money website may have dissimilar privacy standards and right of entry to such web sites will not be subject matter to the Privacy Policy of ATD Money Web Site. We suggest that you read the privacy declaration of every such website to discover how they shield your confidential data and information. The exclusions herein shall not confine us from circulating business reports or subdivision reports of behavioral model of the customers.</p>
      `
    },
    {
      title: "Amendments",
      content: `
        <p class="mb-4">Due to modifications in regulations or development of performances and content on the website, we may make alteration to privacy standards (without being thankful to do so) and would reproduce those modifications in this privacy guidelines. Therefore, you are asked for to go through the privacy guideline principle statement on a constant basis.</p>
      `
    },
    {
      title: "Contact Person",
      content: `
        <p class="mb-4">For any query concerning privacy of Data or ideas for upgrading of this policy, you may contact www.atdmoney.com.</p>
      `
    },
    {
      title: "Terms & Conditions",
      content: `
        <ol class="list-decimal ml-6 space-y-2">
          <li>Acceptance or rejection of loan is sole discretion of management.</li>
          <li>Once you are registered in Atd money, same user id and password can be used for online shopping and availing reward points redemption earned through ATD Money from www.myshopbazzar.com.</li>
          <li>However, you can unsubscribe from www.myshopbazzar.com anytime you want if you do not want to avail this facility. Our privacy policy is subject to change at any time without prior notice. Kindly read the following statement to learn about our app permissions, information gathering and dissemination practices.</li>
        </ol>
        <p class="mb-4">By visiting this ATD Money technology Platform, mobile App etc, you are agreeing to be bound by the terms and conditions of this Privacy Policy. If you don't agree, please don't access our Platform, technology Platform, mobile App etc. By mere use of the Platform, technology Platform, mobile App etc, you expressly consent to our use and disclosure of your personal information in accordance with this Privacy Policy. This Privacy Policy is incorporated into and subject to the Terms of Use.</p>
        <p class="mb-4">To report content that you believe is inappropriate, in violation of applicable laws or any term of this Policy, or infringing upon other rights (including privacy rights), you may get in touch with our Grievance Officer.</p>
       
      `
    }
  ];

  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className=" py-4  md:py-8 px-4 md:px-10">
        <header className="mb-12 text-center">
          <div className="flex justify-end mb-4">
  {/* Back button - top right */}
  <button 
    onClick={() => router.back()} 
    className="flex items-center cursor-pointer gap-2 bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 font-medium"
  >
    <FaAngleLeft className="w-4 h-4" />
    Back
  </button>
</div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center">
              <BiSolidLock className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-5xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            ATD Money is devoted to shielding the private and financial
            details submitted by our customers and would make the best effort
            to defend such info and details from unconstitutional use.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="p-4 md:p-8 bg-teal-600 text-white">
            <h2 className="text-2xl text-center font-bold">
              Privacy Policy Overview 
            </h2>
            <p className="mt-2 text-indigo-100">
              This Privacy Policy would be relevant to use of the website or
              other web application of ATD Money. The terms and conditions of
              Website Use as stated in 'Policy on Website Use of the ATD
              Money' as modified infrequently is integrated herein by way of
              reference.
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {sections.map((section, index) =>
              <div key={index} className="accordion-item">
                <h3 className="text-lg ml-5 mt-5 text-left sm:text-xl font-medium text-gray-900">
                  {section.title}
                </h3>

                <div
                  className="px-6 py-5 sm:px-8 bg-gray-50 text-gray-700 prose prose-indigo max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 max-w-md">
          <h2 className="text-xl font-semibold text-teal-700 mb-4">
            Grievance Officer
          </h2>

          <p className="font-medium text-lg mb-2">Mr. Kisan Sahoo</p>
          <p className="mb-4">Grievance Officer</p>

          <div className="text-sm leading-relaxed mb-4">
            <p>1st Floor, C 316, B and C, Sector 10, Noida,</p>
            <p>Gautam Buddha Nagar, Uttar Pradesh, 201301</p>
            <p className="mt-2">
              📞 Mob: <a href="tel:+919999589201" className="text-teal-600 hover:underline">
                +91-9999589201
              </a>
            </p>
            <p>
              📧 Email: <a href="mailto:grievances@atdmoney.com" className="text-teal-600 hover:underline">
                grievances@atdmoney.com
              </a>
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Please review the privacy policy periodically to ensure you're
            aware of the latest updates.
          </p>
        </div>
       <div className="flex justify-end my-4">
  {/* Back button - top right */}
  <button 
    onClick={() => router.back()} 
    className="flex items-center cursor-pointer gap-2 bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 font-medium"
  >
    <FaAngleLeft className="w-4 h-4" />
    Back
  </button>
</div>

        <footer className="text-center mt-6 text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()} ATD Money. All rights reserved.
          </p>
        </footer>
      </div>
    </div>;
}
