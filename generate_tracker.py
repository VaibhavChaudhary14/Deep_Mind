import pandas as pd
import xlsxwriter

# Define the structure for each sheet
sheets = {
    "Daily Execution": ["Date", "Phase", "Day", "Topic", "Video Watched (Y/N)", "Coding Done (Y/N)", "GitHub Commit Link", "Hours Spent", "Blocker (1 line)"],
    "Weekly Outputs": ["Week", "Focus Theme", "Skills Gained", "Projects Worked", "Repo Link", "Status"],
    "Projects": ["Project Name", "Type", "Dataset", "Models Used", "Metric", "Deployed (Y/N)", "GitHub", "Live Link"],
    "Skill Mapping": ["Skill", "Where Used", "Project Name", "Proof (Notebook/Code)"],
    "Applications": ["Company", "Role", "Platform", "Date Applied", "Status", "Follow-up Date", "Notes"],
    "Cold Emails": ["Company", "Person", "Email", "Date Sent", "Response", "Follow-up"],
    "Interview Prep": ["Topic", "Resource", "Prepared (Y/N)", "Confidence (1–5)"],
    "Deployment": ["Project", "Model Saved", "API Built", "Tested", "Deployed"],
    "Accountability": ["Date", "Planned", "Done", "Excuse Given", "Verdict"]
}

# Example data
data = {
    "Daily Execution": [["2026-02-18", "Phase 1", "Day 1", "Python Basics", "", "", "", "", ""]],
    "Weekly Outputs": [["Week 1", "Python Reset", "", "Mini Stats Tool", "", "In Progress"]],
    "Projects": [["House Price Prediction", "Regression", "Kaggle", "Linear Reg", "RMSE", "N", "", ""]],
    "Skill Mapping": [["Pandas", "Data Cleaning", "Churn Prediction", "notebook.ipynb"]],
    "Applications": [["XYZ AI", "ML Intern", "LinkedIn", "", "Applied", "", ""]],
    "Cold Emails": [["TechCorp", "Jane Doe", "jane@example.com", "", "", ""]],
    "Interview Prep": [["Bias vs Variance", "StatQuest", "", ""]],
    "Deployment": [["Energy Predictor", "", "", "", ""]],
    "Accountability": [["", "3 hrs ML", "1.5 hrs", "Tired", "Failed"]]
}

file_path = "AI_ML_Internship_Tracker.xlsx"

try:
    with pd.ExcelWriter(file_path, engine='xlsxwriter') as writer:
        workbook = writer.book
        # Define formats
        header_format = workbook.add_format({
            'bold': True,
            'text_wrap': True,
            'valign': 'top',
            'fg_color': '#D7E4BC',
            'border': 1
        })
        
        for sheet_name, columns in sheets.items():
            # Create DataFrame
            df_data = data.get(sheet_name, [])
            # Ensure data matches columns length
            clean_data = []
            for row in df_data:
                if len(row) == len(columns):
                    clean_data.append(row)
                else:
                    # Pad or truncate
                    clean_data.append((row + [""] * len(columns))[:len(columns)])
            
            df = pd.DataFrame(clean_data, columns=columns)
            df.to_excel(writer, sheet_name=sheet_name, index=False)
            
            worksheet = writer.sheets[sheet_name]
            
            # Apply header format and set column width
            for col_num, value in enumerate(columns):
                worksheet.write(0, col_num, value, header_format)
                worksheet.set_column(col_num, col_num, 20)
                
    print(f"Successfully created {file_path}")

except Exception as e:
    print(f"Error creating Excel file: {e}")
