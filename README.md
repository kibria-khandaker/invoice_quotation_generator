project and folders details

### professional invoice numbering system
🧾 Smart Sequential Invoice Number Generator (Date-based + Daily reset)


Format (Perfect):
150426Q1001
│ │ │ │   │
│ │ │ │   └── daily serial (1001, 1002...)
│ │ │ └────── Q (quotation separator)
│ │ └──────── year (2026 → 26)
│ └────────── month (04)
└──────────── day (15)

logic লাগবে:
- Today date
- Local storage (AsyncStorage) → counter store করতে হবে
- Daily reset logic