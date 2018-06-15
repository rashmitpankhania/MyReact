const validIssueStatus = {
  New: true,
  Open: true,
  Assigned: true,
  Fixed: true,
  Verified: true,
  Closed: true,
};

const issueFieldType = {
  owner: 'required',
  status: 'required',
  created: 'required',
  title: 'required',
  completionDate: 'optional',
  effort: 'optional',
};

function cleanupIssue(issue) {
  const cleanedUpIssue = {};
  Object.keys(issue).forEach((field) => {
    if (issueFieldType[field]) {
      cleanedUpIssue[field] = issue[field];
    }
  });
  return cleanedUpIssue;
}

function validateIssue(issue) {
  const errors = [];
  Object.keys(issueFieldType).forEach((field) => {
    if (issueFieldType[field] && !issue[field]) {
      errors.push(`Missing mandatory field: ${field}.`);
    }
  });
  if (!validIssueStatus.issue.status) {
    errors.push(`${issue.status} is not a valid status.`);
  }
  return (errors.length ? errors.join('; ') : null);
}

export default {
  validateIssue,
  cleanupIssue,
};
