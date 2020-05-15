const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "Your Gmail ID",
        pass: "Gmail Password"
    }
  });
  const rand,mailOptions,host,link;