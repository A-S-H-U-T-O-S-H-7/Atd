import React from "react";
import { Field, ErrorMessage } from "formik";
import Link from "next/link";

export const TermsAndConditions = () => {
  return (
    <Field name="agreeToTerms">
      {({ field, form }) => (
        <div className="mb-6">
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              checked={field.value}
              onChange={e => form.setFieldValue("agreeToTerms", e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-0.5"
            />
            <label className="text-sm text-gray-700 leading-relaxed">
              I agree to ATD Money's{" "}
              <Link 
                href="/privacypolicy" 
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
              {" "}and{" "}
              <Link 
                href="/terms&condition" 
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </Link>
              . I consent to receive communications and marketing materials.
            </label>
          </div>
          <ErrorMessage name="agreeToTerms" component="p" className="text-red-500 text-xs mt-2 ml-1" />
        </div>
      )}
    </Field>
  );
};