import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

interface ContactBody {
    Name: string;
    Email: string;
    Phone: number;
    Message: string;
    formID?: string;
}


// const emailTemplate = (data: ContactBody, formID: string): string => {
//   return `
// <!DOCTYPE html>
// <html>
// <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial">
// <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px">
// <tr><td align="center">

// <table width="700" cellpadding="0" cellspacing="0"
// style="background:linear-gradient(135deg,#F28F17 0%,#FFFAF4 50%,#66B5FF 100%);
// border-radius:12px;padding:30px">

// <tr>
// <td align="center" style="padding-bottom:20px;font-size:22px;font-weight:bold">
// New Inquiry Received
// <img src="cid:inquiryImage" width="81" style="vertical-align:middle;margin-left:4px"/>
// </td>
// </tr>

// <tr><td>
// <table width="100%" style="background:#fff;border-radius:12px">
// <tr><td style="padding:30px">

// <table width="100%">

// <tr>
// <td width="160"><img src="${ICON_USER}" width="27" style="vertical-align:middle;margin-right:2px"/> Name:</td>
// <td>${data.Name}</td>
// </tr>

// <tr>
// <td><img src="${ICON_EMAIL}" width="27" style="vertical-align:middle;margin-right:2px"/> Email:</td>
// <td>${data.Email}</td>
// </tr>

// <tr>
// <td><img src="${ICON_PHONE}" width="27" style="vertical-align:middle;margin-right:2px"/> Phone:</td>
// <td>${data.Phone}</td>
// </tr>

// <tr>
// <td valign="top"><img src="${ICON_MESSAGE}" width="27" style="vertical-align:middle;margin-right:2px"/> Message:</td>
// <td style="line-height:1.6">${data.Message}</td>
// </tr>

// </table>

// </td></tr></table>
// </td></tr>

// <tr>
// <td align="center" style="padding-top:20px;font-size:12px">
// Form ID: <b>${formID}</b><br/>
// ${new Date().toLocaleString()}
// </td>
// </tr>

// </table>

// </td></tr>
// </table>
// </body>
// </html>`;
// };

const emailTemplate = (data: ContactBody, formID: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Inquiry</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="700" cellpadding="0" cellspacing="0"
          style="background:linear-gradient(135deg,#F28F17 0%,#FFFAF4 50%,#66B5FF 100%);
                 border-radius:12px;
                 padding:30px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:22px;font-weight:bold;color:#333;padding-left:8px;">
                    New Inquiry Received
                    <img src="cid:inquiryImage" width="81"
                      style="vertical-align:middle;margin-left:4px" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- White Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#ffffff;border-radius:12px;">
                <tr>
                  <td style="padding:30px;">

                    <table width="100%" cellpadding="0" cellspacing="0">

                      <!-- Name -->
                      <tr>
                        <td width="160" style="padding:10px 0;font-weight:bold;color:#000;">
                          <span style="vertical-align:middle;margin-right:2px;display:inline-block;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                              width="27" height="27" fill="#F28F17">
                              <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/>
                            </svg>
                          </span>
                          Name:
                        </td>
                        <td style="padding:10px 0;color:#333;">
                          ${data.Name}
                        </td>
                      </tr>

                      <!-- Email -->
                      <tr>
                        <td style="padding:10px 0;font-weight:bold;color:#000;">
                          <span style="vertical-align:middle;margin-right:2px;display:inline-block;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                              width="27" height="27" fill="#F28F17">
                              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                          </span>
                          Email:
                        </td>
                        <td style="padding:10px 0;color:#333;">
                          ${data.Email}
                        </td>
                      </tr>

                      <!-- Phone -->
                      <tr>
                        <td style="padding:10px 0;font-weight:bold;color:#000;">
                          <span style="vertical-align:middle;margin-right:2px;display:inline-block;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                              width="27" height="27" fill="#F28F17">
                              <path d="M391 480c-19.52 0-46.94-7.06-88-30-49.93-28-88.55-53.85-138.21-103.38C116.91 298.77 93.61 267.79 61 208.45c-36.84-67-30.56-102.12-23.54-117.13C45.82 73.38 58.16 62.65 74.11 52a176.3 176.3 0 0 1 28.64-15.2c4.95-2.23 12.45-5.6 21.95-2 6.34 2.38 12 7.25 20.86 16 18.17 17.92 43 57.83 52.16 77.43 6.15 13.21 10.22 21.93 10.23 31.71 0 11.45-5.76 20.28-12.75 29.81-7.61 10-9.28 12.89-8.18 18.05 2.23 10.37 18.86 41.24 46.19 68.51s57.31 42.85 67.72 45.07c5.38 1.15 8.33-.59 18.65-8.47 10.66-7.93 19.08-13.54 30.26-13.54h.06c9.73 0 18.06 4.22 31.86 11.18 18 9.08 59.11 33.59 77.14 51.78 8.77 8.84 13.66 14.48 16.05 20.81 3.6 9.53.21 17-2 22a176.49 176.49 0 0 1-15.29 28.58c-10.63 15.9-21.4 28.21-39.38 36.58A67.42 67.42 0 0 1 391 480z"/>
                            </svg>
                          </span>
                          Phone:
                        </td>
                        <td style="padding:10px 0;color:#333;">
                          ${data.Phone}
                        </td>
                      </tr>

                      <!-- Message -->
                      <tr>
                        <td style="padding:10px 0;font-weight:bold;color:#000;vertical-align:top;">
                          <span style="vertical-align:middle;margin-right:2px;display:inline-block;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                              width="27" height="27" fill="#F28F17">
                              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                            </svg>
                          </span>
                          Message:
                        </td>
                        <td style="padding:10px 0;color:#333;line-height:1.6;text-align:justify;">
                          ${data.Message}
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:20px;font-size:12px;color:#333;">
              Form ID: <strong>${formID}</strong><br />
              Received on: ${new Date().toLocaleString()}
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export const contactUsController = async (
    req: Request<{}, {}, ContactBody>,
    res: Response
): Promise<Response> => {

    const formID = req.body.formID || uuidv4();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER as string,
            pass: process.env.EMAIL_PASS as string
        }
    });

    try {
        const { Name, Email, Phone, Message } = req.body;

        if (!Name || !Email || !Phone || !Message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        await transporter.sendMail({
            from: `"Contact Us" <${process.env.EMAIL_USER}>`,
            to: "akshay.mittal@adaired.org",
            subject: "New Contact Inquiry",
            html: emailTemplate(req.body, formID),
            attachments: [
                {
                    filename: "inquiry.png",
                    path: "public/images/inquiry.png",
                    cid: "inquiryImage"
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Contact request sent successfully"
        });

    } catch (error: any) {
        console.error("Contact Us Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Email sending failed"
        });
    }
};