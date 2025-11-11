import json
import pdfplumber
import re
from datetime import datetime

# --- 1. Rule loading function ---
def load_categorization_rules(rules_path):
    """
    Loads categorization rules from an external JSON file.
    """
    print(f"Loading categorization rules from: {rules_path}")
    try:
        with open(rules_path, 'r') as f:
            rules = json.load(f)
        
        # Pre-compile regex for expense keywords for efficiency
        # We process them once here instead of in the loop
        processed_expense_rules = []
        for rule in rules.get("expense_rules", []):
            # We remove spaces from keyword for better matching
            rule['regex'] = re.compile(re.sub(r'\s+', '', rule['keyword']), re.IGNORECASE)
            processed_expense_rules.append(rule)
        
        rules["expense_rules"] = processed_expense_rules
        
        print(f"Successfully loaded {len(rules.get('income_rules', []))} income rules and {len(rules.get('expense_rules', []))} expense rules.")
        return rules
    except FileNotFoundError:
        print(f"❌ ERROR: Rules file not found at '{rules_path}'. Using no rules.")
        return {"income_rules": [], "expense_rules": []}
    except json.JSONDecodeError:
        print(f"❌ ERROR: Rules file '{rules_path}' is not valid JSON. Using no rules.")
        return {"income_rules": [], "expense_rules": []}
    except Exception as e:
        print(f"❌ CRITICAL ERROR loading rules: {e}. Using no rules.")
        return {"income_rules": [], "expense_rules": []}

def clean_amount_string(amount_str):
    """
    Cleans the amount string by removing currency symbols and handling various
    negative sign notations.
    """
    if not isinstance(amount_str, str):
        return 0.0
    
    cleaned_str = amount_str.replace('$', '').replace(',', '').strip()
    
    if cleaned_str.endswith('-'):
        cleaned_str = '-' + cleaned_str[:-1]
        
    try:
        return float(cleaned_str)
    except (ValueError, TypeError):
        return 0.0

# --- 2. UPDATED: Categorize function now uses loaded rules ---
def categorize_transaction(details_str, rules, is_income):
    """
    Categorizes a transaction based on loaded rules.
    Returns a tuple of (category, type).
    """
    details_upper = details_str.upper()
    
    if is_income:
        # --- Loop through INCOME rules ---
        for rule in rules.get("income_rules", []):
            if rule['keyword'].upper() in details_upper:
                return rule['category'], rule['type']
        # Default for un-matched income
        return "Income", "Income"
    else:
        # --- Loop through EXPENSE rules ---
        details_no_spaces = re.sub(r'\s+', '', details_upper)
        for rule in rules.get("expense_rules", []):
            if rule['regex'].search(details_no_spaces):
                return rule['category'], rule['type']
        # Default for un-matched expenses
        return "Other Expense", "Not Fixed"


