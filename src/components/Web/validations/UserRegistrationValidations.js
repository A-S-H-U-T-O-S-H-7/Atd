import * as Yup from "yup";
// Step 1: Phone Number Validation Schema
const PhoneValidationSchema = Yup.object({
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Must be exactly 10 digits")
    .required("Phone number is required")
});

// Step 1: Phone OTP Validation Schema
const PhoneOtpSchema = Yup.object({
  phoneOtp: Yup.string()
    .trim()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits and numeric")
    .required("Phone OTP is required")
});

// Step 2: Personal Details Validation Schema
const PersonalDetailsSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "First Name must only contain letters and spaces")
    .min(2, "First Name must be at least 2 characters")
    .max(50, "First Name cannot exceed 50 characters")
    .required("First Name is required"),

  lastName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Last Name must only contain letters and spaces")
    .min(2, "Last Name must be at least 2 characters")
    .max(50, "Last Name cannot exceed 50 characters")
    .required("Last Name is required"),

  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Please select a valid gender")
    .required("Gender is required"),

 
  alternativeEmail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .test(
      "unique-alt-email",
      "Alternative email cannot be same as your registered email",
      function (value) {
        if (!value) return true;
        const { userEmail } = this.options.context || {};
        return value !== userEmail;
      }
    )
    .nullable(),

  dob: Yup.date()
    .max(
      new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000),
      "Must be at least 18 years old"
    )
    .min(
      new Date(Date.now() - 80 * 365 * 24 * 60 * 60 * 1000),
      "Age cannot exceed 80 years"
    )
    .required("Date of Birth is required"),

  // FIX ADDRESS STRUCTURE TO MATCH COMPONENTS
  currentAddress: Yup.object().shape({
    houseNo: Yup.string()
      .min(1, "House number is required")
      .required("House number is required"),
    addressLine1: Yup.string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address cannot exceed 200 characters")
      .required("Address line 1 is required"),
    addressLine2: Yup.string().nullable(), // Optional field
    city: Yup.string()
      .required("City is required"),
    state: Yup.string()
      .required("State is required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Must be a valid 6-digit pincode")
      .required("Pincode is required"),
    addressType: Yup.string().required("Address type is required")
  }),

  permanentAddress: Yup.object().shape({
    houseNo: Yup.string().when("isSameAsCurrent", {
      is: false,
      then: (schema) => schema.min(1, "House number is required").required("House number is required"),
      otherwise: (schema) => schema.nullable()
    }),
    addressLine1: Yup.string()
      .when("isSameAsCurrent", {
        is: false,
        then: (schema) => schema.min(5, "Address must be at least 5 characters").max(200, "Address cannot exceed 200 characters").required("Address line 1 is required"),
        otherwise: (schema) => schema.nullable()
      }),
    addressLine2: Yup.string().nullable(), // Always optional
    city: Yup.string()
      .when("isSameAsCurrent", {
        is: false,
        then: (schema) => schema.required("City is required"),
        otherwise: (schema) => schema.nullable()
      }),
    state: Yup.string()
      .when("isSameAsCurrent", {
        is: false,
        then: (schema) => schema.required("State is required"),
        otherwise: (schema) => schema.nullable()
      }),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Must be a valid 6-digit pincode")
      .when("isSameAsCurrent", {
        is: false,
        then: (schema) => schema.required("Pincode is required"),
        otherwise: (schema) => schema.nullable()
      }),
    addressType: Yup.string().when("isSameAsCurrent", {
      is: false,
      then: (schema) => schema.required("Address type is required"),
      otherwise: (schema) => schema.nullable()
    }),
    isSameAsCurrent: Yup.boolean()
  }),
 
  referralCode: Yup.string()
    .min(6, "Referral code must be at least 6 characters")
    .max(12, "Referral code must be at most 12 characters")
    .matches(
      /^[A-Z0-9]+$/,
      "Referral code must contain only uppercase letters and numbers"
    ),

  fatherName: Yup.string()
    .matches(
        /^[a-zA-Z\s]+$/,
        "Father's Name must only contain letters and spaces"
    )
    .min(5, "Father's Name must be at least 5 characters")
    .max(50, "Father's Name cannot exceed 50 characters")
    .required("Father's Name is required"),

  familyReference: Yup.object().shape({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .required("Family reference name is required"),

    mobileNumber: Yup.string()
      .matches(/^\d{10}$/, "Must be exactly 10 digits")
      .test(
  "unique-mobile", 
  "Reference mobile number cannot be same as your registered mobile number",
  function (value) {
    if (!value) return true;
    const { phoneNumber } = this.options.context || {};
    
    // Ensure both values are strings before calling replace
    const cleanValue = String(value || '').replace(/\D/g, '');
    const cleanPhoneNumber = String(phoneNumber || '').replace(/\D/g, '');
    
    return cleanValue !== cleanPhoneNumber;
  }
)
      .required("Family reference mobile number is required"),

    email: Yup.string()
      .email('Invalid email format')
      .required('Family reference email is required')
      .test('not-same-as-user', 'Reference email cannot be same as your email', function(value) {
        const userEmail = this.from[1].value.email;
        return value !== userEmail;
      }),

    relation: Yup.string()
      .min(2, "Relation must be at least 2 characters") 
      .max(30, "Relation cannot exceed 30 characters")
      .required("Relation is required"),

    address: Yup.string()
      .min(10, "Address must be at least 10 characters")
      .max(200, "Address cannot exceed 200 characters")
      .required("Family reference address is required")
  })
});

