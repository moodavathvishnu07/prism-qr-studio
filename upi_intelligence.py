import re

# UPI Intelligence Engine v1.0
# This dictionary maps VPA handles to their respective platform logos
UPI_BRAND_MAP = {
    r'.*@paytm$': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.logo',
    r'.*@ptm$': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.logo',
    r'.*@ybl$': 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg',
    r'.*@ibl$': 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg',
    r'.*@axl$': 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg',
    r'.*@okaxis$': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg',
    r'.*@okicici$': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg',
    r'.*@okhdfcbank$': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg',
    r'.*@oksbi$': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg',
    r'.*@jupiter$': 'https://jupiter.money/favicon.ico'
}

def identify_upi_brand(vpa):
    """
    Analyzes the VPA and returns the official brand logo URL.
    """
    for pattern, logo in UPI_BRAND_MAP.items():
        if re.match(pattern, vpa.lower()):
            return logo
    return None

if __name__ == "__main__":
    test_vpas = ["6303130741@fam", "user@ybl", "payment@okaxis"]
    print("--- UPI Intelligence Test ---")
    for vpa in test_vpas:
        logo = identify_upi_brand(vpa)
        print(f"VPA: {vpa} -> Logo: {logo}")
