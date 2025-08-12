# Standing Data and Calculation Specifications

## Input Data / Standing Data Requirements

### App Administrator / Owner's Domain
- Name / Business Name
- Address
- Contact Number
- Email Address
- Website Address
- Business Logo
- Bank name
- Bank Account Number
- Bank Clearing Code

### Advisor Details (within App Owner's Domain)
- Initials
- Surname
- City
- Province
- Country
- Contact number
- Email Address
- Website Address
- Date Registered
- Current Status
- Registration Expiry Date
- Multiple advisors accommodation

### Advisor's Domain
- Name
- Surname
- Qualification
- Professional Body Membership Number
- Address
- Country Selected for Retirement Financial Forecasting
- Email Address
- Contact Number
- Website address
- Business Logo
- Bank name
- Bank Account Number
- Bank Clearing Code

### Client Data (within Advisor's Domain)
- Multiple individuals accommodation
- Principal Individual details
- Spouse details
- Currency Symbol (R)
- Plan Start Date (Month & Year)
- Retirement plan type (Individual or Combined Estate)

## Revenue, Expenses and Bank/Investment Fund Transfers

### Income Assumptions
Non-Investment Fund Income Streams:
- Description
- Applicable Bank Account (Primary Personal, Personal or Business)
- Start Year (1 to 25)
- Start month (1 to 12)
- Starting Amount (Rand)
- End year (1 to 25)
- End month (1 to 12)
- Regularity (monthly, bi-monthly, quarterly, every 4th month, bi-annually)
- Annual Inflation Rate %
- Adjusted Monthly Inflation Rate % (calculated to reflect monthly rate that when compounded equals Annual Growth Rate)
- Standard deviation for inflation rate over past 25 years (searched and calculated by app)
- Transaction Taxable (Yes or No)

### Bank Transfers
- Incoming transfers to Primary Personal Bank Account from other accounts when exceeding maximum balance
- Outgoing transfers from Primary Personal Bank Account to other accounts when falling below minimum balance

### Bank Payments/Transfers to Investment Funds
- Description
- Applicable Investment Account
- Start Year (1 to 25)
- Start month (1 to 12)
- Transfer Amount (Rand)
- End year (1 to 25)
- End month (1 to 12)
- Regularity (monthly, bi-monthly, quarterly, every 4th month, bi-annually)

### Asset Rentals, Asset Sale Proceeds and Acquisition Costs
- Rental income reflected in Primary Personal Bank Account for rented assets
- Rental income escalation annually by inflation rate
- Sale proceeds reflected as income in Primary Personal Bank Account
- Acquisition costs reflected as expenditure in Primary Personal Bank Account

### System Bank Clearing Account Transfers
- Centralized system-generated account for managing transfers between bank accounts and investments
- Calculations based on net shortfall or excesses of Primary Personal Bank account
- Incoming and outgoing transfers based on monthly cash shortfalls or excesses

## Expense Assumptions
- Description
- Applicable Bank Account (Personal or Business)
- Category (Fixed, Discretionary)
- Start Year (1 to 25)
- Start month (1 to 12)
- Starting Amount (Rand)
- End year (1 to 25)
- End month (1 to 12)
- Regularity (monthly, bi-monthly, quarterly, every 4th month, bi-annually)
- Annual Inflation Rate %
- Adjusted Monthly Inflation Rate % (calculated to reflect monthly rate that when compounded equals Annual Growth Rate)
- Standard deviation for inflation rate over past 25 years (searched and calculated by app)
- Transaction Tax Deductible (Yes or No)

## Balance Sheet Components

### Liquid Assets - Transactional Bank Accounts
- Description
- Applicable Bank Account (Primary Personal, Other Personal or Business)
- Start Year (1 to 25)
- Start month (1 to 12)
- Starting Balance (Rand)
- End Year (1 to 25) - triggers transfer of balance to Primary Personal Bank Account
- End month (1 to 12)
- Minimum Balance (triggers transfer from Primary Personal Bank Account)
- Maximum Balance (triggers transfer to Primary Personal Bank Account)
- Applicable Growth Rate Variable (e.g., bank interest rate%)
- Standard deviation for country's prime interest rate over past 25 years (searched and calculated by app)
- Interest Taxable (Yes or No)
- Monthly fees (%)