# --- 3. UPDATED: extract_data function now accepts rules ---
def extract_data_from_pdf(pdf_path, rules):
    """
    CORE FUNCTION: Reads the PDF, extracts transactions, cleans details, 
    and categorizes them using the loaded rules.
    """
    print(f"Reading and extracting text from: {pdf_path}")
    all_transactions = []
    
    date_pattern = re.compile(r'^\d{2}\s\w{3}\s\d{4}')
    amount_pattern = re.compile(r'(-?\$?[\d,]+\.\d{2}-?)')
    
    junk_patterns = [
        "Created", "While this letter", "we're not responsible", 
        "Transaction Summary", "Account Number", "Page", "Opening Balance", "Closing Balance"
    ]

    try:
        with pdfplumber.open(pdf_path) as pdf:
            full_text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if "Transaction details" in page_text or "Transaction Date" in page_text:
                    full_text += page_text + "\n"

            if not full_text:
                print("Could not find any pages with transaction data.")
                return []

            lines = full_text.split('\n')
            current_transaction = None

            for line in lines:
                if any(jp.lower() in line.lower() for jp in junk_patterns):
                    continue

                if date_pattern.match(line):
                    if current_transaction:
                        all_transactions.append(current_transaction)
                    
                    parts = line.split()
                    if len(parts) < 4: continue 
                        
                    date_str = " ".join(parts[0:3])
                    
                    try:
                        date_obj = datetime.strptime(date_str, '%d %b %Y')
                        formatted_date_str = date_obj.strftime('%Y-%m-%d')
                    except ValueError:
                        formatted_date_str = date_str 

                    full_details_line = " ".join(parts[3:])
                    amount = 0.0
                    cleaned_details = full_details_line
                    
                    matches = amount_pattern.findall(full_details_line)
                    
                    if matches:
                        if len(matches) >= 1:
                            amount_str = matches[0]
                            amount = clean_amount_string(amount_str)
                            cleaned_details = full_details_line.replace(amount_str, " ").strip()
                            
                            details_parts = cleaned_details.split()
                            if details_parts:
                                last_part_cleaned = clean_amount_string(details_parts[-1])
                                if last_part_cleaned != 0 and last_part_cleaned != amount:
                                    cleaned_details = " ".join(details_parts[:-1]).strip()
                    
                    current_transaction = {
                        "date": formatted_date_str,
                        "details": re.sub(r'\s+', ' ', cleaned_details).strip(),
                        "amount": amount
                    }
                    
                elif current_transaction:
                    line_parts = line.strip().split()
                    if len(line_parts) > 1:
                        last_part_cleaned = clean_amount_string(line_parts[-1])
                        if last_part_cleaned != 0 and last_part_cleaned != current_transaction["amount"]:
                             current_transaction["details"] += " " + " ".join(line_parts[:-1]).strip()
                        else:
                            current_transaction["details"] += " " + " ".join(line_parts).strip()
                    else:
                        current_transaction["details"] += " " + line.strip()

            if current_transaction:
                all_transactions.append(current_transaction)
                
            processed_transactions = []
            for tx in all_transactions:
                details = re.sub(r'\s+', ' ', tx["details"]).strip()
                details = re.sub(r'Card xx\d{4}', '', details).strip()
                details = re.sub(r'Value Date: \d{2}/\d{2}/\d{4}', '', details).strip()
                tx["details"] = re.sub(r'\s+', ' ', details).strip()

                # --- 4. UPDATED: Apply categorization using loaded rules ---
                is_income = tx["amount"] >= 0
                category, tx_type = categorize_transaction(tx["details"], rules, is_income)
                
                tx["category"] = category
                tx["type"] = tx_type
                
                processed_transactions.append(tx)

        print(f"Successfully processed {len(processed_transactions)} transactions.")
        return processed_transactions

    except FileNotFoundError:
        print(f"\n❌ ERROR: PDF file not found at '{pdf_path}'.")
        return []
    except Exception as e:
        print(f"\n❌ CRITICAL ERROR during PDF extraction: {e}")
        return []

# --- 5. Main functions now accept rules path ---
def generate_json_report(pdf_file_path, output_json_file, rules_file_path):
    """
    Main function to load rules, extract data, and save it as a JSON file.
    """
    # Load rules first
    rules = load_categorization_rules(rules_file_path)
    
    # Pass rules to the extractor
    extracted_transactions = extract_data_from_pdf(pdf_file_path, rules)

    if not extracted_transactions:
        print("🛑 JSON generation aborted because no transactions were extracted.")
        return

    try:
        with open(output_json_file, 'w') as f:
            json.dump(extracted_transactions, f, indent=4)
        
        print(f"\n✅ SUCCESS: Financial data saved to '{output_json_file}'.")
        print("Next step: Open the React app and upload this JSON file.")
    except Exception as e:
        print(f"\n❌ ERROR: Failed to write JSON file: {e}")

if __name__ == "__main__":
    # --- 6. Configuration now includes rules.json ---
    INPUT_PDF = "my_bank_statement.pdf" 
    OUTPUT_JSON = "financial_data.json"
    RULES_FILE = "rules.json" # The new master file
    
    generate_json_report(INPUT_PDF, OUTPUT_JSON, RULES_FILE)