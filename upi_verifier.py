import qrcode

def generate_perfect_upi_qr(vpa, name="User", amount=None):
    """
    Generates a technically perfect UPI QR code using Python's qrcode library.
    This serves as a benchmark for scannability.
    """
    # Standard UPI URI construction
    upi_uri = f"upi://pay?pa={vpa}&pn={name}&cu=INR"
    if amount:
        upi_uri += f"&am={amount}"
    
    print(f"Generating QR for: {upi_uri}")
    
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(upi_uri)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save("perfect_upi_qr.png")
    print("Perfect UPI QR saved as perfect_upi_qr.png")

if __name__ == "__main__":
    # Example usage for provided ID
    generate_perfect_upi_qr("6303130741@fam")