### System Bank Clearing Account
- System-generated account for managing all transfers between bank accounts and investment accounts

### Bank Investment Accounts
- Description (Bank & Account type)
- Applicable Bank Account (account reference number)
- Start Year (1 to 25)
- Start month (1 to 12)
- Starting Balance (Rand)
- Annual Growth Rate (e.g., interest rate %)
- Standard deviation for country's prime interest rate over past 25 years (searched and calculated by app)
- Adjusted Monthly Growth Rate % (calculated to reflect monthly rate that when compounded equals Annual Growth Rate)
- Monthly fees (%)
- Drawdown order relative to other investment sources (1st, 2nd, etc.)
- Drawdown parameter (% or Amount)
- Minimum Balance (after which no further withdrawals, triggers transfer to Primary Personal Bank Account)
- Drawdowns Tax status (Taxable or Not Taxable)
- Drawdown Tax Withheld %

### Investment Funds
- Description (Fund Name)
- Fund Type (Retirement Annuity, Investment Fund, etc.)
- Start Year (1 to 25)
- Start month (1 to 12)
- Starting Balance (Rand)
- Starting Drawdown (Amount or %) until overridden by calculated income shortfalls
- Annual Growth Rate % (Gross)
- Adjusted Monthly Growth Rate % (calculated to reflect monthly rate that when compounded equals Annual Growth Rate)
- Standard deviation for investment (0 if searched and calculated by app)
- Monthly fees (%)
- Drawdown order, relative to other investment sources (1st, 2nd, etc)
- Drawdown parameter (% of fund balance or fixed amount)
- Minimum balance (after which no further withdrawals, triggers transfer to Primary Personal Bank Account)
- Disbursements/Drawdowns tax status (Taxable or Not Taxable)
- Monthly disbursement proceeds net of tax (Yes or No)

### Primary Investment Fund
- Last fund to be drawn down from
- Same data structure as Investment Funds

## Cash Flow Calculation Methodology

### Income Calculation Logic
- Place starting amount in specified year and month
- Repeat according to chosen frequency until end dates
- Increase amount annually from first month of each new year
- End revenue item in end year and end month

### Expenses Calculation Logic
- Place starting amount in specified year and month
- Repeat according to chosen frequency until end dates
- Increase amount annually from first month of each new year
- End expense item in end year and end month

### Transfers to Primary Personal Bank Account
- Triggered when Primary Personal Bank Account becomes negative
- Transfer amount rounded up to nearest R10,000 from System Bank Clearing Account
- System Bank Clearing Account withdraws from investment accounts based on drawdown order and minimum balances

### Taxable Drawdowns
- Drawdown amount increased by multiplying by one divided by Drawdown Tax Withheld %
- Net amount after tax transferred to System Bank Clearing Account
- Tax withheld transferred to "Tax-Paid-In-Advance" debtors account

### Insufficient Funds Handling
- If remaining balance < drawdown amount, transfer balance on hand
- Balance of drawdown amount made from next investment account on drawdown list
- If insufficient funds in any investment accounts, System Bank Clearing Account becomes negative

## Investment Account and Fund Computations

### Growth Calculations
- Individual investments start on start date and grow monthly at "Adjusted monthly growth rate"
- Adjusted monthly growth rate calculated to compound to annual growth rate
- Monthly drawdowns generated from System Clearing Account

### Professional Investment Management Features
- **Portfolio Optimization**
  - Modern Portfolio Theory (MPT) implementation
  - Risk-return optimization algorithms
  - Asset allocation rebalancing triggers
  - Correlation analysis between asset classes
