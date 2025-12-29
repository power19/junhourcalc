# ERPNext Hours Calculator

A web application to display and calculate hours worked from ERPNext POS Closing Entries.

## Features

- Connect to any ERPNext instance using API Key/Secret
- Filter entries by date range
- Filter by user
- Calculate hours worked per entry (difference between period_start_date and period_end_date)
- Display total hours, number of entries, and average hours per entry

## Usage

### Quick Start

```bash
node server.js
```

Then open http://localhost:3000 in your browser.

### Configuration

1. Enter your ERPNext URL (e.g., https://junlin.shop)
2. Enter your API Key and API Secret
3. Select date range
4. Click "Fetch Hours" to load data

## How it Works

The app fetches POS Closing Entry records from ERPNext and calculates the time difference between `period_start_date` and `period_end_date` for each entry. The results are displayed in a table with summary statistics.
