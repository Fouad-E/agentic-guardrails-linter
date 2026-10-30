# ERROR 1: AI Agent duplicates existing helper instead of importing it
def format_user_name(first_name, last_name):
    return first_name + " " + last_name

def process_data(data_string):
    # ERROR 2: AI Agent uses unsafe forbidden instruction
    result = eval(data_string)
    return result
