# 💸 Offline Financial Analyzer

## 🧭 Project Overview: The Financial Data Bridge

The **Offline Financial Analyzer** is a powerful two-part program designed to help users gain actionable insights into their spending habits **without relying on third-party financial services**.

The core idea is to bypass the complexity of unreliable browser-based PDF readers and browser security restrictions by using a **robust Python backend** for data processing.  
This backend extracts unstructured tabular data from local bank statement PDFs, cleans and categorizes the transactions (marking them as *Fixed*, *Not Fixed*, or *Income*), and transforms them into a standardized **JSON** format.

The resulting JSON file is then loaded into a **secure, fully offline HTML/JavaScript dashboard**, providing users with:
- Interactive charts  
- Filterable tables  
- Specialized **Gemini API** integration for AI-powered financial summaries and personalized budget tips.

---

## 🚀 Key Features

- **Offline Operation:** Runs entirely locally in the browser — no internet required.  
- **PDF Extraction:** Converts complex, single-column or dual-column transaction tables into structured data.  
- **Intelligent Categorization:** Automatically assigns transactions to categories (e.g., *Housing*, *Groceries*, *Subscriptions*) and types (*Fixed* vs. *Not Fixed*).  
- **AI Financial Insights:** Uses the **Gemini API** to analyze spending patterns and generate personalized budget recommendations.  

---

## 🧱 Technology Stack

The project utilizes a **split architecture** optimized for:
- **Reliability:** Python backend for data processing  
- **Portability:** HTML/JS frontend for visualization  

| **Component** | **Technology** | **Purpose** |
|----------------|----------------|--------------|
| **Data Processing (Backend)** | Python 3.x | Orchestration and execution environment |
| **PDF Extraction** | `pdfplumber` | Reads and extracts tabular data from PDF files |
| **Data Structures** | `pandas` *(Dependency)* | Efficient data manipulation and cleaning |
| **Data Transfer** | JSON | Transfers structured transaction data from Python to JS |
| **Dashboard (Frontend)** | HTML5 / JavaScript | Core structure and logic |
| **Styling** | Tailwind CSS *(via CDN)* | Modern, responsive UI design |
| **Visualization** | Chart.js *(via CDN)* | Elegant charting for financial graphics |
| **AI Analysis** | Gemini API | Generates intelligent spending summaries and budget tips |
---

 ## Key Dependencies
**Core Framework**
- React 19.2.0 - UI framework
- React Router DOM 7.9.4 - Navigation (configured but not actively used)
**Styling & UI**
- Tailwind CSS 3.4.18 - Utility-first CSS framework
- Lucide React 0.417.0 - Icon library
- Headless UI 2.2.9 - Unstyled UI components
**Data Visualization**
- Chart.js 4.5.1 - Charting library
- React Chart.js 2 5.3.0 - React wrapper for Chart.js
- Recharts 3.3.0 - Alternative charting library
**Development Tools**
- React Scripts 5.0.1 - Build tools
- PostCSS 8.5.6 - CSS processing
- Autoprefixer 10.4.21 - CSS vendor prefixes
---

## The application has two main parts:

   1. Data Processing (Python): A Python script named pdf_to_json_converter.py is responsible for reading a bank statement in PDF
      format (my_bank_statement.pdf). It extracts all transactions, cleans them up, and categorizes them based on a set of rules
      defined in a rules.json file (which is not present in the file listing, but the script is looking for it). The script then saves
      the processed data into a file named financial_data.json.

   2. Data Visualization (React): The React application, located in the src directory, serves as a dashboard. You can upload the
      financial_data.json file, and the application will display your financial data through various interactive charts and tables.
---

## 🧩 Simple Tutorial to Run the Program

Running this analyzer is a straightforward, **three-phase process**:
1. Prepare the data with Python  
2. Generate structured output  
3. Visualize results in the browser  

---

### ⚙️ Phase 1: Setup and Configuration

#### 1. Install Python
Ensure you have **Python 3.x** installed.  
👉 [Download it here](https://www.python.org/downloads/)

> 💡 **Tip for Windows:**  
> During installation, check the box that says **"Add Python to PATH"**.

#### 2. Install Dependencies
Open your **Command Line / Terminal / PowerShell** and install the required libraries:
```
pip install pandas pdfplumber
```

3. Run the Conversion
Place your bank statement PDF in the root folder of your project (the same folder as pdf_to_json_converter.py).

Rename your bank statement to my_bank_statement.pdf.

In your terminal, navigate to the project folder and run the script:
```
python pdf_to_json_converter.py
```
4. If successful, a new file named financial_data.json will be created in the same folder.

---

##🚀 Step 2: Run the React App
This is your main dashboard for visualizing the data.
1. Install App Dependencies (if you haven't already):
```
npm install
```
2. Run the App:
```
npm start
```