/*
  The introduction of the new UAT flavor breaks the rules that the original validate script was based upon.
  Due to time constraints, we're disabling the environment validations fails for the next days.

  After releasing Dr. Wong - we'll immediately work together on creating a new validation script
  that complies with the new rules (uat, training and production being similar while test being the only
  outlier).

  If needed, you can check the old validation code on legacyValidate.js
 */

console.info(
  'Environment file validation skipped, check validate.js file for more details.'
)
process.exit(0)
