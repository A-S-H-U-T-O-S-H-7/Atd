import React from "react";
import Image from "next/image";
import { GrAppleAppStore } from "react-icons/gr";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { Phone, Mail } from "lucide-react";
import Link from "next/link";

function UserFooter() {
  return (
    <footer className="w-full">
      {/* Main Footer Section */}
      <div className="bg-blue-950 text-gray-300">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Brand and Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Link href={"/"}>
                  <div className=" p-2 rounded-lg">
                    <Image
                      src="/atdlogo.png"
                      alt="ATD Money Logo"
                      width={240}
                      height={240}
                      className="object-contain w-18 md:w-17"
                      priority
                    />
                  </div>
                </Link>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                  ATD MONEY
                </h1>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                <span className="font-semibold text-gray-300">
                  ATD Money
                </span>{" "}
                is India's trusted digital financial services platform committed
                to empowering individuals with quick, transparent, and secure
                short-term loans. With millions of downloads and successful
                disbursals, we aim to bridge financial gaps for everyday needs.
              </p>
            </div>

            {/* Quick contact */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-16 after:bg-teal-500">
                Quick Contact
              </h4>
              <div className="space-y-3">
                <a
                  href="tel:01204348458"
                  className="flex items-center gap-3 group"
                >
                  <div className="bg-slate-800 p-2 rounded-full group-hover:bg-teal-900 transition-colors duration-300">
                    <Phone className="h-4 w-4 text-teal-400" />
                  </div>
                  <span className="text-gray-400 group-hover:text-teal-300 transition-colors duration-300">
                    01204348458
                  </span>
                </a>
                <a
                  href="tel:+919999589229"
                  className="flex items-center gap-3 group"
                >
                  <div className="bg-slate-800 p-2 rounded-full group-hover:bg-teal-900 transition-colors duration-300">
                    <Phone className="h-4 w-4 text-teal-400" />
                  </div>
                  <span className="text-gray-400 group-hover:text-teal-300 transition-colors duration-300">
                    +91 9999589229
                  </span>
                </a>
                <a
                  href="mailto:info@atdmoney.com"
                  className="flex items-center gap-3 group"
                >
                  <div className="bg-slate-800 p-2 rounded-full group-hover:bg-teal-900 transition-colors duration-300">
                    <Mail className="h-4 w-4 text-teal-400" />
                  </div>
                  <span className="text-gray-400 group-hover:text-teal-300 transition-colors duration-300">
                    info@atdmoney.com
                  </span>
                </a>
                
              </div>
            </div>

            {/* Download Apps */}
            <div className="space-y-4">    

              <div className="mt-6">
                <p className="text-sm font-medium mb-3 text-gray-300">
                  Follow Us
                </p>
                <div className="flex gap-4">
                  {[
                    {
                      name: "facebook",
                      url:
                        "https://www.facebook.com/profile.php?id=100088690347026"
                    },
                    {
                      name: "instagram",
                      url: "https://www.instagram.com/atdmoneyindia/"
                    },
                    {
                      name: "youtube",
                      url:
                        "https://www.youtube.com/channel/UCclz8GoGt6S4vCHsDTCTLlQ"
                    },
                    {
                      name: "pinterest",
                      url: "https://in.pinterest.com/atdmoney/"
                    },
                    {
                      name: "Linkedin",
                      url:
                        "https://www.linkedin.com/company/atdmoney2/?viewAsMember=true"
                    },
                    { name: "x", url: "https://x.com/MoneyAtd" }
                  ].map(({ name, url }) =>
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-gray-300 p-2 rounded-full hover:bg-slate-700 transition-colors duration-300 group"
                      style={{ width: "46px", height: "46px" }}
                    >
                      <Image
                        src={`/${name}.svg`}
                        alt={`${name} icon`}
                        width={30}
                        height={30}
                        className="object-contain filter group-hover:brightness-125"
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="bg-slate-950 text-gray-400">
        <div className="container mx-auto">
          {/* Policy Links */}
          <div className="flex flex-wrap justify-center md:justify-between gap-4 py-4 px-4 border-b border-slate-800 text-sm">
            <Link
              href="/privacypolicy"
              className="hover:text-teal-300 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/refundpolicy"
              className="hover:text-teal-300 transition-colors duration-300"
            >
              Refund Policy
            </Link>
            <Link
              href="/terms&condition"
              className="hover:text-teal-300 transition-colors duration-300"
            >
              Terms Of Use
            </Link>
            <Link
              href="/disclaimer"
              className="hover:text-teal-300 transition-colors duration-300"
            >
              Disclaimer
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center py-4 text-xs space-y-1">
            <p>
              © {new Date().getFullYear()} ATD Fintech Services Pvt. Ltd. All
              rights reserved
            </p>
            <p className="text-gray-500">
              Designed by
              <a
                className="cursor-pointer "
                target="_blank"
                href="https://alltimedata.com/"
              >
                <span className="text-teal-400"> ALL TIME DATA</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default UserFooter;
