from pathlib import Path
from typing import BinaryIO

import pypdf


class PayslipProcessor:
    def __init__(self):
        self.payslip = None

    # Input payslip
    def read(self, payslip_file: BinaryIO):
        output = {}
        text = (pypdf.PdfReader(payslip_file).pages[0].extract_text()).splitlines()
        for line_num, line in enumerate(text, start=1):
            clean_line = line.strip()
            if clean_line:
                cur_arr = clean_line.split(" ")
                cur_value = 0
                cur_title = ""
                for item in cur_arr:
                    if has_numbers(item):
                        cur_value = item
                    else:
                        cur_title += item
                output[cur_title] = cur_value
        return process_output_dict(output)


def process_output_dict(items):
    return {
        "gross_salary": items["Salary"],
        "pension_contribution": items["Salarysacrifice"],
        "paye_tax": items["PAYETax"],
        "ni_tax": items["NationalInsurance"],
        "student_loan": items["StudentLoan"],
    }


def has_numbers(inputString):
    return any(char.isdigit() for char in inputString)


# init = PayslipProcessor()
payslip = (
    Path(__file__).resolve().parent.parent
    / ".tmp"
    / "Payslip Eimantas Zalkauskas - 30_09_2026.pdf"
)
# output = init.read(str(payslip))
# print(output)
