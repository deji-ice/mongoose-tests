import * as OTPAuth from "otpauth";

export const validateOTP = async (req, res, next) => {
  try {
    // Create a new TOTP object.
    const { otp } = req.body;
    const secret = "NB2W45DFOIZA"; // This should match the secret used for generating the OTP

    // Create a TOTP object with the shared secret
    const totp = new OTPAuth.TOTP({
      issuer: "ACME",
      label: "AzureDiamond",
      algorithm: "SHA1",
      digits: 6,
      period: 120, // 120 seconds period 
      secret: secret,
    });

  
    // Validate a token (returns the token delta or null if it is not found in the
    // search window, in which case it should be considered invalid).
    let delta = totp.validate({token:otp, window: 1 });

    if (delta === null) {
        res.status(401).json({ message: "Invalid OTP" });
      } else {
        // Proceed to the next middleware/controller if OTP is valid
        next();
      }
  } catch (error) {
    next(error);
  }
};