- **Advanced Withdrawal Strategies**
  - Dynamic spending rule calculations
  - Floor and ceiling spending limits
  - Inflation-adjusted withdrawal rates
  - Sequence of returns risk management
- **Tax-Loss Harvesting**
  - Automated loss identification
  - Wash sale rule compliance
  - Tax-efficient transaction timing
  - Capital gains optimization

## Taxation

### Enhanced Tax Planning Features
- **Multi-Jurisdictional Tax Optimization**
  - Double taxation agreement integration
  - Tax treaty benefit calculations
  - Withholding tax optimization
  - Cross-border tax planning
- **Advanced Tax Strategies**
  - Tax-deferred growth maximization
  - Taxable account ordering strategies
  - Roth conversion optimization
  - Asset location strategies

### Tax Agent Requirements
- Chartered accountant and income tax specialist from relevant country
- Uses country's tax authorities' income tax tables and computation methodologies
- Includes capital gains tax tables and computation methodologies

### Tax Table Adjustments
- Tax tables as at Start Date adjusted by inflation rate for future years
- Methodologies remain same for full forecast period

### Annual Tax Calculation
- Computed in month of country's tax year-end each year
- Based on taxable income and tax-deductible expenditure
- Capital gains tax from asset sales during tax year
- Reflected as Tax Creditor (if tax payable) or Tax-Paid-in-Advance Debtor (if refund due)

### Tax Settlement
- Settled 6 months after tax year end each year
- Reflected in Primary Personal Bank Account as Tax Paid or Tax Refund
- Balance sheet tax accounts adjusted by these bank transactions

## Fixed Assets

### Houses and Properties
- Description (Asset Name)
- Asset Type (Primary House, Other House, Property, Motor Vehicle, etc.)
- Rented to Third Parties? (Yes or No)
- Start Year (1 to 25)
- Start month (1 to 12)
- Starting Balance (Rand)
- Original Cost Price plus Improvements at Start Date (for capital gains tax calculation)
- Annual Growth Rate % (Depreciation reflected as negative)
- Adjusted Monthly Growth Rate % (calculated to reflect monthly rate that when compounded equals Annual Growth Rate)
- Planned Sale Date – Year (26 if asset not planned to be sold)
- Planned Sale Date – Month (0 if asset not planned to be sold)
- Sale Proceeds % (% of valuation at date of sale)
- Automatic Sale Trigger Value (Value of Primary Investment Fund when sale should occur)
- Replacement Flag ("1" if replacement house will be rented, "0" if replacement house to be bought)
- Third Party Financing (Yes or No)
- Replacement Value % (multiplied by sales value for cost price of new house)
- Monthly Rental Value at Start Date (current market-related rental)
- Rental %. (percentage applied for replacement rental calculation)

### Enhanced Asset Management Features
- **Asset Class Categorization**
  - Residential Real Estate
  - Commercial Real Estate
  - Investment Properties
  - Personal Use Assets
  - Business Assets
  - Collectibles and Alternative Investments
- **Advanced Depreciation Methods**
  - Straight-line depreciation
  - Declining balance depreciation
  - Sum-of-years-digits depreciation
  - Units of production depreciation
  - Custom depreciation schedules
- **Asset Performance Tracking**
  - Historical performance data integration
  - Market index correlation analysis
  - Risk-adjusted return calculations
  - Asset allocation optimization
- **Insurance and Maintenance**
  - Insurance premium calculations
  - Maintenance cost projections
  - Replacement reserve calculations
  - Total cost of ownership analysis

### Motor Vehicles
- Description (Asset Name)
- Asset Type (House, Property, Motor Vehicle, etc.)
- Start Year (1 to 25)
- Start month (1 to 12)
- Start Value
- Annual Growth Rate % (reflected as negative depreciation rate)
- Adjusted Monthly Growth Rate % (calculated to reflect monthly rate that when compounded equals Annual Growth Rate)
- Planned Sale Date – Year (26 if asset not planned to be sold)
- Planned Sale Date – Month (0 if asset not planned to be sold)
- Sale Proceeds % (of valuation at date of sale)
- Replacement Flag (1 if replacement vehicle will be acquired, 0 if no replacement)
- Replacement Value % (multiplied by sales value for cost price of new vehicle)
- Third Party Financing (Yes or No)