// Step 3: Bank/Loan Details Validation Schema
const BankLoanDetailsSchema = Yup.object().shape({
  ifscCode: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .required("IFSC Code is required"),

  bankName: Yup.string()
    .min(2, "Bank name must be at least 2 characters")
    .max(100, "Bank name cannot exceed 100 characters")
    .required("Bank Name is required"),

  bankBranch: Yup.string()
    .min(2, "Bank branch must be at least 2 characters")
    .max(100, "Bank branch cannot exceed 100 characters")
    .required("Bank Branch is required"),

  accountNumber: Yup.string()
    .matches(/^\d{9,18}$/, "Enter a valid account number (9-18 digits)")
    .required("Account number is required"),

  confirmAccountNumber: Yup.string()
    .oneOf([Yup.ref("accountNumber")], "Account numbers must match")
    .required("Confirm account number is required"),

  accountType: Yup.string()
    .oneOf(["SAVING", "CURRENT"], "Please select a valid account type")
    .required("Account Type is required"),

    amount: Yup.string()
    .required("Loan amount is required")
    .test("min-amount", "Minimum loan amount is ₹3,000", function (value) {
      const numValue = parseInt(value?.replace(/[^0-9]/g, "") || "0");
      return numValue >= 3000;
    })
    .test("max-amount", "Maximum loan amount is ₹50,000", function (value) {
      const numValue = parseInt(value?.replace(/[^0-9]/g, "") || "0");
      return numValue <= 50000;
    }),

  tenure: Yup.string()
    .required("Loan tenure is required")
    .oneOf(
      ["90", "120", "150", "180", "210", "240", "365"],
      "Please select a valid tenure"
    )
});

// Step 4: Service/Employment Details Validation Schema
const ServiceDetailsSchema = Yup.object().shape({
  organizationName: Yup.string()
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name cannot exceed 100 characters")
    .required("Organization name is required"),

  organizationAddress: Yup.string()
    .min(10, "Organization address must be at least 10 characters")
    .max(200, "Organization address cannot exceed 200 characters")
    .required("Organization address is required"),

  officePhone: Yup.string()
    .matches(/^\d{10,11}$/, "Must be 10-11 digits")
    .required("Office phone number is required"),

  hrName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "HR Name must only contain letters and spaces")
    .min(2, "HR Name must be at least 2 characters")
    .max(50, "HR Name cannot exceed 50 characters")
    .required("HR Name is required"),

  hrPhone: Yup.string()
    .matches(/^\d{10}$/, "Must be exactly 10 digits")
    .required("HR phone number is required"),

  hrEmail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .required("HR email is required"),

  website: Yup.string()
    .matches(
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      "Invalid website URL"
    )
    .nullable(),

  monthlySalary: Yup.number()
    .min(15000, "Minimum monthly salary is ₹15,000")
    .max(10000000, "Maximum monthly salary is ₹1,00,00,000")
    .required("Monthly salary is required"),

  officialEmail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .required("Official email is required"),

  netMonthlySalary: Yup.number()
    .min(10000, "Minimum net monthly salary is ₹10,000")
    .max(10000000, "Maximum net monthly salary is ₹1,00,00,000")
    .test(
      "less-than-gross",
      "Net salary should be less than or equal to gross salary",
      function (value) {
        return value <= this.parent.monthlySalary;
      }
    )
    .required("Net monthly salary is required"),

  familyIncome: Yup.number()
    .min(0, "Family income cannot be negative")
    .max(100000000, "Family income cannot exceed ₹10,00,00,000")
    .required("Family income is required"),

  designation: Yup.string()
    .min(2, "Designation must be at least 2 characters")
    .max(50, "Designation cannot exceed 50 characters")
    .required("Designation is required"),

  existingEmi: Yup.number()
    .min(0, "Existing EMI cannot be negative")
    .max(1000000, "Existing EMI cannot exceed ₹10,00,000")
    .required("Existing EMI is required (enter 0 if none)"),

  workingSince: Yup.object().shape({
    month: Yup.string().required("Month is required"),
    year: Yup.number()
      .min(1970, "Year must be after 1970")
      .max(new Date().getFullYear(), "Year cannot be in the future")
      .required("Year is required")
  })
});

