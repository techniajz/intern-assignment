const {
    models: { Calendar, Attendance, Employee, Salaries, LeadTimeline, Lead },
} = require('../../../../lib/models');
const moment = require('moment');
const pdf = require('html-pdf-node');
class SalaryController {
    async calculateSalary(req, res, next) {
        try {
            let { empId, year, month } = req.query;
            const formattedYearMonth = `${year}${month.toString().padStart(2, '0')}`;
            let holidays = await Calendar.find({
                date_: { $gte: parseInt(`${formattedYearMonth}01`), $lte: parseInt(`${formattedYearMonth}31`) },
            }).count();
            let employee_attendance = await Attendance.find({
                $and: [
                    { empId: ObjectId(empId) },
                    {
                        attDate: {
                            $gte: parseInt(`${formattedYearMonth}01`),
                            $lte: parseInt(`${formattedYearMonth}31`),
                        },
                    },
                ],
            });
            let currentSalary = await Employee.findOne({ _id: ObjectId(empId) }).select('name current_salary');
            function countSundaysAndTotalDays(year, month) {
                const firstDayOfMonth = new Date(year, month - 1, 1);
                const lastDayOfMonth = new Date(year, month, 0);
                let totalDays = lastDayOfMonth.getDate();
                let countSundays = 0;
                for (let day = 1; day <= totalDays; day++) {
                    const currentDate = new Date(year, month - 1, day);
                    if (currentDate.getDay() === 0) {
                        countSundays++;
                    }
                }
                return { totalDays, countSundays };
            }
            const { totalDays, countSundays } = countSundaysAndTotalDays(year, month);
            const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
            //console.log(`${monthName} ${year} has ${countSundays} Sundays out of ${totalDays} total days.`);
            let per_day_salary = Number(currentSalary.current_salary) / totalDays;

            function calculateHoursDifference(punchInTime, punchOutTime) {
                const punchInHour = parseInt(punchInTime.substring(0, 2));
                const punchInMinute = parseInt(punchInTime.substring(2, 4));
                const punchInSecond = parseInt(punchInTime.substring(4, 6));
                const punchOutHour = parseInt(punchOutTime.substring(0, 2));
                const punchOutMinute = parseInt(punchOutTime.substring(2, 4));
                const punchOutSecond = parseInt(punchOutTime.substring(4, 6));
                const punchInDate = new Date(0, 0, 0, punchInHour, punchInMinute, punchInSecond);
                const punchOutDate = new Date(0, 0, 0, punchOutHour, punchOutMinute, punchOutSecond);
                let timeDifferenceMs = punchOutDate - punchInDate;
                return timeDifferenceMs / (1000 * 60 * 60);
            }
            let credit_salaryy = 0;
            let let_diduction_salaryy = 0;
            let employee_attendance_count = 0;
            for (let i = 0; i < employee_attendance.length; i++) {
                const { punchInTime, punchOutTime } = employee_attendance[i];
                const hoursWorked = calculateHoursDifference(punchInTime.toString(), punchOutTime.toString());
                const fullWorkHours = 8;
                const workedPercentage = hoursWorked / fullWorkHours;
                if (workedPercentage < 0.5) {
                    credit_salaryy += per_day_salary - per_day_salary * 0.5;
                    let_diduction_salaryy += per_day_salary * 0.5;
                    employee_attendance_count += 1;
                } else {
                    credit_salaryy += per_day_salary;
                    employee_attendance_count += 1;
                }
            }
            let credited_salary = credit_salaryy + (holidays + countSundays) * per_day_salary;
            let leaves = totalDays - (holidays + countSundays + employee_attendance_count);
            let leave_diduction_salary = leaves * per_day_salary;

            const totalDiducation = let_diduction_salaryy + leave_diduction_salary;
            let salaryObject = {
                employee_id: empId,
                total_salary: currentSalary.current_salary,
                number_of_total_working_day: totalDays,
                employee_working_days: employee_attendance_count,
                credited_salary: credited_salary.toFixed(2),
                diductions: totalDiducation.toFixed(2),
                week_off_days: countSundays,
                leaves: leaves,
                holidays: holidays,
                year: year,
                month: month,
            };
            let salaryData = await Salaries(salaryObject).save();
            return res.success(
                {
                    salaryData,
                },
                'salary updated successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async leadClose_addIncentive(req, res, next) {
        try {
            let { leadId, employee } = req.body;
            await Lead.updateMany(
                { _id: ObjectId(leadId) },
                {
                    $set: {
                        leadStatus: 3,
                    },
                }
            );
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            if (employee.length > 0) {
                employee.map(async emp => {
                    let incentiveSalary = {
                        employee_id: emp.empId,
                        incentives: emp.incentiveAmount,
                        year: currentYear,
                        month: currentMonth,
                        salaryType: 'incentive',
                        leadId: leadId,
                    };
                    await new Salaries(incentiveSalary).save();
                });
            }
            let date = moment(currentDate);
            let formattedDate = date.format('YYYYMMDDHHmm');
            let closeLead = {
                LeadId: leadId,
                senderId: req.user._id,
                remark: '6595505219f710422ba9fc3e', //close lead
                leadDate: formattedDate,
            };
            await new LeadTimeline(closeLead).save();
            return res.success({}, 'Lead close and add incentive amount');
        } catch (err) {
            return next(err);
        }
    }
    async salaryList(req, res, next) {
        try {
            let { empId } = req.query;
            let salaryList = await Salaries.find({ employee_id: ObjectId(empId) });
            const groupByYearAndMonth = salaryList => {
                const groupedByYearAndMonth = {};
                for (const salary of salaryList) {
                    const { year, month } = salary;
                    const key = `${year}-${month}`;
                    if (!groupedByYearAndMonth[key]) {
                        groupedByYearAndMonth[key] = [];
                    }
                    groupedByYearAndMonth[key].push(salary);
                }
                return groupedByYearAndMonth;
            };
            const groupedSalaries = groupByYearAndMonth(salaryList);
            return res.success(
                {
                    groupedSalaries,
                },
                'Find salary list successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async advancedSalaries(req, res, next) {
        try {
            let { employeeId, payment, type, comment } = req.body;
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            let checkAdvance = await Salaries.findOne({
                employee_id: ObjectId(employeeId),
                year: currentYear,
                month: currentMonth,
                salaryType: 'advance',
            });
            // if (type == 'remove') {
            //     if (checkAdvance && checkAdvance.advace >= Number(payment)) {
            //         checkAdvance.advace = checkAdvance.advace - Number(payment);
            //         let removePayment = await checkAdvance.save();
            //         return res.success({
            //             removePayment,
            //         });
            //     } else {
            //         return res.warn({}, 'This employee have not advance payment');
            //     }
            // }
            if (type == 'add') {
                if (checkAdvance) {
                    (checkAdvance.employee_id = employeeId),
                        (checkAdvance.advace = checkAdvance.advace + Number(payment)),
                        (checkAdvance.year = currentYear),
                        (checkAdvance.month = currentMonth),
                        (checkAdvance.salaryType = 'advance'),
                        (checkAdvance.comment = comment);
                    let advanceData = await checkAdvance.save();
                    return res.success(
                        {
                            advanceData,
                        },
                        'Add payment successfully'
                    );
                } else {
                    let advanceSalary = {
                        employee_id: employeeId,
                        advace: Number(payment),
                        year: currentYear,
                        month: currentMonth,
                        salaryType: 'advance',
                        comment: comment,
                    };
                    let advanceData = await new Salaries(advanceSalary).save();
                    return res.success(
                        {
                            advanceData,
                        },
                        'Add payment successfully'
                    );
                }
            }
        } catch (err) {
            return next(err);
        }
    }
    async salarySlip(req, res, next) {
        try {
            let { employee_id, year, month } = req.query;
            let salarySlip = await Salaries.find({ employee_id, year, month });
            let employee = await Employee.findOne({ _id: employee_id });
            let jsonData = {
                name: employee.name,
                year: year,
                month: month,
                total_salary: 0,
                credited_salary: 0,
                diductions: 0,
                incentives: 0,
                advance: 0,
                leaves: 0,
            };
            salarySlip.map(salary => {
                if (salary.salaryType == 'salary') {
                    jsonData['total_salary'] = salary.total_salary ? salary.total_salary : 0;
                    jsonData['credited_salary'] = salary.credited_salary ? salary.credited_salary : 0;
                    jsonData['diductions'] = salary.diductions ? salary.diductions : 0;
                    jsonData['leaves'] = salary.leaves ? salary.leaves : 0;
                }
                if (salary.salaryType == 'incentive') {
                    jsonData['incentives'] = jsonData.incentives + salary.incentives;
                }
                if (salary.salaryType == 'advance') {
                    jsonData['advance'] = salary.advace ? salary.advace : 0;
                }
            });
            let totaleSalary_ = jsonData.credited_salary + jsonData.incentives + jsonData.advance;
            // HTML template with placeholders for JSON data
            const htmlTemplate = `
                <html>
                    <head>
                        <title>Generated PDF</title>
                        <style>
                        body {
                          font-family: Arial, sans-serif;
                        }
                      
                        .salary-slip {
                          margin: 20px;
                        }
                      
                        .empDetail {
                          width: 100%;
                          border-collapse: collapse;
                        }
                      
                        .empDetail th, .empDetail td {
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        }
                      
                        .empDetail th {
                          background-color: #f2f2f2;
                        }
                      
                        .companyName {
                          font-size: 18px;
                          font-weight: bold;
                        }
                      
                        .myBackground {
                          background-color: #f5f5f5;
                        }
                      
                        .myAlign {
                          text-align: right;
                        }
                      
                        .table-border-right {
                          border-right: 1px solid #ddd;
                        }
                      </style>
                    </head>
                    <body>
                    <div class="salary-slip">
                      <table class="empDetail">
                      <tr height="100px" style='margin-right:50px'>
                        <td colspan='4'>
                        <img height="90px" src='https://real-state-staging.s3.ap-south-1.amazonaws.com/image/1706529117784_WjNA0tDfbZQlx50njzBfZLDd.png' />
                        </td>
                        <td colspan='4' class="companyName"> Nirman Real State</td>
                    </tr>
                        <tr>
                          <th>
                            Name
                          </th>
                          <td>
                            {name}
                          </td>
                        </tr>
                        <tr>
                          <th>
                            Month
                          </th>
                          <td>
                            {month}
                          </td>
                        </tr>
                        <tr>
                          <th>
                            Year
                          </th>
                          <td>
                           {year}
                          </td>
                        </tr>
                        
                        <tr class="myBackground">
                          <th colspan="2">
                            Payments
                          </th>
                          <th class="table-border-right">
                            Amount (Rs.)
                          </th>
                        </tr>
                        <tr>
                          <th colspan="2">
                            Basic Salary
                          </th>
                          <td class="myAlign">
                            {total_salary}
                          </td>
                        </tr>
                        <tr>
                          <th colspan="2">
                            Credited Salary
                          </th>
                          <td class="myAlign">
                           {credited_salary}
                          </td>
                        </tr>
                        <tr>
                          <th colspan="2">
                            Incentives
                          </th>
                          <td class="myAlign">
                           {incentives}
                          </td>
                        </tr>
                        <tr>
                          <th colspan="2">
                            Advance
                          </th>
                          <td class="myAlign">
                         {advance}
                          </td>
                        </tr>
                        <tr>
                          <th colspan="2">
                          Diductions
                          </th>
                          <td class="myAlign">
                         {diductions}
                          </td>
                        </tr>
                        <tr>
                          <th colspan="2">
                          leaves
                          </th>
                          <td class="myAlign">
                         {leaves}
                          </td>
                        </tr>
                        <tr>
                          <th colspan="2">
                          Total Payments
                          </th>
                          <td class="myAlign">
                          {totaleSalary_}
                          </td>
                        </tr>
                        <tbody class="border-center">
                        </tbody>
                      </table>
                    </div>
                  </body>
                </html>
            `;
            const filledHtml = htmlTemplate
                .replace(/{name}/g, jsonData.name)
                .replace(/{year}/g, jsonData.year)
                .replace(/{month}/g, jsonData.month)
                .replace(/{total_salary}/g, jsonData.total_salary)
                .replace(/{credited_salary}/g, jsonData.credited_salary)
                .replace(/{diductions}/g, jsonData.diductions)
                .replace(/{incentives}/g, jsonData.incentives)
                .replace(/{advance}/g, jsonData.advance)
                .replace(/{leaves}/g, jsonData.leaves)
                .replace(/{totaleSalary_}/g, totaleSalary_);

            const options = { format: 'A4' };
            pdf.generatePdf({ content: filledHtml }, options)
                .then(pdfBuffer => {
                    const headers = {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment; filename=Salary slip-${month}/${year} .pdf`,
                    };
                    res.writeHead(200, headers);
                    res.end(pdfBuffer);

                })
                .catch(error => {
                    console.error('Error generating PDF:', error);
                    res.status(500).send('Internal Server Error');
                });
        } catch (err) {
            return next(err);
        }
    }
}

module.exports = new SalaryController();