### Other Assets
- Description (Asset Name)
- Asset Type (House, Property, Motor Vehicle, Bitcoin, Jewellery, etc.)
- Start Year (1 to 25)
- Start month (1 to 12)
- Start Value
- Original Cost as of Start Date
- Growth Rate % (reflected as negative)
- Adjusted Monthly Growth Rate % (calculated to reflect monthly rate that when compounded equals Annual Growth Rate)
- Planned Sale Date – Year (26 if asset not planned to be sold)
- Planned Sale Date – Month (0 if asset not planned to be sold)
- Sale Proceeds % (of valuation at date of sale)
- Sale subject to withholding tax (Yes or No)
- Replacement Flag ("1" if replacement asset will be acquired, "0" if no replacement)
- Replacement Value % (multiplied by sales value for cost price of new asset)
- Third Party Financing (Yes or No)

## Fixed Asset Computations

### Primary House
- Reflected from start date at starting value
- Grows/reduces by Adjusted Monthly Growth Rate (compounded to Annual Growth Rate)
- Sold and disposed according to sales date and calculation (value at sale date × Sales Proceeds %)
- Proceeds reflected in Primary Personal Bank Account in sale month
- If replaced with another house, cost calculated by multiplying valuation by Replacement Value %
- If Third-Party Financing "No", cost price reflected in Primary Personal Bank Account as expense
- If Third-Party Financing "Yes", standing data for new Mortgage Bond required
- If replaced with rented house, rental expense calculated by multiplying rental value by Rental %

### Houses and Properties (excluding Primary House)
- Reflected from start date at starting value
- Grows/reduces by Adjusted Monthly Growth Rate (compounded to Annual Growth Rate)
- Sold and disposed according to sales date and calculation (value at sale date × Sales Proceeds %)
- Proceeds reflected in Primary Personal Bank Account in sale month
- If replaced, cost calculated by multiplying sold asset's valuation by Replacement Value %
- If Third-Party Financing "No", cost price reflected in Primary Personal Bank Account as expense
- If Third-Party Financing "Yes", standing data for new Mortgage Bond required
- If "Rented to Third Parties" marked "Yes", rental income reflected as income from start month
- Rental income escalated annually by inflation rate, ceases in sale month

### Motor Vehicles
- Reflected from start date at starting value
- Grows/reduces by Adjusted Monthly Growth Rate (compounded to Annual Growth Rate)
- Sold and disposed according to sales date and calculation (value at sale date × Sales Proceeds %)
- Proceeds reflected in Primary Personal Bank Account in sale month
- If Third-Party Financing "No", cost price reflected in Primary Personal Bank Account as expense
- If Third-Party Financing "Yes", standing data for Hire Purchase Loan required

### Other Assets
- Reflected from start date at starting value
- Grows/reduces by Adjusted Monthly Growth Rate (compounded to Annual Growth Rate)
- Sold and disposed according to sales date and calculation (value at sale date × Sales Proceeds %)
- Proceeds reflected in Primary Personal Bank Account in sale month
- If Third-Party Financing "No", cost price reflected in Primary Personal Bank Account as expense
- If Third-Party Financing "Yes", standing data for Hire Purchase Loan required

## Liabilities

### Enhanced Mortgage Bonds and HP Agreements
- Description (Name)
- Liability Type (Mortgage Bond, Personal Loan, Hire Purchase Agreement, etc.)
- Start Year (1 to 25)
- Start month (1 to 12)
- Start Value (calculated based on original loan amount, start date, term, interest rate)
- Original Loan Amount
- Loan Start Year (e.g., 2020)
- Loan Start Month (1 to 12)
- Loan Interest Rate %
- Adjusted Monthly Interest Rate % (calculated to reflect monthly rate that when compounded equals Annual Interest Rate)
- Standard deviation for country's prime interest rate (searched and calculated by app)
- Final Payment Amount (if final payment is bullet payment)
- Term of Loan (months)

