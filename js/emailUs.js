let form = document.querySelector("#contact__form");
function sendEmail() {
  console.log(form[0].value);
  if (
    form[0].value == "" ||
    form[1].value == "" ||
    form[2].value == "" ||
    form[3].value == ""
  ) {
      alert('Please Fill all Feilds');
  } else {
    Email.send({
      Host: "smtp.mailtrap.io",
      Username: "f8064f9e8f53c2",
      Password: "c912f031e0b945",
      To: "adnanjutt918@gmail.com",
      From: form[1].value,
      Subject: form[2].value,
      Body:
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
              <html xmlns="http://www.w3.org/1999/xhtml">\
                <head>\
                  <title>\
                  </title>\
                  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
                  <meta name="viewport" content="width=device-width">\
                  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">\
                  <style type="text/css">body, html {\
                    margin: 0px;\
                    padding: 0px;\
                    -webkit-font-smoothing: antialiased;\
                    text-size-adjust: none;\
                    width: 100% !important;\
                  }\
                    table td, table {\
                    }\
                    #outlook a {\
                      padding: 0px;\
                    }\
                    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {\
                      line-height: 100%;\
                    }\
                    .ExternalClass {\
                      width: 100%;\
                    }\
                    @media only screen and (max-width: 480px) {\
                      table, table tr td, table td {\
                        width: 100% ;\
                      }\
                      table tr td table.edsocialfollowcontainer  {\
                        width: auto;\
                      }\
                      img {\
                        width: inherit;\
                      }\
                      .layer_2 {\
                        max-width: 100% !important;\
                      }\
                      .edsocialfollowcontainer table {\
                        max-width: 25% !important;\
                      }\
                      .edsocialfollowcontainer table td {\
                        padding: 10px !important;\
                      }\
                      .edsocialfollowcontainer table {\
                        max-width: 25% !important;\
                      }\
                      .edsocialfollowcontainer table td {\
                        padding: 10px !important;\
                      }\
                    }\
                  </style>\
                  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i &subset=cyrillic,latin-ext" data-name="open_sans" rel="stylesheet" type="text/css">\
                  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css">\
                </head>\
                <body style="padding:0; margin: 0;background: #e4e6ec">\
                  <table style="height: 100%; width: 100%; background-color: #e4e6ec;" align="center">\
                    <tbody>\
                      <tr>\
                        <td valign="top" id="dbody" data-version="2.31" style="width: 100%; height: 100%; padding-top: 50px; padding-bottom: 50px; background-color: #e4e6ec;">\
                          <!--[if (gte mso 9)|(IE)]><table align="center" style="max-width:600px" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->\
                          <table class="layer_1" align="center" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; box-sizing: border-box; width: 100%; margin: 0px auto;">\
                            <tbody>\
                              <tr>\
                                <td class="drow" valign="top" align="center" style="background-color: #e4e6ec; box-sizing: border-box; font-size: 0px; text-align: center;">\
                                  <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->\
                                  <div class="layer_2" style="max-width: 596px; display: inline-block; vertical-align: top; width: 100%;">\
                                    <table border="0" cellspacing="0" class="edcontent" style="border-collapse: collapse;width:100%">\
                                      <tbody>\
                                        <tr>\
                                          <td valign="top" class="edtext" style="padding: 0px; text-align: left; color: #5f5f5f; font-size: 12px; font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; word-break: break-word; direction: ltr; box-sizing: border-box;">\
                                            <p style="text-align: right; font-size: 9px; margin: 0px; padding: 0px;"> Unable to view? Read it \
                                              <a href="{view}" style="color: #5457ff; text-decoration: none;">online</a> \
                                              <a href="{view}" style="color: #5457ff; text-decoration: none;"></a></p>\
                                          </td>\
                                        </tr>\
                                      </tbody>\
                                    </table>\
                                  </div>\
                                  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->\
                                </td>\
                              </tr>\
                              <tr>\
                                <td class="drow" valign="top" align="center" style="background-color: #e4e6ec; box-sizing: border-box; font-size: 0px; text-align: center;">\
                                  <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->\
                                  <div class="layer_2" style="max-width: 596px; display: inline-block; vertical-align: top; width: 100%;">\
                                    <table border="0" cellspacing="0" cellpadding="0" class="edcontent" style="border-collapse: collapse;width:100%">\
                                      <tbody>\
                                        <tr>\
                                          <td valign="top" class="emptycell" style="padding: 10px;">\
                                          </td>\
                                        </tr>\
                                      </tbody>\
                                    </table>\
                                  </div>\
                                  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->\
                                </td>\
                              </tr>\
                              <tr>\
                                <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">\
                                  <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->\
                                  <div class="layer_2" style="max-width: 596px; display: inline-block; vertical-align: top; width: 100%;">\
                                    <table class="edcontent" style="border-collapse: collapse;width:100%" border="0" cellpadding="0" cellspacing="0">\
                                      <tbody>\
                                        <tr>\
                                          <td class="edimg" valign="top" style="padding: 0px; box-sizing: border-box; text-align: center;">\
                                            <img style="border-width: 0px; border-style: none; max-width: 596px; width: 100%;" width="596" alt="Image" src="https://api.elasticemail.com/userfile/49540e0f-2e09-4101-a05d-5032842b99d3/template-enhancements-1.jpg">\
                                          </td>\
                                        </tr>\
                                      </tbody>\
                                    </table>\
                                  </div>\
                                  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->\
                                </td>\
                              </tr>\
                              <tr>\
                                <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">\
                                  <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->\
                                  <div class="layer_2" style="max-width: 596px; display: inline-block; vertical-align: top; width: 100%;">\
                                    <table border="0" cellspacing="0" cellpadding="0" class="edcontent" style="border-collapse: collapse;width:100%">\
                                      <tbody>\
                                        <tr>\
                                          <td valign="top" class="emptycell" style="padding: 10px;">\
                                          </td>\
                                        </tr>\
                                      </tbody>\
                                    </table>\
                                  </div>\
                                  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->\
                                </td>\
                              </tr>\
                              <tr>\
                                <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">\
                                  <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->\
                                  <div class="layer_2" style="display: inline-block; vertical-align: top; width: 100%; max-width: 600px;">\
                                    <table border="0" cellspacing="0" class="edcontent" style="border-collapse: collapse;width:100%">\
                                      <tbody>\
                                        <tr>\
                                          <td valign="top" class="edtext" style="padding: 20px; text-align: left; color: #5f5f5f; font-size: 12px; font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; word-break: break-word; direction: ltr; box-sizing: border-box;">\
                                            <p style="margin: 0px; padding: 0px;">From:&nbsp; &nbsp; &nbsp;\
                                                &nbsp; &nbsp; &nbsp; &nbsp;\
                                                <strong>' +
        form[1].value +
        '\
                                                </strong>\
                                            </p>\
                                            <p style="margin: 0px; padding: 0px;">To:&nbsp; &nbsp; &nbsp;\
                                                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; \
                                                <strong>adnanjutt678@gmail.com\
                                                </strong>\
                                                <br>\
                                            </p>\
                                            <p style="margin: 0px; padding: 0px;">User name:&nbsp; &nbsp;\
                                                <strong>' +
        form[0].value +
        '\
                                                </strong>\
                                                <br>\
                                            </p>\
                                            <p style="margin: 0px; padding: 0px;">Subject:&nbsp; &nbsp;\
                                                &nbsp; &nbsp; &nbsp;\
                                                <strong>' +
        form[2].value +
        '\
                                                </strong>\
                                                <br>\
                                            </p>\
                                            <p style="margin: 0px; padding: 0px;">Message:\
                                                <strong>&nbsp; &nbsp; &nbsp;&nbsp;\
                                                </strong>\
                                            </p>\
                                          </td>\
                                        </tr>\
                                      </tbody>\
                                    </table>\
                                  </div>\
                                  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->\
                                </td>\
                              </tr>\
                              <tr>\
                                <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">\
                                  <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->\
                                  <div class="layer_2" style="max-width: 596px; display: inline-block; vertical-align: top; width: 100%;">\
                                    <table border="0" cellspacing="0" class="edcontent" style="border-collapse: collapse;width:100%">\
                                      <tbody>\
                                        <tr>\
                                          <td valign="top" class="edtext" style="padding: 20px; text-align: left; color: #5f5f5f; font-size: 12px; font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; word-break: break-word; direction: ltr; box-sizing: border-box;">\
                                            <p class="text-center" style="text-align: center; margin: 0px; padding: 0px;">' +
        form[3].value +
        '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;\
                                            </p>\
                                          </td>\
                                        </tr>\
                                      </tbody>\
                                    </table>\
                                  </div>\
                                  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->\
                                </td>\
                              </tr>\
                              <tr>\
                                <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">\
                                  <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->\
                                  <div class="layer_2" style="max-width: 596px; display: inline-block; vertical-align: top; width: 100%;">\
                                    <table border="0" cellspacing="0" cellpadding="0" class="edcontent" style="border-collapse: collapse;width:100%">\
                                      <tbody>\
                                        <tr>\
                                          <td valign="top" class="emptycell" style="padding: 10px;">\
                                          </td>\
                                        </tr>\
                                      </tbody>\
                                    </table>\
                                  </div>\
                                  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->\
                                </td>\
                              </tr>\
                              <tr>\
                                <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">\
                                  <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->\
                                  <div class="layer_2" style="max-width: 596px; display: inline-block; vertical-align: top; width: 100%;">\
                                    <table border="0" cellspacing="0" cellpadding="0" class="edcontent" style="border-collapse: collapse;width:100%">\
                                      <tbody>\
                                        <tr>\
                                          <td valign="top" class="emptycell" style="padding: 10px;">\
                                          </td>\
                                        </tr>\
                                      </tbody>\
                                    </table>\
                                  </div>\
                                  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->\
                                </td>\
                              </tr>\
                              <tr>\
                                <td class="drow" valign="top" align="center" style="background-color: #ffffff; box-sizing: border-box; font-size: 0px; text-align: center;">\
                                  <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->\
                                  <div class="layer_2" style="max-width: 596px; display: inline-block; vertical-align: top; width: 100%;">\
                                    <table border="0" cellspacing="0" cellpadding="0" class="edcontent" style="border-collapse: collapse;width:100%">\
                                      <tbody>\
                                        <tr>\
                                          <td valign="top" class="edimg" style="padding: 0px; box-sizing: border-box; text-align: center;">\
                                            <img src="https://api.elasticemail.com/userfile/49540e0f-2e09-4101-a05d-5032842b99d3/template-enhancements-4.jpg" alt="Image" width="596" style="border-width: 0px; border-style: none; max-width: 596px; width: 100%;">\
                                          </td>\
                                        </tr>\
                                      </tbody>\
                                    </table>\
                                  </div>\
                                  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->\
                                </td>\
                              </tr>\
                              <tr>\
                                <td class="drow" valign="top" align="center" style="background-color: #e4e6ec; box-sizing: border-box; font-size: 0px; text-align: center;">\
                                  <!--[if (gte mso 9)|(IE)]><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><![endif]-->\
                                  <div class="layer_2" style="max-width: 596px; display: inline-block; vertical-align: top; width: 100%;">\
                                    <table border="0" cellspacing="0" cellpadding="0" class="edcontent" style="border-collapse: collapse;width:100%">\
                                      <tbody>\
                                        <tr>\
                                          <td valign="top" class="emptycell" style="padding: 20px;">\
                                          </td>\
                                        </tr>\
                                      </tbody>\
                                    </table>\
                                  </div>\
                                  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->\
                                </td>\
                              </tr>\
                            </tbody>\
                          </table>\
                          <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->\
                        </td>\
                      </tr>\
                    </tbody>\
                  </table>\
                </body>\
              </html>',
    }).then((message) => {
       console.log(message);
      console.log(message == "OK") ;
      if(message == "OK"){
          alert("Thanks for Your Response!")
      }
      else if(message == "The specified string is not in the form required for an e-mail address."){
          alert("Invalid Email Address");
      }
    });
  }
}
