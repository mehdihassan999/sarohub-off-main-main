import { OpportunityField } from '../../types';

export const FIELD_TYPES = [
  { value: 'text', label: 'Single Line Text' },
  { value: 'full_name', label: 'Full Name' },
  { value: 'email', label: 'Email Address' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'cnic_passport', label: 'CNIC/Passport Number' },
  { value: 'date', label: 'Date Picker' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Single Checkbox (Terms/Consent)' },
  { value: 'checkbox_multi', label: 'Multiple Checkboxes' },
  { value: 'multi_select', label: 'Multi Select Chips' },
  { value: 'yes_no_toggle', label: 'Yes/No Toggle' },
  { value: 'file', label: 'File Upload' },
  { value: 'file_multiple', label: 'Multiple File Upload' },
  { value: 'image', label: 'Image Upload' },
  { value: 'resume', label: 'Resume/CV Upload' },
  { value: 'cover_letter', label: 'Cover Letter Upload' },
  { value: 'transcript', label: 'Transcript Upload' },
  { value: 'certificate', label: 'Certificate Upload' },
  { value: 'portfolio_upload', label: 'Portfolio Upload' },
  { value: 'url', label: 'URL/Website' },
  { value: 'linkedin', label: 'LinkedIn Profile' },
  { value: 'github', label: 'GitHub Profile' },
  { value: 'country', label: 'Country' },
  { value: 'state', label: 'Province/State' },
  { value: 'city', label: 'City' }
] as const;

export const SCHOLARSHIP_PRESET: OpportunityField[] = [
  { id: 'field_full_name', type: 'full_name', label: 'Full Name', required: true, placeholder: 'Enter your full legal name', description: 'Name exactly as registered on official records.' },
  { id: 'field_email', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your active email address', description: 'Used for admission announcements.' },
  { id: 'field_phone', type: 'phone', label: 'Phone Number', required: true, placeholder: 'e.g., +92 343 0381473', description: 'Active contact phone number.' },
  { id: 'field_gender', type: 'radio', label: 'Gender', required: true, options: ['Male', 'Female', 'Other'] },
  { id: 'field_qualification', type: 'dropdown', label: 'Qualification', required: true, options: ['Secondary/High School', 'Diploma', 'Bachelors', 'Masters', 'PhD'], placeholder: 'Select highest level achieved' },
  { id: 'field_institution', type: 'text', label: 'Current Institution', required: true, placeholder: 'e.g., University of Baltistan / KIU / NUST' },
  { id: 'field_cgpa', type: 'number', label: 'CGPA', required: true, placeholder: 'e.g., 3.80', description: 'Cumulative grade point average.', validation: { minValue: 0, maxValue: 100 } },
  { id: 'field_laptop', type: 'yes_no_toggle', label: 'Do you own a laptop?', required: true, description: 'Required for our cloud development sandbox.' },
  { id: 'field_income', type: 'number', label: 'Family Income', required: true, placeholder: 'e.g., 150000', description: 'Monthly household earnings in PKR.' },
  { id: 'field_sop', type: 'textarea', label: 'Statement of Purpose', required: true, placeholder: 'Explain why you should be awarded this scholarship...', description: 'Describe your background and financial context.', validation: { minLength: 50 } },
  { id: 'field_transcript', type: 'transcript', label: 'Transcript Upload', required: true, description: 'Attach certified transcripts (PDF only, Max 5MB).', validation: { allowedFileTypes: ['.pdf'], maxFileSizeMb: 5 } }
];

export const INTERNSHIP_PRESET: OpportunityField[] = [
  { id: 'field_full_name', type: 'full_name', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
  { id: 'field_email', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email address' },
  { id: 'field_phone', type: 'phone', label: 'Phone Number', required: true, placeholder: 'e.g., +92 343 0381473' },
  { id: 'field_university', type: 'text', label: 'University', required: true, placeholder: 'e.g., University of Baltistan' },
  { id: 'field_degree', type: 'text', label: 'Degree', required: true, placeholder: 'e.g., BS in Computer Science' },
  { id: 'field_semester', type: 'dropdown', label: 'Semester', required: true, options: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'], placeholder: 'Select your current semester' },
  { id: 'field_skills', type: 'checkbox_multi', label: 'Skills', required: true, options: ['React/TypeScript', 'NodeJS/Express', 'Python/ML', 'SQL/NoSQL', 'Docker/K8s'], description: 'Primary technical tools you have built projects with.' },
  { id: 'field_portfolio', type: 'url', label: 'Portfolio URL', required: false, placeholder: 'https://portfolio.com' },
  { id: 'field_linkedin', type: 'linkedin', label: 'LinkedIn Profile', required: true, placeholder: 'https://linkedin.com/in/username' },
  { id: 'field_github', type: 'github', label: 'GitHub Profile', required: true, placeholder: 'https://github.com/username' },
  { id: 'field_resume', type: 'resume', label: 'Resume Upload', required: true, description: 'Attach latest professional CV (PDF only, Max 5MB).', validation: { allowedFileTypes: ['.pdf'], maxFileSizeMb: 5 } },
  { id: 'field_cover', type: 'cover_letter', label: 'Cover Letter Upload', required: false, description: 'Optional cover letter (PDF/DOCX, Max 5MB).', validation: { allowedFileTypes: ['.pdf', '.docx'], maxFileSizeMb: 5 } }
];

export const JOB_PRESET: OpportunityField[] = [
  { id: 'field_full_name', type: 'full_name', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
  { id: 'field_email', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email address' },
  { id: 'field_phone', type: 'phone', label: 'Phone Number', required: true, placeholder: 'e.g., +92 343 0381473' },
  { id: 'field_experience', type: 'number', label: 'Years of Experience', required: true, placeholder: 'e.g., 3', validation: { minValue: 0 } },
  { id: 'field_current_company', type: 'text', label: 'Current Company', required: false, placeholder: 'e.g., Acme Technologies' },
  { id: 'field_expected_salary', type: 'number', label: 'Expected Salary', required: true, placeholder: 'e.g., 250000', description: 'Expected monthly gross in PKR.' },
  { id: 'field_notice_period', type: 'dropdown', label: 'Notice Period', required: true, options: ['Immediate', '15 Days', '1 Month', '2 Months', '3 Months'], placeholder: 'Select notice period duration' },
  { id: 'field_resume', type: 'resume', label: 'Resume Upload', required: true, description: 'Attach professional CV (PDF only, Max 5MB).', validation: { allowedFileTypes: ['.pdf'], maxFileSizeMb: 5 } },
  { id: 'field_portfolio', type: 'portfolio_upload', label: 'Portfolio Upload', required: false, description: 'Submit work links, design decks or case studies (PDF/Zip, Max 10MB).', validation: { allowedFileTypes: ['.pdf', '.zip'], maxFileSizeMb: 10 } },
  { id: 'field_certs', type: 'certificate', label: 'Certificates Upload', required: false, description: 'Professional certs (PDF/Images, Max 5MB).', validation: { allowedFileTypes: ['.pdf', '.png', '.jpg'], maxFileSizeMb: 5 } }
];
