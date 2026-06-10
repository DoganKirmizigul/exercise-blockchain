import os
import requests

PINATA_API_KEY    = os.getenv("PINATA_API_KEY")
PINATA_API_SECRET = os.getenv("PINATA_API_SECRET")
BASE_URL          = "https://api.pinata.cloud"


def _headers() -> dict:
    if not PINATA_API_KEY or not PINATA_API_SECRET:
        raise ValueError("PINATA_API_KEY or PINATA_API_SECRET env variable is not set")
    return {
        "pinata_api_key":        PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_API_SECRET,
    }


def upload_json(metadata: dict, name: str = "ticket-metadata") -> str:
    """
    Upload a JSON metadata object to IPFS via Pinata.
    Returns the IPFS URI: ipfs://<CID>
    """
    payload = {
        "pinataMetadata": {"name": name},
        "pinataContent": metadata,
    }
    response = requests.post(
        f"{BASE_URL}/pinning/pinJSONToIPFS",
        json=payload,
        headers=_headers(),
    )
    response.raise_for_status()
    cid = response.json()["IpfsHash"]
    return f"ipfs://{cid}"


def upload_file(file_path: str, name: str = "ticket-image") -> str:
    """
    Upload an image/file to IPFS via Pinata.
    Returns the IPFS URI: ipfs://<CID>
    """
    with open(file_path, "rb") as f:
        response = requests.post(
            f"{BASE_URL}/pinning/pinFileToIPFS",
            files={"file": (name, f)},
            data={"pinataMetadata": f'{{"name": "{name}"}}'},
            headers=_headers(),
        )
    response.raise_for_status()
    cid = response.json()["IpfsHash"]
    return f"ipfs://{cid}"


def build_ticket_metadata(
    event_name: str,
    category_name: str,
    event_date: str,
    location: str,
    image_uri: str = "",
) -> dict:
    """
    Build a standard ERC-721 metadata JSON for a ticket.
    """
    return {
        "name": f"{event_name} - {category_name}",
        "description": f"{category_name} ticket for {event_name} on {event_date} at {location}",
        "image": image_uri or "ipfs://",
        "attributes": [
            {"trait_type": "Event",    "value": event_name},
            {"trait_type": "Category", "value": category_name},
            {"trait_type": "Date",     "value": event_date},
            {"trait_type": "Location", "value": location},
        ],
    }


if __name__ == "__main__":
    # Quick test: upload a sample ticket metadata
    from dotenv import load_dotenv
    load_dotenv()

    metadata = build_ticket_metadata(
        event_name="Coldplay Concert",
        category_name="VIP",
        event_date="2026-08-01",
        location="Paris",
    )
    uri = upload_json(metadata, name="coldplay-vip")
    print(f"Metadata uploaded: {uri}")
