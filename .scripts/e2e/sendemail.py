import sendgrid
import os
import argparse
import xml.etree.ElementTree as ET
from sendgrid.helpers.mail import * 

parser = argparse.ArgumentParser()
parser.add_argument("resFile", help="test result file")
parser.add_argument("releaseVersion", help="sendgrid api key")
parser.add_argument("apiKey", help="sendgrid api key")
args = parser.parse_args()

emailSubject = "Release Pipeline Test Failure Report " + args.releaseVersion
root = ET.parse(args.resFile).getroot()
failure = root[0].get('failures')
total = root[0].get('tests')
failureCases = []
for child in root[0].findall(".//*[failure]"):
    failureCases.append(child.get('name'))
separator = '\n'
emailContent = "Failure/Total : " + failure + "/" + total + "\nFailure Cases:\n" + separator.join(failureCases)
print(emailSubject)
print(emailContent)

if (int(failure) > 0):
    sg = sendgrid.SendGridAPIClient(api_key=args.apiKey)
    from_email = Email("amecodegen@outlook.com")
    to_email = To("lianw@microsoft.com")
    subject = emailSubject
    content = Content("text/plain", emailContent)
    mail = Mail(from_email, to_email, subject, content)
    response = sg.client.mail.send.post(request_body=mail.get())
    print(response.status_code)
    print(response.body)
    print(response.headers)