// Step 5: Document Upload Validation Schema
const DocumentUploadSchema = Yup.object().shape({
  aadharFront: Yup.mixed()
    .required("Aadhar Front is required")
    .test(
      "fileType",
      "Only JPG, JPEG, PNG or PDF files are allowed",
      (value) =>
        value &&
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          value.type
        )
    )
    .test(
      "fileSize",
      "File size should not exceed 2MB",
      (value) => value && value.size <= 2 * 1024 * 1024
    ),
   
  aadharBack: Yup.mixed()
    .required("Aadhar Back is required")
    .test(
      "fileType",
      "Only JPG, JPEG, PNG or PDF files are allowed",
      (value) =>
        value &&
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          value.type
        )
    )
    .test(
      "fileSize",
      "File size should not exceed 2MB",
      (value) => value && value.size <= 2 * 1024 * 1024
    ),
   
  panCard: Yup.mixed()
    .required("PAN Card is required")
    .test(
      "fileType",
      "Only JPG, JPEG, PNG or PDF files are allowed",
      (value) =>
        value &&
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          value.type
        )
    )
    .test(
      "fileSize",
      "File size should not exceed 2MB",
      (value) => value && value.size <= 2 * 1024 * 1024
    ),
   
  photo: Yup.mixed()
    .required("Photo is required")
    .test(
      "fileType",
      "Only JPG, JPEG or PNG files are allowed",
      (value) =>
        value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
    )
    .test(
      "fileSize",
      "File size should not exceed 1MB",
      (value) => value && value.size <= 1 * 1024 * 1024
    ),
   
  salarySlip1: Yup.mixed()
    .required("1st Month Salary Slip is required")
    .test(
      "fileType",
      "Only JPG, JPEG, PNG or PDF files are allowed",
      (value) =>
        value &&
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          value.type
        )
    )
    .test(
      "fileSize",
      "File size should not exceed 2MB",
      (value) => value && value.size <= 2 * 1024 * 1024
    ),
   
  salarySlip2: Yup.mixed()
    .required("2nd Month Salary Slip is required")
    .test(
      "fileType",
      "Only JPG, JPEG, PNG or PDF files are allowed",
      (value) =>
        value &&
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          value.type
        )
    )
    .test(
      "fileSize",
      "File size should not exceed 2MB",
      (value) => value && value.size <= 2 * 1024 * 1024
    ),
   
  salarySlip3: Yup.mixed()
    .required("3rd Month Salary Slip is required")
    .test(
      "fileType",
      "Only JPG, JPEG, PNG or PDF files are allowed",
      (value) =>
        value &&
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          value.type
        )
    )
    .test(
      "fileSize",
      "File size should not exceed 2MB",
      (value) => value && value.size <= 2 * 1024 * 1024
    ),
   
  bankStatement: Yup.mixed()
    .required("6 Month Bank Statement is required")
    .test(
      "fileType",
      "Only JPG, JPEG, PNG or PDF files are allowed",
      (value) =>
        value &&
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          value.type
        )
    )
    .test(
      "fileSize",
      "File size should not exceed 5MB",
      (value) => value && value.size <= 5 * 1024 * 1024
    )
});

// Step 6: References Validation Schema
const ReferencesSchema = Yup.object().shape({
  references: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .matches(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces")
          .min(2, "Name must be at least 2 characters")
          .max(50, "Name cannot exceed 50 characters")
          .required("Reference name is required"),

        phone: Yup.string()
          .matches(/^\d{10}$/, "Must be exactly 10 digits")
          .required("Reference phone number is required"),

        email: Yup.string()
          .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid email format"
          )
          .required("Reference email is required")
      })
    )
    .min(5, "All 5 references are required")
    .max(5, "Maximum 5 references allowed")
    .test(
      "unique-phones",
      "Phone numbers must be unique",
      function (references) {
        if (!references) return true;
        const phones = references.map((ref) => ref.phone).filter(Boolean);
        return phones.length === new Set(phones).size;
      }
    )
    .test(
      "unique-emails",
      "Email addresses must be unique",
      function (references) {
        if (!references) return true;
        const emails = references.map((ref) => ref.email).filter(Boolean);
        return emails.length === new Set(emails).size;
      }
    ),

    consentToContact: Yup.boolean()
    .oneOf([true], "You must provide consent to contact your references")
    .required("Consent is required")

});

export {
  PhoneValidationSchema,
  PhoneOtpSchema,
  PersonalDetailsSchema,
  BankLoanDetailsSchema,
  ServiceDetailsSchema,
  DocumentUploadSchema,
  ReferencesSchema
};