### Advanced Mortgage Features
- **Mortgage Type Classification**
  - Fixed Rate Mortgages
  - Variable Rate Mortgages
  - Adjustable Rate Mortgages (ARM)
  - Interest-Only Mortgages
  - Balloon Payment Mortgages
- **Payment Structure Options**
  - Equal Monthly Installments (EMI)
  - Graduated Payment Mortgages
  - Bi-weekly Payment Schedules
  - Custom Payment Frequencies
- **Mortgage Insurance**
  - Private Mortgage Insurance (PMI)
  - Mortgage Life Insurance
  - Disability Insurance Integration
  - Premium Calculation and Tracking
- **Escrow Account Management**
  - Property Tax Escrow Calculations
  - Home Insurance Escrow Management
  - HOA Fees and Other Escrow Items
  - Annual Escrow Analysis
- **Prepayment and Refinancing**
  - Prepayment Penalty Calculations
  - Refinancing Break-even Analysis
  - Interest Rate Comparison Tools
  - Cash-out Refinancing Scenarios

### Other Loans
- Description (Name)
- Liability Type (Mortgage Bond, Personal Loan, Hire Purchase Agreement, etc.)
- Start Year (1 to 25)
- Start month (1 to 12)
- Start Value
- Original Loan Amount
- Loan Start Year (e.g., 2020)
- Loan Start Month (1 to 12)
- Loan Interest Rate %
- Adjusted Monthly Interest Rate % (calculated to reflect monthly rate that when compounded equals Annual Interest Rate)
- Monthly Payments
- Term of Loan (months)

## Liability Computations

### Mortgage Bonds and Hire Purchase Agreements
- Start Value calculated from Original Loan Amount, Start Year/Month, Term, Interest Rate
- Full monthly payments deducted from Primary Personal Bank Account as expense
- Different expense types reflected separately
- New mortgage bonds/HP agreements triggered by asset module
- Standing data for new liability requested by app when triggered

### Professional Financial Planning Enhancements
- **Cash Flow Optimization**
  - Automated cash flow smoothing algorithms
  - Tax-efficient withdrawal strategies
  - Emergency fund optimization
  - Seasonal income adjustment calculations
- **Retirement Income Strategies**
  - Annuity integration and optimization
  - Social Security claiming strategies
  - Pension optimization calculations
  - Required Minimum Distribution (RMD) planning
- **Estate Planning Integration**
  - Wealth transfer calculations
  - Estate tax optimization
  - Trust structure modeling
  - Beneficiary allocation optimization
- **Risk Management Features**
  - Insurance needs analysis
  - Long-term care cost projections
  - Disability income replacement calculations
  - Critical illness coverage optimization

## Advanced Financial Planning Features

### Comprehensive Mortgage Management
- **Multi-Scenario Mortgage Analysis**
  - Best-case, realistic, and worst-case interest rate scenarios
  - Refinancing opportunity identification and timing
  - Payment shock analysis for variable rate mortgages
  - Negative equity risk assessment
- **Mortgage Stress Testing**
  - Interest rate shock scenarios (+2%, +5% rate changes)
  - Income disruption impact analysis
  - Property value decline scenarios
  - Combined mortgage and investment portfolio stress testing

### Advanced Asset Management
- **Real Estate Investment Analysis**
  - Rental property cash flow optimization
  - Property flipping vs. rental holding strategies
  - Real estate investment trust (REIT) integration
  - Property tax optimization strategies
- **Business Asset Integration**
  - Business succession planning calculations
  - Business sale timing optimization
  - Business asset transfer tax implications
  - Business asset depreciation optimization

