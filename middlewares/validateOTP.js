import * as OTPAuth from "otpauth";

export const validateOTP = async (req, res, next) => {
  try {
    // Create a new TOTP object.
    let totp = new OTPAuth.TOTP({
      // Provider or service the account is associated with.
      issuer: "ACME",
      // Account identifier.
      label: "AzureDiamond",
      // Algorithm used for the HMAC function.
      algorithm: "SHA1",
      // Length of the generated tokens.
      digits: 6,
      // Interval of time for which a token is valid, in seconds.
      period: 120,
      // Arbitrary key encoded in Base32 or OTPAuth.Secret instance.
      secret: "NB2W45DFOIZA", // or 'OTPAuth.Secret.fromBase32("NB2W45DFOIZA")'
    });

    const { otp } = req.body;
    // Validate a token (returns the token delta or null if it is not found in the
    // search window, in which case it should be considered invalid).
    let delta = totp.validate({ otp, window: 1 });
    if (delta === null) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP", 
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while trying to validate OTP",
    });
  }
};