### Professional-Grade Risk Assessment
- **Sequence of Returns Risk**
  - Historical scenario analysis (1929, 1973, 2000, 2008)
  - Custom scenario creation and testing
  - Withdrawal rate optimization based on market conditions
  - Dynamic portfolio adjustment strategies
- **Longevity Risk Management**
  - Mortality table integration (multiple actuarial tables)
  - Joint life expectancy calculations
  - Survivor benefit optimization
  - Longevity insurance integration

## Monte Carlo Simulations / Sensitivity Analyses

### Individual Monte Carlo Simulations
- Inflation Rate changes impact
- Interest Rate changes impact (on investments and liabilities)
- Investment Growth Rate changes impact
- Asset Growth Rate changes impact (houses and other properties)
- Cover each month of full forecast period
- 10,000 iterations per simulation

### Post-Simulation Analysis
- Summarize with percentiles (10th, 50th, 90th)
- Show probabilities of outcomes:
  - Running out of money at each 60-month interval
  - Other important outcomes suggested by app

### Professional Reporting and Analysis Features
- **Custom Scenario Comparison**
  - Side-by-side scenario analysis
  - Impact measurement tools
  - Recommendation generation algorithms
- **Regulatory Compliance Features**
  - Fiduciary duty compliance tracking
  - Disclosure requirement automation
  - Best interest standard implementation
  - Suitability assessment tools

## Reporting Requirements

### Advisor Reports
- Table of available reports with selection prompt
- Report headings containing advisor name, logo, client name, report name, reporting period
- Left-aligned descriptions within categories
- Years/months reflected in report headings

### Required Reports Structure
1. Retirement Financial Forecast Report
   - Benefits of Financial Planning for Retirement
   - Introduction
   - Starting Position and Key Assumptions
   - Management & Funding of Lifestyle Costs
   - Summary of Net Wealth
   - Summary of Liquid Assets
   - Summary of Fixed Assets
   - Summary of Liabilities
   - Risk Analysis
   - Monte Carlo Simulations
   - Sensitivity Analysis – Pessimistic, Realistic, and Optimistic Scenarios
   - Sensitivity Analysis – Influence of Individual Rate Changes
   - Long-Term Forecasting – Risks & Shortfalls
   - Recommendations
   - Conclusion
   - Annexures - Detailed Analyses & Commentaries

2. Total Net Wealth Reports
   - Annual Summarized Report
   - Annual Detailed Report
   - Monthly Summarized Report
   - Monthly Detailed Report

3. Bank Account Reports
   - Annual Detailed Cash Book Report
   - Monthly Detailed Cash Book Report

4. Investment Reports
   - Annual Detailed Investment Report
   - Monthly Detailed Investment Report

5. Asset Reports
   - Annual Detailed Asset Report
   - Monthly Detailed Asset Report

6. Liabilities Reports
   - Annual Detailed Liability Report
   - Monthly Detailed Liability Report

7. Taxation Reports
   - Annual Detailed Taxation Report

8. Audit Reports
   - Annual and monthly reconciliation reports

9. Standing Data Reports
   - Client details
   - Bank accounts
   - Investments
   - Assets
   - Liabilities
   - Tax calculation data

10. Sensitivity Analysis Reports
    - Monte Carlo Simulations
    - Pessimistic, Realistic, and Optimistic Scenarios
    - Individual Rate Change Influence Analysis

### Download and Visualization Options
- Excel, Word, and PDF export options
- Visual display on wide-screen computers
- Enhanced graphical displays for trend identification
- Key milestone highlighting
- Required action point identification

### Advisor Business Management Reports
- Client List (all clients, active clients, new enquiries)
- Monthly and annual financial reports of completed forecasts
- Productivity Reports on completions and turnaround times

### App Owner Reports
- Management Reports (by country)
- Advisor List (all advisors, active advisors, new enquiries)
- Monthly and annual reports of new, renewed, due for renewal, and expired advisors
- Monthly and annual financial reports of new and renewed advisor registrations
- Productivity Reports on additions, renewals, and expiries
